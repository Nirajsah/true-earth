package service

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/genai"
)

type Collection struct {
	Name        string
	Description string
}

type VectorSearchResult struct {
	Document bson.M  `bson:",inline"` // Embeds all fields of the document directly
	Score    float64 `bson:"score"`   // The vector search score, needs to be float64
}

func InitMongoClient() (*mongo.Client, error) {
	ctx := context.Background()

	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found")
	}
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("set your 'ATLAS_CONNECTION_STRING' environment variable.")
	}
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("failed to connect to the server: %v", err)
	}
	// defer func() { _ = client.Disconnect(ctx) }()
	return client, err
}

func GetMongoCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	collection := client.Database("TED").Collection(collectionName)
	return collection
}

// identifyRelevantCollections uses Gemini to determine which MongoDB collections are relevant to a query.
func IdentifyRelevantCollections(ctx context.Context, client *genai.Client, userQuery string, collections []Collection) ([]string, error) {
	history := []*genai.Content{
		genai.NewContentFromText("Starting Fresh, no converstation history", genai.RoleModel),
	}
	var collectionDescriptions strings.Builder
	for _, coll := range collections {
		collectionDescriptions.WriteString(fmt.Sprintf("- Name: %s, Description: %s\n", coll.Name, coll.Description))
	}
	chat, _ := client.Chats.Create(ctx, "gemini-2.0-flash", nil, history)
	sysprompt := fmt.Sprintf(`You are an expert data router. Given a user's query and a list of available data collections 
							  with their descriptions, identify which collection(s) are most relevant to answer the query. 
							  Return only the names of the relevant collection(s) as a comma-separated list. If no collection 
							  is clearly relevant, return "none".
							  Available Collections: %s User Query: "%s" Relevant Collections:`, collectionDescriptions.String(), userQuery)

	prompt := []*genai.Content{
		genai.NewContentFromText(sysprompt, genai.RoleUser),
	}

	resp, err := chat.GenerateContent(ctx, "gemini-2.0-flash", prompt, &genai.GenerateContentConfig{
		MaxOutputTokens: 1000,
	})

	if err != nil {
		return nil, fmt.Errorf("There was an error identifing collection: %e", err)
	}

	responseParts := resp.Candidates[0].Content.Parts

	var rawResponse string
	for _, part := range responseParts {
		text := part.Text
		rawResponse = text
		fmt.Printf("%s\n", text)
	}

	rawResponse = strings.TrimSpace(rawResponse)
	if strings.ToLower(rawResponse) == "none" || rawResponse == "" {
		return []string{}, nil // No relevant collections
	}

	relevantCollections := strings.Split(rawResponse, ",")
	for i := range relevantCollections {
		relevantCollections[i] = strings.TrimSpace(relevantCollections[i])
	}

	return relevantCollections, nil
}

func VectorSearch(ctx context.Context, collection *mongo.Collection, queryEmbedding []float32) (string, error) {
	// pipeline := mongo.Pipeline{
	// 	bson.D{
	// 		{"$vectorSearch", bson.D{
	// 			{"queryVector", queryEmbedding}, // The []float32 embedding vector
	// 			{"index", "vector_index"},       // Your MongoDB Atlas Vector Search index name
	// 			{"path", "text_embedding"},      // The field in your documents containing the embeddings
	// 			{"numCandidates", 100},          // Number of approximate nearest neighbors to consider
	// 			{"limit", 10},                   // Number of top results to return
	// 		}},
	// 	},
	// 	bson.D{
	// 		{"$project", bson.D{
	// 			{"_id", 0},   // Exclude the default _id field
	// 			{"title", 1}, // Include the 'title' field
	// 			{"plot", 1},  // Include the 'plot' field
	// 			{"score", bson.D{{"$meta", "vectorSearchScore"}}}, // Include the vector search score
	// 		}},
	// 	},
	// }
	pipeline := mongo.Pipeline{
		bson.D{
			{"$vectorSearch", bson.D{
				{"queryVector", queryEmbedding},
				{"index", "vector_index"},
				{"path", "text_embedding"},
				{"exact", true},
				{"limit", 5},
			}},
		},
		bson.D{
			{"$project", bson.D{
				{"_id", 0},  // Exclude the default _id field
				{"text", 1}, // Include the 'plot' field
				{"score", bson.D{
					{"$meta", "vectorSearchScore"},
				}},
			}},
		},
	}
	// Run the pipeline
	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		log.Fatalf("failed to run aggregation: %v", err)
	}
	// defer func() { _ = cursor.Close(ctx) }()

	var matchingDocs []VectorSearchResult
	var returingCtx strings.Builder
	if err = cursor.All(ctx, &matchingDocs); err != nil {
		log.Fatalf("failed to unmarshal results to TextAndScore objects: %v", err)
	}
	for _, doc := range matchingDocs {
		// fmt.Printf("There is docs: %v", doc)
		returingCtx.WriteString(doc.Document["text"].(string))
	}

	return returingCtx.String(), err
}
