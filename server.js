const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const publicPath = path.join(__dirname, 'public');

// Apollo API proxy — avoids CORS issues in the browser
app.post('/api/apollo/search', async (req, res) => {
  const apiKey = req.headers['x-apollo-key'];
  if (!apiKey) return res.status(400).json({ error: 'No API key provided' });

  try {
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    console.log('Apollo response status:', response.status);
    console.log('Apollo response body:', text.slice(0, 300));
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch(e) {
      res.status(500).json({ error: 'Invalid JSON from Apollo', raw: text.slice(0, 300) });
    }
  } catch (err) {
    console.error('Apollo fetch error:', err.message);
    res.status(500).json({ error: 'Apollo request failed', detail: err.message });
  }
});

// Apollo API proxy — test connection
app.post('/api/apollo/test', async (req, res) => {
  const apiKey = req.headers['x-apollo-key'];
  if (!apiKey) return res.status(400).json({ error: 'No API key provided' });

  try {
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({ per_page: 1, page: 1 })
    });
    const text = await response.text();
    console.log('Apollo test status:', response.status, text.slice(0, 200));
    try {
      const data = JSON.parse(text);
      res.status(response.status).json(data);
    } catch(e) {
      res.status(500).json({ error: 'Invalid JSON from Apollo', raw: text.slice(0, 300) });
    }
  } catch (err) {
    res.status(500).json({ error: 'Apollo request failed', detail: err.message });
  }
});

// Serve static files
app.use(express.static(publicPath));

// Fallback to index.html
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
