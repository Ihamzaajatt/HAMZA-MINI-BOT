const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('<h1 style="text-align:center;margin-top:100px;font-family:sans-serif">HAMZA BOT WORKING ✅<br><br><a href="/pair" style="background:#25D366;color:#000;padding:10px 20px;text-decoration:none;border-radius:8px">GET PAIR CODE</a></h1>');
});

app.get('/pair', (req, res) => {
  res.send(`
  <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0} .b{background:#111;padding:25px;border-radius:15px;border:1px solid #25D366;width:320px;text-align:center} input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0;text-align:center} button{width:100%;padding:12px;background:#25D366;border:none;border-radius:8px;font-weight:bold}</style></head>
  <body><div class="b"><h2 style="color:#25D366">HAMZA MINI</h2><form action="/code"><input name="number" placeholder="92300xxxxxxx" required><button>GET CODE</button></form></div></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = (req.query.number || '').replace(/[^0-9]/g, '');
  if (!num) return res.send('No number <a href="/">Back</a>');
  try {
    const pino = require('pino');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, delay } = require('@whiskeysockets/baileys');
    if (fs.existsSync('./s')) fs.rmSync('./s', { recursive: true, force: true });
    const { state, saveCreds } = await useMultiFileAuthState('./s');
    const sock = makeWASocket({
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) },
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS("Desktop"),
      printQRInTerminal: false
    });
    sock.ev.on('creds.update', saveCreds);
    await delay(8000);
    let code = await sock.requestPairingCode(num);
    code = code.match(/.{1,4}/g).join("-");
    res.send('<h1 style="text-align:center;font-family:sans-serif;margin-top:80px">CODE: ' + code + '<br><br><span style="background:#222;padding:15px;font-size:40px;border-radius:10px;color:#25D366">' + code + '</span><br><br><a href="/">Back</a></h1>');
    setTimeout(() => { try { sock.end(); } catch(e) {} }, 120000);
  } catch (e) {
    console.log(e);
    res.send('Error: ' + e.message + '<br><a href="/pair">Retry</a>');
  }
});

app.listen(PORT, () => console.log('Running on ' + PORT));
