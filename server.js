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
  <p>Number: 9230...</p>
  <form action="/code">
  <input name="number" placeholder="92300xxxxxxx" required>
  <button>GET PAIR CODE</button>
  </form></div></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = (req.query.number || '').replace(/[^0-9]/g, '');
  if (!num) return res.send('<a href="/">Back</a>');

  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const pino = require('pino');
      const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, delay } = require('@whiskeysockets/baileys');

      if (fs.existsSync('./session')) fs.rmSync('./session', { recursive: true, force: true });
      const { state, saveCreds } = await useMultiFileAuthState('./session');

      const sock = makeWASocket({
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) },
        logger: pino({ level: "fatal" }),
        browser: Browsers.ubuntu("Chrome"),
        printQRInTerminal: false,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000
      });

      sock.ev.on('creds.update', saveCreds);

      // Sab se important: Socket ke open hone ka wait karo
      await new Promise(async (resolve) => {
        let resolved = false;
        sock.ev.on('connection.update', (u) => {
          if (!resolved && (u.connection || u.qr)) { resolved = true; resolve(); }
        });
        await delay(8000);
        if (!resolved) { resolved = true; resolve(); }
      });

      await delay(2000);
      let code = await sock.requestPairingCode(num);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      
      console.log(`SUCCESS! Code: ${code} for ${num}`);

      // Socket ko 2 minute tak zinda rakho taake WhatsApp link ho jaye
      setTimeout(() => { try { sock.end(); } catch {} }, 120000);

      return res.send(`
        <body style="background:#000;color:#fff;text-align:center;font-family:sans-serif;padding-top:40px">
        <div style="background:#111;border:1px solid #25D366;border-radius:20px;padding:25px;max-width:380px;margin:auto">
        <h2 style="color:#25D366">PAIR CODE READY!</h2>
        <p>${num}</p>
        <h1 style="font-size:45px;background:#222;padding:15px;border-radius:10px;color:#25D366;letter-spacing:2px">${code}</h1>
        <p style="color:#ff0;font-weight:bold">⚠️ 15 SEC ME DALO!</p>
        <p style="font-size:12px;color:#aaa">Linked Devices > Link with phone number</p>
        <a href="/" style="background:#25D366;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">NEW CODE</a>
        </div></body>`);

    } catch (e) {
      console.log(`Attempt ${attempts} failed:`, e.message);
      if (attempts >= 3) {
        return res.send(`<h2 style="text-align:center;font-family:sans-serif">Pair Error: ${e.message}<br><br>Retrying... Please <a href="/code?number=${num}">Click Here</a> to try again<br><br><a href="/">Back</a></h2><pre style="font-size:10px">${e.stack}</pre>`);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }
});

app.listen(PORT, () => console.log('Running'));
