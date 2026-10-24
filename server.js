const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1 style="text-align:center;margin-top:100px;color:green">WEBSITE WORKING ✅<br>Ab Pair Code Lagayenge</h1>');
});

app.listen(PORT, () => console.log('Running'));
