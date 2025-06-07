package main

import (
	pb "ai_orchestrator/proto"
	"context"
	"fmt"
	"log"
	"net"

	// For environment variables, though not strictly needed for "hello"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedGreeterServer
}

const ( 
	// Port is the port on which the server will listen
	port = ":50051"
	// ServiceName is the name of the service
	ServiceName = "GreeterService"
)

func (s *server) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
	if req.GetName() == "" {
		return nil, fmt.Errorf("name cannot be empty")
	}
	// Construct the response message
	responseMessage := fmt.Sprintf("Hello, %s from Go gRPC server!", req.GetName())
	return &pb.HelloResponse{Message: responseMessage}, nil
}

func main() {
	fmt.Println("AI Orchestrator is running...")

	// Create a TCP listener on the specified port
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("Failed to listen on port %s: %v", port, err)
	}
	// Create a new gRPC server instance.
	s := grpc.NewServer()

	// Register your Greeter service with the gRPC server.
	// This tells the server to route incoming requests for `Greeter` service to our `server` struct.
	pb.RegisterGreeterServer(s, &server{}) // Pass an instance of our server struct

	log.Printf("Go gRPC server listening at %v", lis.Addr())

	// Start the gRPC server
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve gRPC server: %v", err)
	}
}