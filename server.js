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
    // Build query string from body params
    const params = new URLSearchParams();
    const body = req.body;
    if (body.person_titles) body.person_titles.forEach(t => params.append('person_titles[]', t));
    if (body.person_locations) body.person_locations.forEach(l => params.append('person_locations[]', l));
    if (body.person_seniorities) body.person_seniorities.forEach(s => params.append('person_seniorities[]', s));
    if (body.organization_num_employees_ranges) body.organization_num_employees_ranges.forEach(r => params.append('organization_num_employees_ranges[]', r));
    if (body.q_keywords) params.append('q_keywords', body.q_keywords);
    if (body.page) params.append('page', body.page);
    if (body.per_page) params.append('per_page', body.per_page);

    const url = `https://api.apollo.io/api/v1/mixed_people/api_search?${params.toString()}`;
    console.log('Apollo URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': apiKey
      }
    });
    const text = await response.text();
    console.log('Apollo status:', response.status, text.slice(0, 300));
    try {
      res.status(response.status).json(JSON.parse(text));
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
    const response = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search?per_page=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': apiKey
      }
    });
    const text = await response.text();
    console.log('Apollo test status:', response.status, text.slice(0, 200));
    try {
      res.status(response.status).json(JSON.parse(text));
    } catch(e) {
      res.status(500).json({ error: 'Invalid JSON', raw: text.slice(0, 300) });
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
