fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("cargo:rerun-if-changed=../proto/greeter.proto");
    tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .compile(&["../proto/greeter.proto"], &["../proto"])?;
    Ok(())
}