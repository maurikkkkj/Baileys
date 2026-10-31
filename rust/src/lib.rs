use futures_util::{SinkExt, StreamExt};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::error::Error;
use tokio_tungstenite::{connect_async, tungstenite::Message, WebSocketStream};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BotCommand {
    pub action: String,
    pub payload: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BotEvent {
    pub event: String,
    pub payload: serde_json::Value,
}

pub struct BaileysClient {
    url: String,
}

impl BaileysClient {
    pub fn new(url: impl Into<String>) -> Self {
        Self { url: url.into() }
    }

    pub async fn connect(&self) -> Result<BaileysConnection, Box<dyn Error + Send + Sync>> {
        let (socket, _) = connect_async(&self.url).await?;
        Ok(BaileysConnection { socket })
    }
}

pub struct BaileysConnection {
    socket: WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>,
}

impl BaileysConnection {
    pub async fn send_json<T: Serialize>(&mut self, payload: &T) -> Result<(), Box<dyn Error + Send + Sync>> {
        let json = serde_json::to_string(payload)?;
        self.socket.send(Message::Text(json)).await?;
        Ok(())
    }

    pub async fn recv_json<T: DeserializeOwned>(&mut self) -> Result<T, Box<dyn Error + Send + Sync>> {
        let message = self.socket.next().await.ok_or("conexão encerrada")??;

        match message {
            Message::Text(text) => Ok(serde_json::from_str(&text)?),
            Message::Binary(bytes) => Ok(serde_json::from_slice(&bytes)?),
            Message::Close(_) => Err("conexão fechada pelo servidor".into()),
            _ => Err("tipo de mensagem não suportado".into()),
        }
    }

    pub async fn send_command(&mut self, action: &str, payload: serde_json::Value) -> Result<(), Box<dyn Error + Send + Sync>> {
        self.send_json(&BotCommand { action: action.to_string(), payload }).await
    }

    pub async fn recv_event(&mut self) -> Result<BotEvent, Box<dyn Error + Send + Sync>> {
        self.recv_json().await
    }
}
