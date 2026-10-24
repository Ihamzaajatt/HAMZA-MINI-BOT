const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>HAMZA MINI PAIR</title>
<style>body{background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}.card{background:#1a1a1a;padding:30px;border-radius:15px;width:320px;text-align:center}input{width:90%;padding:12px;border-radius:8px;border:none;margin:15px 0}button{width:95%;padding:12px;background:#25D366;font-weight:bold;border:none;border-radius:8px}</style>
</head>
<body>
<div class="card">
<h1 style="color:#25D366">HAMZA MINI</h1>
<p>Bot Pairing Website Working!</p>
<form action="/pair" method="GET">
<input type="text" name="number" placeholder="923001234567" required>
<button>GET PAIR CODE</button>
</form>
<p style="font-size:12px;color:gray;margin-top:20px;">Server is Online ✅</p>
</div>
</body>
</html>
  `);
});

app.get('/pair', (req,res)=>{
  let number = req.query.number || 'Not provided';
  res.send(`<h1 style="text-align:center;margin-top:50px;font-family:sans-serif">Number Received: ${number}<br><br>Pair Logic ab isme add karenge<br><br><a href="/">Back</a></h1>`);
});

app.listen(PORT, () => console.log('Server running on '+PORT));
