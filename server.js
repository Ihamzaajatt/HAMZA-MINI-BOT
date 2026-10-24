const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('<h1 style="text-align:center;margin-top:100px;font-family:sans-serif">HAMZA BOT LIVE ✅<br><br><a href="/pair" style="background:#25D366;color:#000;padding:12px 25px;text-decoration:none;border-radius:8px">GET PAIR CODE</a></h1>');
});

app.get('/pair', (req, res) => {
  res.send(`
  <html><head><meta name="viewport" content="width=device-width"><style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0} .b{background:#111;padding:25px;border-radius:15px;border:1px solid #25D366;width:320px;text-align:center} input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0;text-align:center} button{width:100%;padding:12px;background:#25D366;border:none;border-radius:8px;font-weight:bold}</style></head>
  <body><div class="b"><h2 style="color:#25D366">HAMZA MINI</h2><form action="/code"><input name="number" placeholder="92300xxxxxxx" required><button>GET CODE</button></form><p style="font-size:11px;color:#888">Code milte hi 15 sec me dalo!</p></div></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = (req.query.number || '').replace(/[^0-9]/g, '');
  if (!num) return res.send('No number <a href="/">Back</a>');

  // Retry Logic for Connection Closed
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const pino = require('pino');
      const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, delay } = require('@whiskeysockets/baileys');
      if (fs.existsSync('./s')) fs.rmSync('./s', { recursive: true, force: true });
      const { state, saveCreds } = await useMultiFileAuthState('./s');
      const sock = makeWASocket({
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) },
        logger: pino({ level: "fatal" }),
        browser: Browsers.macOS("Desktop"),
        printQRInTerminal: false,
        connectTimeoutMs: 60000
      });
      sock.ev.on('creds.update', saveCreds);

      console.log(`Attempt ${attempt}: Waiting 12 sec for connection...`);
      await delay(12000);

      console.log(`Attempt ${attempt}: Requesting code for ${num}`);
      let code = await sock.requestPairingCode(num);
      code = code.match(/.{1,4}/g).join("-");

      console.log('CODE SUCCESS:', code);
      res.send('<h1 style="text-align:center;font-family:sans-serif;margin-top:80px">YOUR CODE:<br><br><span style="background:#111;color:#25D366;padding:20px;font-size:45px;border-radius:12px;border:2px solid #25D366">' + code + '</span><br><br><span style="color:red;font-size:16px">15 SEC ME DALO!</span><br><br><a href="/">Home</a></h1>');
      
      setTimeout(() => { try { sock.end(); } catch {} }, 180000);
      return;

    } catch (e) {
      console.log(`Attempt ${attempt} failed:`, e.message);
      if (attempt === 3) {
        return res.send('<h2 style="text-align:center;font-family:sans-serif;margin-top:50px">Error: ' + e.message + '<br><br>WhatsApp server busy hai!<br>2 min baad <a href="/pair">Retry karo</a><br><br><a href="/">Home</a></h2>');
      }
      await new Promise(r => setTimeout(r, 5000));
    }
  }
});

app.listen(PORT, () => console.log('Running on ' + PORT));
