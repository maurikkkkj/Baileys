use baileys_rust::BaileysClient;

#[tokio::main]
async fn main() {
    let url = std::env::var("BAILEYS_WS_URL").unwrap_or_else(|_| "ws://127.0.0.1:3000".to_string());

    println!("Conectando ao Baileys em: {}", url);

    let client = BaileysClient::new(url);
    let mut socket = match client.connect().await {
        Ok(socket) => socket,
        Err(err) => {
            eprintln!("Erro ao conectar: {}", err);
            std::process::exit(1);
        }
    };

    println!("Conexão estabelecida. Enviando comando inicial...");

    let command = serde_json::json!({
        "action": "ping",
        "payload": {
            "message": "Bot Rust conectado",
            "status": "online"
        }
    });

    if let Err(err) = socket.send_command("ping", command["payload"].clone()).await {
        eprintln!("Erro ao enviar ping: {}", err);
        std::process::exit(1);
    }

    println!("Aguardando eventos do Baileys...");

    loop {
        match socket.recv_event().await {
            Ok(event) => {
                println!("Evento recebido: {}", serde_json::to_string_pretty(&event).unwrap());
            }
            Err(err) => {
                eprintln!("Erro na leitura da conexão: {}", err);
                break;
            }
        }
    }
}
