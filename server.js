const express = require('express');
const app = express();
const fs = require('fs');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, delay } = require('@whiskeysockets/baileys');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HAMZA MINI - PAIR</title>
<style>
body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
.card{background:#111;padding:35px;border-radius:20px;border:1px solid #25D366;width:340px;text-align:center;box-shadow:0 0 20px #25D36633}
input{width:92%;padding:14px;border-radius:10px;border:none;margin:15px 0;font-size:16px;text-align:center}
button{width:100%;padding:14px;background:#25D366;color:#000;font-weight:bold;border:none;border-radius:10px;font-size:17px;cursor:pointer}
h1{color:#25D366;margin:0 0 10px}
p{color:#888;font-size:13px}
</style>
</head>
<body>
<div class="card">
<h1>HAMZA MINI BOT</h1>
<p>Enter WhatsApp Number with Country Code<br>without +</p>
<form action="/code" method="GET">
<input name="number" placeholder="92300xxxxxxx" required>
<button type="submit">GET PAIR CODE</button>
</form>
<p style="margin-top:20px">Made by Hamza</p>
</div>
</body>
</html>
  `);
});

app.get('/code', async (req, res) => {
  let num = req.query.number ? req.query.number.replace(/[^0-9]/g, '') : '';
  if (!num || num.length < 10) return res.send('<h1 style="text-align:center;margin-top:50px;font-family:sans-serif">Invalid Number! <a href="/">Back</a></h1>');

  if (fs.existsSync('./pair-session')) {
    fs.rmSync('./pair-session', { recursive: true, force: true });
  }

  try {
    const { state } = await useMultiFileAuthState('./pair-session');
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      printQRInTerminal: false,
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS("Chrome"),
    });

    if (!sock.authState.creds.registered) {
      await delay(3000);
      const code = await sock.request
