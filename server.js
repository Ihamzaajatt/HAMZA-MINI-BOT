const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req,res)=>{
  res.send('<h1 style="text-align:center;font-family:sans-serif;margin-top:100px">HAMZA BOT RENDER ✅ WORKING<br><br>Ab Pair Code Add Karenge</h1>');
});

app.listen(PORT, ()=> console.log('Running on '+PORT));
