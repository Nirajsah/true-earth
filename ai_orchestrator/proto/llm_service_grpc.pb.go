// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             v5.29.3
// source: llm_service.proto

package llm_service

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	EmbeddingService_GetEmbedding_FullMethodName       = "/llm_service.EmbeddingService/GetEmbedding"
	EmbeddingService_GetBatchEmbeddings_FullMethodName = "/llm_service.EmbeddingService/GetBatchEmbeddings"
)

// EmbeddingServiceClient is the client API for EmbeddingService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
//
// Service definition for embedding operations.
type EmbeddingServiceClient interface {
	// GetEmbedding generates an embedding for a single text.
	GetEmbedding(ctx context.Context, in *EmbeddingRequest, opts ...grpc.CallOption) (*EmbeddingResult, error)
	// GetBatchEmbeddings generates embeddings for multiple texts in a single call.
	GetBatchEmbeddings(ctx context.Context, in *BatchEmbeddingRequest, opts ...grpc.CallOption) (*EmbeddingResponse, error)
}

type embeddingServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewEmbeddingServiceClient(cc grpc.ClientConnInterface) EmbeddingServiceClient {
	return &embeddingServiceClient{cc}
}

func (c *embeddingServiceClient) GetEmbedding(ctx context.Context, in *EmbeddingRequest, opts ...grpc.CallOption) (*EmbeddingResult, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(EmbeddingResult)
	err := c.cc.Invoke(ctx, EmbeddingService_GetEmbedding_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *embeddingServiceClient) GetBatchEmbeddings(ctx context.Context, in *BatchEmbeddingRequest, opts ...grpc.CallOption) (*EmbeddingResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(EmbeddingResponse)
	err := c.cc.Invoke(ctx, EmbeddingService_GetBatchEmbeddings_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// EmbeddingServiceServer is the server API for EmbeddingService service.
// All implementations must embed UnimplementedEmbeddingServiceServer
// for forward compatibility.
//
// Service definition for embedding operations.
type EmbeddingServiceServer interface {
	// GetEmbedding generates an embedding for a single text.
	GetEmbedding(context.Context, *EmbeddingRequest) (*EmbeddingResult, error)
	// GetBatchEmbeddings generates embeddings for multiple texts in a single call.
	GetBatchEmbeddings(context.Context, *BatchEmbeddingRequest) (*EmbeddingResponse, error)
	mustEmbedUnimplementedEmbeddingServiceServer()
}

// UnimplementedEmbeddingServiceServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedEmbeddingServiceServer struct{}

func (UnimplementedEmbeddingServiceServer) GetEmbedding(context.Context, *EmbeddingRequest) (*EmbeddingResult, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetEmbedding not implemented")
}
func (UnimplementedEmbeddingServiceServer) GetBatchEmbeddings(context.Context, *BatchEmbeddingRequest) (*EmbeddingResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetBatchEmbeddings not implemented")
}
func (UnimplementedEmbeddingServiceServer) mustEmbedUnimplementedEmbeddingServiceServer() {}
func (UnimplementedEmbeddingServiceServer) testEmbeddedByValue()                          {}

// UnsafeEmbeddingServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to EmbeddingServiceServer will
// result in compilation errors.
type UnsafeEmbeddingServiceServer interface {
	mustEmbedUnimplementedEmbeddingServiceServer()
}

func RegisterEmbeddingServiceServer(s grpc.ServiceRegistrar, srv EmbeddingServiceServer) {
	// If the following call pancis, it indicates UnimplementedEmbeddingServiceServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&EmbeddingService_ServiceDesc, srv)
}

func _EmbeddingService_GetEmbedding_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(EmbeddingRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(EmbeddingServiceServer).GetEmbedding(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: EmbeddingService_GetEmbedding_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(EmbeddingServiceServer).GetEmbedding(ctx, req.(*EmbeddingRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _EmbeddingService_GetBatchEmbeddings_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(BatchEmbeddingRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(EmbeddingServiceServer).GetBatchEmbeddings(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: EmbeddingService_GetBatchEmbeddings_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(EmbeddingServiceServer).GetBatchEmbeddings(ctx, req.(*BatchEmbeddingRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// EmbeddingService_ServiceDesc is the grpc.ServiceDesc for EmbeddingService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var EmbeddingService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "llm_service.EmbeddingService",
	HandlerType: (*EmbeddingServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetEmbedding",
			Handler:    _EmbeddingService_GetEmbedding_Handler,
		},
		{
			MethodName: "GetBatchEmbeddings",
			Handler:    _EmbeddingService_GetBatchEmbeddings_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "llm_service.proto",
}

const (
	PromptService_GeneratePrompt_FullMethodName = "/llm_service.PromptService/GeneratePrompt"
)

// PromptServiceClient is the client API for PromptService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
//
// Service definition for prompt generation.
type PromptServiceClient interface {
	// GeneratePrompt sends a text prompt to the LLM and returns the generated text.
	GeneratePrompt(ctx context.Context, in *PromptRequest, opts ...grpc.CallOption) (grpc.ServerStreamingClient[PromptResponse], error)
}

type promptServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewPromptServiceClient(cc grpc.ClientConnInterface) PromptServiceClient {
	return &promptServiceClient{cc}
}

func (c *promptServiceClient) GeneratePrompt(ctx context.Context, in *PromptRequest, opts ...grpc.CallOption) (grpc.ServerStreamingClient[PromptResponse], error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	stream, err := c.cc.NewStream(ctx, &PromptService_ServiceDesc.Streams[0], PromptService_GeneratePrompt_FullMethodName, cOpts...)
	if err != nil {
		return nil, err
	}
	x := &grpc.GenericClientStream[PromptRequest, PromptResponse]{ClientStream: stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

// This type alias is provided for backwards compatibility with existing code that references the prior non-generic stream type by name.
type PromptService_GeneratePromptClient = grpc.ServerStreamingClient[PromptResponse]

// PromptServiceServer is the server API for PromptService service.
// All implementations must embed UnimplementedPromptServiceServer
// for forward compatibility.
//
// Service definition for prompt generation.
type PromptServiceServer interface {
	// GeneratePrompt sends a text prompt to the LLM and returns the generated text.
	GeneratePrompt(*PromptRequest, grpc.ServerStreamingServer[PromptResponse]) error
	mustEmbedUnimplementedPromptServiceServer()
}

// UnimplementedPromptServiceServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedPromptServiceServer struct{}

func (UnimplementedPromptServiceServer) GeneratePrompt(*PromptRequest, grpc.ServerStreamingServer[PromptResponse]) error {
	return status.Errorf(codes.Unimplemented, "method GeneratePrompt not implemented")
}
func (UnimplementedPromptServiceServer) mustEmbedUnimplementedPromptServiceServer() {}
func (UnimplementedPromptServiceServer) testEmbeddedByValue()                       {}

// UnsafePromptServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to PromptServiceServer will
// result in compilation errors.
type UnsafePromptServiceServer interface {
	mustEmbedUnimplementedPromptServiceServer()
}

func RegisterPromptServiceServer(s grpc.ServiceRegistrar, srv PromptServiceServer) {
	// If the following call pancis, it indicates UnimplementedPromptServiceServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&PromptService_ServiceDesc, srv)
}

func _PromptService_GeneratePrompt_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(PromptRequest)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(PromptServiceServer).GeneratePrompt(m, &grpc.GenericServerStream[PromptRequest, PromptResponse]{ServerStream: stream})
}

// This type alias is provided for backwards compatibility with existing code that references the prior non-generic stream type by name.
type PromptService_GeneratePromptServer = grpc.ServerStreamingServer[PromptResponse]

// PromptService_ServiceDesc is the grpc.ServiceDesc for PromptService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var PromptService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "llm_service.PromptService",
	HandlerType: (*PromptServiceServer)(nil),
	Methods:     []grpc.MethodDesc{},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "GeneratePrompt",
			Handler:       _PromptService_GeneratePrompt_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "llm_service.proto",
}
