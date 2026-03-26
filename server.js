const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, 'public');

// Debug: log what's in the directory
console.log('Public path:', publicPath);
console.log('Files:', fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : 'NOT FOUND');

// Serve static files from /public
app.use(express.static(publicPath));

// Fallback to index.html for any route
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found at: ' + indexPath);
  }
});

app.listen(PORT, () => {
  console.log(`FounderTrace running on port ${PORT}`);
});
