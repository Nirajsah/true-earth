use ingest::fire_event::*;
mod ingest;

/* #[tokio::main]
async fn main() {
    let app = Router::new().route("/api/hello", get(say_hello));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {}", addr);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
} */

fn main() {
    let raw = serde_json::json!({
      "latitude": -12.91115,
      "longitude": 133.40683,
      "brightness": 313.26,
      "scan": 1.12,
      "track": 1.05,
      "acq_date": "2025-05-17",
      "acq_time": "0033",
      "satellite": "T",
      "confidence": 49,
      "version": "6.1NRT",
      "bright_t31": 296.2,
      "frp": 8.2,
      "daynight": "D"
    });

    let fire_event = FireEvent::try_parse(&raw);
    println!("Here is FireEvent: {:?}", fire_event);
}

// Performs a final check before constructing a FireReport and pushing it to db.
/* fn final_check(
    fire_event: Option<FireEvent>,
    weather_impact: Option<WeatherImpact>,
    land_impact: Option<LandImpact>,
) -> Option<(FireEvent, WeatherImpact, LandImpact)> {
    Some((fire_event?, weather_impact?, land_impact?))
} */
