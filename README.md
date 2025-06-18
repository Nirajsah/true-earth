# 🌍 TrueEarth - Global Climate & Disaster Monitoring Platform

TrueEarth is a comprehensive climate and disaster monitoring platform that provides interactive visualization of global environmental events, powered by AI-driven insights. This project demonstrates modern full-stack architecture with easy data processing and AI-powered analysis.

## 🏗️ Architecture Overview

TrueEarth follows a microservices architecture with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │ AI Orchestrator │
│   (Next.js)     │◄──►│   (Rust/Axum)   │◄──►│   (Go/gRPC)     │
│                 │    │                 │    │                 │
│ • 3D Globe      │    │ • REST API      │    │ • AI Chat       │
│ • Real-time     │    │ • Data Ingestion│    │ • Embeddings    │
│ • AI Chat UI    │    │ • MongoDB       │    │ • Vector Search │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Services Breakdown

### 🌐 Frontend (Next.js + TypeScript)

**Location**: `/frontend/`

The frontend provides an immersive user experience with:

- **Interactive 3D Globe**: Built with `react-globe.gl` and Three.js for real-time visualization of global events
- **AI Chat Interface**: Seamless conversation with the AI assistant about climate and disaster data
- **Real-time Data Display**: Live updates of fire events, earthquakes, and other disasters
- **Advanced Filtering**: Time-based and geographic filtering of events
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components

**Key Features**:

- Event visualization on a 3D globe
- AI-powered chat for climate insights
- Time-range filtering (1 day to 6 months)
- Country-specific event filtering
- Session-based chat history persistence

### 🔧 Backend (Rust + Axum)

**Location**: `/backend/`

The backend serves as the data processing and API layer:

- **REST API**: Provides endpoints for event data and AI chat
- **Data Ingestion Pipeline**: Processes data from multiple sources
- **MongoDB Integration**: Stores events with vector embeddings
- **gRPC Client**: Communicates with AI Orchestrator for embeddings and chat

**Data Models**:

- **FireEvent**: FIRMS satellite fire detection data
- **EarthquakeEvent**: USGS earthquake data
- **DisasterRecord**: EM-DAT comprehensive disaster records

### 🤖 AI Orchestrator (Go + gRPC)

**Location**: `/ai_orchestrator/`

The AI service handles all AI-related operations:

- **Vector Embeddings**: Generates embeddings for semantic search
- **AI Chat**: Powered by Google Gemini for climate-focused conversations
- **Vector Search**: Performs semantic search across disaster databases
- **Memory Management**: Maintains conversation context per user session

**Key Capabilities**:

- Batch embedding generation for efficient processing
- Context-aware AI responses using vector search
- Conversation memory with MongoDB persistence
- Climate and disaster-specific knowledge base

## 📊 Data Sources & Ingestion

TrueEarth integrates data from three major authoritative sources:

### 🔥 FIRMS (Fire Information for Resource Management System)

- **Source**: NASA's Fire Information for Resource Management System
- **Data**: Satellite-based fire detection and monitoring
- **Fields**: Location, brightness, radiative power, confidence, satellite info
- **Update Frequency**: Near real-time
- **Coverage**: Global

### 🌋 USGS (United States Geological Survey)

- **Source**: USGS Earthquake Hazards Program
- **Data**: Global earthquake events and seismic activity
- **Fields**: Location, magnitude, depth, time, magnitude scale
- **Update Frequency**: Real-time
- **Coverage**: Global

### 🌊 EM-DAT (Emergency Events Database)

- **Source**: The Centre for Research on the Epidemiology of Disasters (CRED) distributes the data in open access for non-commercial use.
- **Data**: Comprehensive historical natural disaster records
- **Fields**: Disaster type, location, human impact, economic impact, dates
- **Update Frequency**: Historical database
- **Coverage**: Global

### 🔄 Data Ingestion Process

1. **Data Fetching**: Raw data is downloaded from source APIs/CSVs
2. **Data Parsing**: Structured data is parsed into strongly-typed Rust models
3. **Geographic Processing**: Country boundaries are determined using R-tree spatial indexing
4. **Text Generation**: Natural language descriptions are generated for each event
5. **Embedding Generation**: Text descriptions are converted to vector embeddings via gRPC
6. **Database Storage**: Events with embeddings are stored in MongoDB with vector indexes

**Ingestion Command**:

```bash
# Start the backend with data ingestion
cargo run --bin server -- --start-ingestion
```

## 🔗 Service Communication

### Frontend ↔ Backend

- **Protocol**: HTTP REST API
- **Data Format**: JSON
- **Authentication**: Session-based (x-session-id header)

### Backend ↔ AI Orchestrator

- **Protocol**: gRPC
- **Services**: EmbeddingService, PromptService
- **Data Format**: Protocol Buffers

### All Services ↔ MongoDB

- **Protocol**: MongoDB Wire Protocol
- **Collections**: fire_event, quake_event, em_dat, agent
- **Indexes**: Vector indexes for semantic search

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 with React 19
- **3D Visualization**: react-globe.gl, Three.js
- **Styling**: Tailwind CSS, Radix UI, ShadcnUI
- **State Management**: React Context

### Backend

- **Language**: Rust
- **Framework**: Axum (async web framework)
- **Database**: MongoDB with vector search
- **Serialization**: Serde, Protocol Buffers
- **Spatial Indexing**: R-tree for geographic queries

### AI Orchestrator

- **Language**: Go
- **Framework**: gRPC
- **AI Provider**: Google Gemini API
- **Vector Operations**: Custom embedding generation
- **Memory**: MongoDB-based conversation storage

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Deployment**: Google Cloud Platform (Cloud Run)
- **CI/CD**: Cloud Build
- **Monitoring**: Built-in health checks

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Rust toolchain (for local development)
- Go 1.21+ (for AI orchestrator development)
- Node.js 18+ (for frontend development)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd true_earth

# Edit .env with your API keys and MongoDB URI
# Setup env variables
```

### Local Development

```bash
# Backend (Rust)
cd backend
cargo run --bin server

# AI Orchestrator (Go)
cd ai_orchestrator
go run main.go

# Frontend (Next.js)
cd frontend
npm install
npm run dev
```

## 🙏 Acknowledgments

We are deeply grateful to the following organizations for providing the data that makes TrueEarth possible:

### 🌟 Data Providers

- **FIRMS (NASA)**: For providing real-time satellite-based fire detection data that enables global fire monitoring
- **USGS**: For maintaining the comprehensive earthquake database that tracks global seismic activity
- **EM-DAT (CRED)**: For curating the world's most comprehensive database of natural disasters and their human impact

### 🛠️ Open Source Libraries

- **react-globe.gl**: For the beautiful 3D globe visualization
- **Axum**: For the high-performance Rust web framework
- **MongoDB**: For the flexible document database with vector search capabilities
- **Google Gemini**: For the AI capabilities that power our climate assistant

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for a better understanding of our planet's climate and natural events.**
