package service

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/genai"
)

type Memory struct {
	chatHistoryCollection mongo.Collection
}

// NewMemory initializes a new Memory instance.
func NewMemory(collection mongo.Collection) *Memory {
	return &Memory{
		// If using MongoDB, you would pass the *mongo.Collection here
		chatHistoryCollection: collection,
	}
}

// for memory i would need, add to memory(a conv with roles), get from memory(conv with roles)
func (m *Memory) Push(userID string, turn ConversationTurn) error {
	ctx := context.Background()
	filter := bson.M{"user_id": userID}
	update := bson.M{
		"$push": bson.M{
			"messages": turn,
		},
	}
	opts := options.Update().SetUpsert(true)
	_, err := m.chatHistoryCollection.UpdateOne(ctx, filter, update, opts)
	fmt.Printf("A new converstation is received %s", turn)
	return err
}

// Pull retrieves the user's chat history and converts it to Gemini Content.
func (m *Memory) Pull(userID string, limit uint16) ([]*genai.Content, error) {
	ctx := context.Background()

	var history ConversationHistory
	// var genaiContents []*genai.Content
	genaiContents := make([]*genai.Content, 0)

	filter := bson.M{"user_id": userID}
	options := options.FindOne().SetProjection(bson.M{
		"messages": bson.M{
			"$slice": -int(limit), // get the last N turns
		},
	})
	err := m.chatHistoryCollection.FindOne(ctx, filter, options).Decode(&history)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			// No conversation found — OK
			return []*genai.Content{}, nil
		}
		// Real DB error
		return nil, err
	}

	for _, turn := range history.Messages {
		if turn.Query != "" {
			genaiContents = append(genaiContents, genai.NewContentFromText(turn.Query, genai.RoleUser))
		}
		if turn.Response != "" {
			genaiContents = append(genaiContents, genai.NewContentFromText(turn.Response, genai.RoleModel))
		}
	}

	return genaiContents, nil
}

// Agent represents a conversational agent (LLM wrapper with memory and instructions)
type Agent struct {
	Name           string   `json:"name"`                 // Name of the agent
	Description    string   `json:"description"`          // Description of agent's purpose
	Capabilities   []string `json:"capabilities"`         // List of skills or supported actions
	SysInstruction string   `json:"system_instruction"`   // System-level instructions for prompt building
	ResInstruction string   `json:"response_instruction"` // Instructions for generating responses
	Memory         *Memory  `json:"agent_memory"`
}

type ConversationTurn struct {
	Query    string `bson:"query" json:"query"`
	Response string `bson:"response" json:"response"`
}

type ConversationHistory struct {
	UserID   string             `bson:"user_id" json:"user_id"`
	Messages []ConversationTurn `bson:"messages" json:"messages"`
}

// NewAgent creates a new agent instance
func NewAgent(name, description string, mongoCollection mongo.Collection) *Agent {
	return &Agent{
		Name:           name,
		Description:    description,
		Capabilities:   []string{},
		SysInstruction: "",
		ResInstruction: "",
		Memory:         NewMemory(mongoCollection),
	}
}

func (a *Agent) AddCapability(capability string) {
	a.Capabilities = append(a.Capabilities, capability)
}

func (a *Agent) AddSysInstruction(instruction string) {
	a.SysInstruction = instruction
}

func (a *Agent) AddResInstruction(instruction string) {
	a.ResInstruction = instruction
}

func BuildPrompt(
	sysInstruction string,
	resInstruction string,
	retrievedContext string,
	history []*genai.Content, // Now explicitly accepting conversation history
	newQuestion string,
) []*genai.Content {

	// 1. The System Instruction (RoleModel)
	// This sets the foundational rules and persona for Leafy. It typically comes first.
	sys := genai.NewContentFromText(sysInstruction, genai.RoleModel)

	// 2. The Current Turn's User Content (Context, Response Instructions, New Question)
	// This block provides all the immediate information Leafy needs to craft its current response.
	userPromptContent := fmt.Sprintf(`
**--- Information for Leafy's Current Response ---**

### 🔍 Retrieved Knowledge Base Context:
This section contains highly relevant data and facts retrieved from Leafy's specialized databases based on the current user query and conversation history. Utilize this information thoroughly to answer the user's question accurately and comprehensively.
%s

---

### 📝 Model Response Guidelines:
These are Leafy's specific instructions for crafting the current response. Adhere strictly to these guidelines to maintain consistency in tone, format, and content delivery. Ensure your answer is friendly, clear, and focused on climate/environmental topics, avoiding raw coordinates and summarizing data by country, as outlined in Leafy's core system instructions.
%s

---

### ❓ User's Current Question:
This is the latest question or prompt from the user. Read it carefully to understand the user's intent and provide a helpful, relevant answer based on all the information provided above.
%s

**--- End of Input for Current Turn ---**
`,
		retrievedContext,
		resInstruction,
		newQuestion,
	)

	// Create the genai.Content object for the current user turn.
	currentUserContent := genai.NewContentFromText(userPromptContent, genai.RoleUser)

	// 3. Assemble the Final Prompt Sequence:
	// The order is crucial: System Instruction -> History -> Current User's Content.
	// This mimics a natural conversation flow that models are trained on.

	// Start with the system instruction.
	finalPrompt := []*genai.Content{sys}

	// Append the conversation history. The '...' unpacks the slice elements.
	finalPrompt = append(finalPrompt, history...)

	// Append the current user's detailed content.
	finalPrompt = append(finalPrompt, currentUserContent)

	return finalPrompt
}
