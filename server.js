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
  </form></div></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = (req.query.number || '').replace(/[^0-9]/g, '');
  if (!num) return res.send('<a href="/">Back</a> Enter Number!');
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
    await delay(4000);
    let code = await sock.requestPairingCode(num);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    res.send(`<body style="background:#000;color:#fff;text-align:center;font-family:sans-serif;padding-top:50px"><div style="background:#111;border:1px solid #25D366;border-radius:20px;padding:25px;max-width:380px;margin:auto"><h2 style="color:#25D366">PAIR CODE</h2><p>${num}</p><h1 style="font-size:45px;background:#222;padding:15px;border-radius:10px">${code}</h1><p style="color:#ff0">20 sec me expire! Jaldi dalo!</p><p style="font-size:12px;color:#aaa;text-align:left">WhatsApp > Linked Devices > Link a Device > Link with phone number > Paste Code</p><a href="/" style="background:#25D366;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">NEW CODE</a></div></body>`);
  } catch (e) {
    res.send(`<h2>Error: ${e.message}<br><a href="/">Back</a></h2><pre>${e.stack}</pre>`);
  }
});

app.listen(PORT, () => console.log('Running'));
