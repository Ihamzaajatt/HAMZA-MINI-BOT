const express = require('express');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HAMZA MINI BOT - PAIR</title>
<style>
body{background:#0a0a0a;color:white;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
.card{background:#1a1a1a;padding:30px;border-radius:15px;box-shadow:0 0 20px #25d36633;width:320px;text-align:center}
input{width:90%;padding:12px;border-radius:8px;border:none;margin:15px 0;font-size:16px}
button{width:95%;padding:12px;background:#25D366;color:#000;font-weight:bold;border:none;border-radius:8px;font-size:16px;cursor:pointer}
h1{color:#25D366}
</style>
</head>
<body>
<div class="card">
<h1>HAMZA MINI</h1>
<p>Enter WhatsApp Number with Country Code</p>
<form action="/code" method="GET">
<input type="text" name="number" placeholder="923001234567" required>
<button type="submit">GET PAIR CODE</button>
</form>
</div>
</body>
</html>
  `);
});

app.get('/code', async (req, res) => {
  let num = req.query.number;
  if(!num) return res.send('Number missing!');
  num = num.replace(/[^0-9]/g, '');
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./pair-session');
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
      await new Promise(r => setTimeout(r, 2000));
      const code = await sock.requestPairingCode(num);
      res.send(`
        <body style="background:#0a0a0a;color:white;text-align:center;padding-top:100px;font-family:sans-serif">
        <h2>YOUR PAIR CODE</h2>
        <h1 style="font-size:60px;color:#25D366;letter-spacing:5px;">${code}</h1>
        <p>Go to WhatsApp > Linked Devices > Link with phone number</p>
        <p>Code expires in 60 seconds</p>
        <a href="/" style="color:#25D366">Go Back</a>
        </body>
      `);
    }
  } catch (e) {
    res.send(`<h3>Error: ${e.message}<br><a href="/">Try Again</a></h3>`);
    console.log(e);
  }
});

app.listen(PORT, () => console.log(`PAIR SERVER RUNNING ON ${PORT}`));
