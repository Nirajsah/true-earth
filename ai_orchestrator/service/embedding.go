package service

import (
	"context"
	"fmt"
	"log"

	"google.golang.org/genai"
)

// GenerateEmbeddings method to generate embeddings for a given text using Google's text-embedding-004 model.
// It returns a slice of float32 representing the embedding vector.
func GenerateEmbeddings(client *genai.Client, text string) ([]float32, error) {
	// location := "us-central1"
	ctx := context.Background()

	contents := []*genai.Content{
		genai.NewContentFromText(text, genai.RoleUser),
	}

    result, err := client.Models.EmbedContent(ctx,
        "text-embedding-004",
        contents,
        nil,
    )
    if err != nil {
        log.Fatal(err)
    }
	embedding := result.Embeddings[0].Values

	return embedding, err
}


func GenerateBatchEmbeddings(client *genai.Client, texts []string) ([][]float32, error) {
	ctx := context.Background() // Or pass context from caller

	// 1. Create a slice of *genai.Content for all your texts
	var contents []*genai.Content
	for _, text := range texts {
		contents = append(contents, genai.NewContentFromText(text, genai.RoleUser))
	}

	// 2. Call EmbedContent with the slice of contents
	result, err := client.Models.EmbedContent(
		ctx,
		"text-embedding-004",
		contents,
		nil, // Optional: EmbedContentConfig for parameters like output_dimensionality
	)
	if err != nil {
		return nil, fmt.Errorf("error calling EmbedContent in batch: %w", err)
	}

	// 3. Process the response: Iterate through result.Embeddings
	if len(result.Embeddings) != len(texts) {
		log.Printf("Warning: Number of returned embeddings (%d) does not match number of input texts (%d)", len(result.Embeddings), len(texts))
	}

	var allEmbeddings [][]float32
	for i, embedding := range result.Embeddings {
		// Each 'embedding' here is a *genai.ContentEmbedding
		// Its .Values field contains the actual float32 vector
		if len(embedding.Values) > 0 {
			allEmbeddings = append(allEmbeddings, embedding.Values) // Convert to []float64 if needed
		} else {
			// Handle cases where an embedding might not be generated for a specific text
			log.Printf("No embedding values found for input text #%d: '%s'", i, texts[i])
			allEmbeddings = append(allEmbeddings, nil) // Or a zero-vector, depending on your error handling strategy
		}
	}

	return allEmbeddings, nil
}