package service

import (
	"context"
	"fmt"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Role string

const (
	USER  Role = "user"
	AGENT Role = "agent"
)

// Message represents a single message in the conversation
type Message struct {
	UserID    string    `bson:"user_id" json:"user_id"`     // Redundant in MongoDB array, but useful if needed
	Role      Role      `bson:"role" json:"role"`           // "user" or "agent"
	Content   string    `bson:"content" json:"content"`     // Actual message text
}

// Agent represents a conversational agent (LLM wrapper with memory and instructions)
type Agent struct {
	Name         string       `json:"name"`         // Name of the agent
	Description  string       `json:"description"`  // Description of agent's purpose
	Capabilities []string     `json:"capabilities"` // List of skills or supported actions
	SysInstruction  string       `json:"system_instruction"`  // System-level instructions for prompt building
	ResInstruction  string       `json:"response_instruction"` // Instructions for generating responses
}

type ConversationTurn struct {
	Query    string `bson:"query" json:"query"`
	Response string `bson:"response" json:"response"`
}

type ConversationHistory struct {
	UserID   string             `bson:"user_id" json:"user_id"`
	Messages []ConversationTurn `bson:"messages" json:"messages"`
}

// MongoDB-backed chat history service
var chatCollection *mongo.Collection



// NewAgent creates a new agent instance
func NewAgent(name, description string) *Agent {
	return &Agent{
		Name:         name,
		Description:  description,
		Capabilities: []string{},
		SysInstruction:  "",
		ResInstruction:  "",
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

func ConstructionUserMessage(user_id string, role Role, content string) Message {
	msg := Message{
		UserID:    user_id,
		Content:   content,
	}
	return msg
}

func ConstructionAgentMessage(role Role, content string) Message {
	msg := Message{
		UserID:    "",
		Content:   content,
	}
	return msg
}

func (a *Agent) AddConversation(userID string, userMessage Message, agentMessage Message) error {
	// Save both messages in one atomic MongoDB update
	return SaveTurnToMongo(userID, ConversationTurn{
		Query:    userMessage.Content,
		Response: agentMessage.Content,
	})
}

func SaveTurnToMongo(userID string, turn ConversationTurn) error {
	ctx := context.Background()
	filter := bson.M{"user_id": userID}
	update := bson.M{
		"$push": bson.M{
			"messages": turn,
		},
	}
	opts := options.Update().SetUpsert(true)
	_, err := chatCollection.UpdateOne(ctx, filter, update, opts)
	return err
}

func GetRecentTurns(userID string, limit int) ([]ConversationTurn, error) {
	ctx := context.Background()
	var history ConversationHistory

	filter := bson.M{"user_id": userID}
	projection := bson.M{"messages": bson.M{"$slice": -limit}}

	err := chatCollection.FindOne(ctx, filter, options.FindOne().SetProjection(projection)).Decode(&history)
	if err != nil {
		return nil, err
	}

	return history.Messages, nil
}

func BuildPrompt(sysInstruction string, resInstruction string, messages []ConversationTurn, retrievedContext string, newQuestion string) string {
	var sb strings.Builder

	sb.WriteString(sysInstruction)
	sb.WriteString("\n\nChat History:\n")
	for _, msg := range messages {
		sb.WriteString(fmt.Sprintf("User: %s\n", msg.Query))
		sb.WriteString(fmt.Sprintf("Agent: %s\n", msg.Response))
	}

	sb.WriteString("\nContext:\n")
	sb.WriteString(retrievedContext)

	sb.WriteString("\n\nResponse Instructions:\n")
	sb.WriteString(resInstruction)
	sb.WriteString("\n\nQuestion:\n")
	sb.WriteString(newQuestion)

	return sb.String()
}