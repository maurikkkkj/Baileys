const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, DisconnectReason } = require('../lib');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');
const { promisify } = require('util');
const sharp = require('sharp');

const execFileAsync = promisify(execFile);

function getMediaInfo(message) {
  if (!message || !message.message) return null;

  const content = message.message;
  const mediaType = Object.keys(content).find((key) => ['imageMessage', 'videoMessage'].includes(key));

  if (!mediaType) return null;

  return {
    mediaType,
    media: content[mediaType],
    remoteJid: message.key?.remoteJid,
  };
}

async function downloadMediaBuffer(message, mediaType) {
  const stream = await downloadContentFromMessage(message, mediaType === 'videoMessage' ? 'video' : 'image');
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

async function createStickerFromMedia(mediaBuffer, mediaType) {
  const tmpDir = path.join(os.tmpdir(), 'baileys-sticker-bot');
  fs.mkdirSync(tmpDir, { recursive: true });

  const sourceFile = path.join(tmpDir, `${Date.now()}-${mediaType === 'videoMessage' ? 'video' : 'image'}.bin`);
  fs.writeFileSync(sourceFile, mediaBuffer);

  let inputForSharp = sourceFile;

  if (mediaType === 'videoMessage') {
    const framePath = path.join(tmpDir, `${Date.now()}-frame.jpg`);

    await execFileAsync('ffmpeg', [
      '-y',
      '-i', sourceFile,
      '-frames:v', '1',
      '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0',
      framePath,
    ]);

    inputForSharp = framePath;
  }

  const sticker = await sharp(inputForSharp)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ lossless: true, quality: 80, effort: 6 })
    .toBuffer();

  try {
    fs.unlinkSync(sourceFile);
    if (inputForSharp !== sourceFile) fs.unlinkSync(inputForSharp);
  } catch (err) {
    // noop
  }

  return sticker;
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth');

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ['Chrome', 'Windows', '10.0.0'],
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      console.log('✅ Bot conectado ao WhatsApp');
      return;
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('⚠️ Conexão fechada, reconectando...', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(start, 2000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];

    if (!message || !message.message || message.key?.fromMe) return;
    if (message.key?.remoteJid === 'status@broadcast') return;

    const mediaInfo = getMediaInfo(message);
    if (!mediaInfo) return;

    try {
      const mediaBuffer = await downloadMediaBuffer(mediaInfo.media, mediaInfo.mediaType);
      const sticker = await createStickerFromMedia(mediaBuffer, mediaInfo.mediaType);

      await sock.sendMessage(
        mediaInfo.remoteJid,
        {
          sticker,
          mimetype: 'image/webp',
          caption: 'Sticker automático ✨',
        },
        {
          quoted: message,
        },
      );

      console.log(`✅ Sticker enviado para ${mediaInfo.remoteJid}`);
    } catch (error) {
      console.error('❌ Erro ao converter em sticker:', error);
    }
  });
}

start().catch((error) => {
  console.error('❌ Falha ao iniciar o bot:', error);
  process.exit(1);
});
