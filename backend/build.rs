fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("cargo:rerun-if-changed=proto/llm_service.proto");
    tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .compile(&["proto/llm_service.proto"], &["proto"])?;
    Ok(())
}