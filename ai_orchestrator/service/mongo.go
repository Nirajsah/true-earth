package service

import "go.mongodb.org/mongo-driver/mongo"

func GetContext(embeddings []float64) {
}
const mongoURI = "mongodb://localhost:27017"

// InitMongoClient initializes and returns a new MongoDB client.
// It takes a context.Context to manage the connection lifecycle.

func InitMongoClient(client *mongo.Client, dbName string, collectionName string) {
	chatCollection = client.Database(dbName).Collection(collectionName)
}