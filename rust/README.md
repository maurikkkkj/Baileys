# Baileys em Rust

Este diretório cria um ponto de partida para usar a lógica de conexão do Baileys em Rust, sem reescrever totalmente a biblioteca JavaScript original.

A ideia é simples:

- manter o núcleo do Baileys em JavaScript/TypeScript
- expor uma conexão WebSocket/HTTP
- conectar um bot em Rust a essa camada de transporte

Isso é mais realista e menos frágil do que tentar migrar o protocolo completo do WhatsApp em uma única etapa.

## Estrutura

- `Cargo.toml`: define o crate Rust
- `src/lib.rs`: cliente WebSocket para conexão com o Baileys
- `examples/connect_bot.rs`: exemplo de bot conectando ao serviço

## Como usar

1. Inicie o seu backend Baileys em Node/JS e exponha um socket em `ws://127.0.0.1:3000`
2. Rode o exemplo Rust:

```bash
cd rust
cargo run --example connect_bot
```

3. Opcionalmente, defina a URL manualmente:

```bash
BAILEYS_WS_URL=ws://127.0.0.1:3000 cargo run --example connect_bot
```

## Fluxo esperado

- o Rust abre a conexão WebSocket
- envia um comando inicial (`ping` ou `auth`)
- escuta eventos do Baileys
- pode enviar mensagens e processar eventos do WhatsApp

## Observação importante

O protocolo do WhatsApp/Baileys é muito grande e envolve autenticação, QR, sessões, criptografia e eventos de socket. A migração total para Rust requer uma portabilidade completa do protocolo, o que não é um ajuste pequeno.

Este módulo funciona como base de conexão e integração, e pode evoluir para:

- autenticação com QR
- recebimento de mensagens
- envio de texto/imagens
- comandos do bot
- persistência de sessão

Se quiser, no próximo passo eu posso transformar isso em um cliente Rust mais avançado com autenticação, parsing de eventos e envio de mensagens reais.
