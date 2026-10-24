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
  <p>Enter Number with Country Code (without +)</p>
  <form action="/code">
  <input name="number" placeholder="923001234567" required>
  <button>GET PAIR CODE</button>
  </form>
  <p style="font-size:11px;color:#888">Ex: 923001234567 - No spaces, no +</p>
  </div></body></html>
  `);
});

app.get('/code', async (req, res) => {
  let num = (req.query.number || '').replace(/[^0-9]/g, '');
  if (!num || num.length < 10) return res.send('<h2><a href="/">Back</a> Invalid Number! Use 92300...</h2>');

  try {
    const pino = require('pino');
    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, delay } = require('@whiskeysockets/baileys');
    
    if (fs.existsSync('./session')) fs.rmSync('./session', { recursive: true, force: true });
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    const sock = makeWASocket({
      auth: { 
        creds: state.creds, 
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })) 
      },
      logger: pino({ level: "fatal" }),
      browser: Browsers.ubuntu("Chrome"),
      printQRInTerminal: false,
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);
    
    // Wait longer for connection
    await delay(8000);
    
    if(!sock.authState.creds.registered){
      let code = await sock.requestPairingCode(num);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      
      console.log('CODE:', code, 'for', num);
      
      // Keep socket alive for 90 seconds so WhatsApp can link
      setTimeout(() => {
        try { sock.end(); } catch {}
        if (fs.existsSync('./session')) fs.rmSync('./session', { recursive: true, force: true });
      }, 90000);

      return res.send(`
        <body style="background:#000;color:#fff;text-align:center;font-family:sans-serif;padding-top:30px">
        <div style="background:#111;border:1px solid #25D366;border-radius:20px;padding:25px;max-width:380px;margin:auto">
        <h2 style="color:#25D366">PAIR CODE READY!</h2>
        <p style="color:#fff">${num}</p>
        <h1 style="font-size:45px;background:#222;padding:15px;border-radius:10px;letter-spacing:3px;color:#25D366">${code}</h1>
        <p style="color:#ff0;font-weight:bold">⚠️ 15 SECOND ME DALO! EXPIRE HO JAYEGA!</p>
        <div style="text-align:left;background:#222;padding:15px;border-radius:10px;font-size:13px;color:#ccc;margin:15px 0">
        <b>Correct Steps:</b><br>
        1. WhatsApp band karke dobara kholo<br>
        2. Settings > Linked Devices<br>
        3. Link a Device<br>
        4. Neeche <b>"Link with phone number"</b> pe click karo (QR pe nahi!)<br>
        5. Code paste karo: ${code}
        </div>
        <a href="/" style="background:#25D366;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">TRY NEW CODE</a>
        </div></body>`);
    }
  } catch (e) {
    console.log(e);
    res.send(`<h2>Error: ${e.message}<br><a href="/">Back</a></h2>`);
  }
});

app.listen(PORT, () => console.log('Running on ' + PORT));
