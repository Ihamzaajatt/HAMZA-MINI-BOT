const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
 res.send(`<html><head><meta name="viewport" content="width=device-width"><style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh} .b{background:#111;padding:25px;border-radius:15px;border:1px solid #25D366;width:320px;text-align:center} input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0;text-align:center} button{width:100%;padding:12px;background:#25D366;border:none;border-radius:8px;font-weight:bold}</style></head><body><div class="b"><h2 style="color:#25D366">HAMZA MINI BOT</h2><form action="/code"><input name="number" placeholder="92300xxxxxxx" required><button>GET CODE</button></form></div></body></html>`);
});

app.get('/code', async (req,res) => {
 let num = (req.query.number||'').replace(/[^0-9]/g,'');
 if(!num) return res.send('Enter number <a href="/">Back</a>');
 try{
  const pino = require('pino');
  const {default:makeWASocket,useMultiFileAuthState,makeCacheableSignalKeyStore,Browsers,delay} = require('@whiskeysockets/baileys');
  if(fs.existsSync('./s')) fs.rmSync('./s',{recursive:true,force:true});
  const {state,saveCreds} = await useMultiFileAuthState('./s');
  const sock = makeWASocket({auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:"fatal"}))},logger:pino({level:"fatal"}),browser:Browsers.macOS("Desktop"),printQRInTerminal:false});
  sock.ev.on('creds.update',saveCreds);
  await delay(10000);
  let code = await sock.requestPairingCode(num);
  code = code.match(/.{1,4}/g).join("-");
  res.send(`<body style="background:#000;color:#fff;text-align:center;font-family:sans-serif;padding-top:50px"><div style="background:#111;border:1px solid #25D366;padding:20px;border-radius:15px;max-width:350px;margin:auto"><h1 style="color:#25D366;font-size:40px">${code}</h1><p style="color:yellow">10 sec me dalo!</p><p style="font-size:12px;color:#aaa">Linked Devices > Link with phone number</p><a href="/" style="color:#25D366">New Code</a></div></body>`);
  setTimeout(()=>{try{sock.end()}catch{}},120000);
 }catch(e){
  console.log(e);
  res.send(`Error: ${e.message} <br><a href="/code?number=${num}">Retry</a> | <a href="/">Home</a>`);
 }
});

app.listen(PORT,()=>console.log('Run'));
});
