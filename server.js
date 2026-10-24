const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
  <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>HAMZA MINI</title>
  <style>
  body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
  .card{background:#111;padding:30px;border-radius:20px;border:1px solid #25D366;width:350px;text-align:center}
  input{width:90%;padding:14px;border-radius:10px;border:none;margin:15px 0;text-align:center;font-size:16px}
  button{width:100%;padding:14px;background:#25D366;color:#000;font-weight:bold;border:none;border-radius:10px;font-size:17px}
  </style></head>
  <body><div class="card">
  <h1 style="color:#25D366">HAMZA MINI BOT</h1>
  <p>Enter Number with Country Code</p>
  <form action="/code">
  <input name="number" placeholder="92300xxxxxxx" required>
  <button>GET PAIR CODE</button>
  </form>
  <p style="font-size:12px;color:#888;margin-top:15px">Code 20 sec me expire hota hai!<br>Foran WhatsApp me dalo!</p>
  </div></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = (req.query.number || '').replace(/[^0-9]/g, '');
  if (!num) return res.send('<h2><a href="/">Back</a> Enter Number!</h2>');

  try {
    const pino = require('pino');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, delay } = require('@whiskeysockets/baileys');

    if (fs.existsSync('./session')) fs.rmSync('./session', { recursive: true, force: true });
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const sock = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) },
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS("Desktop"),
      printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    // Important: Wait for
