# 🏗️ Build stage
FROM rust:1.82-slim AS builder

# Install build deps
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*


# Set workdir
WORKDIR /app

# Copy proto files first - these are needed by build.rs
COPY proto ./proto

# Cache dependencies:
# Copy Cargo.toml and Cargo.lock first to leverage Docker layer caching.
# This step only runs if Cargo.toml or Cargo.lock change.
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs and build to download and cache dependencies.
# Use --frozen to ensure Cargo.lock is up-to-date with Cargo.toml
# and --offline for subsequent builds once deps are cached.
# --release is used here to match the final build environment.
RUN mkdir -p src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release --bin server

# Remove the dummy src/main.rs to avoid conflicts with the actual source.
RUN rm src/main.rs

# Now copy actual source code (excluding proto since it's already copied)
COPY src ./src
COPY build.rs ./

# Build your actual binary
# This step will be fast if dependencies are cached and only your source code changed.
RUN cargo build --release

# 🚀 Runtime stage
FROM debian:bookworm-slim

# Runtime deps
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Create user
RUN useradd -r -s /bin/false appuser

# Copy binary
WORKDIR /app
COPY --from=builder /app/target/release/server /app/server

# If 'em_parse' is genuinely needed and always built, uncomment and keep this.
# Otherwise, remove it to prevent build failures if it's missing.
# COPY --from=builder /app/target/release/em_parse /app/em_parse

# Copy static data files if needed
COPY *.csv ./

# Ownership
RUN chown -R appuser:appuser /app

# Switch user
USER appuser

# Expose port
EXPOSE 8080

# Start app
CMD ["./server"]