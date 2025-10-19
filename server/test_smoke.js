const axios = require('axios');

async function run() {
  const base = process.env.API_URL || 'http://localhost:5000/api';
  console.log('Running smoke tests against', base);
  try {
    const res = await axios.get(`${base}/posts`, { timeout: 5000 });
    if (res.status === 200) {
      console.log('GET /posts returned 200 OK');
      process.exit(0);
    }
    console.error('Unexpected status', res.status);
    process.exit(2);
  } catch (err) {
    console.error('Smoke test failed:', err.message || err);
    process.exit(3);
  }
}

run();
const http = require('http')

const options = { hostname: 'localhost', port: process.env.PORT || 5000, path: '/api/posts', method: 'GET', headers: { 'Accept': 'application/json' } }

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode)
  let data = ''
  res.on('data', (chunk) => data += chunk)
  res.on('end', () => {
    try { console.log('Body:', JSON.parse(data)) } catch (e) { console.log('Body:', data) }
  })
})

req.on('error', (err) => { console.error('Request error', err) })
req.end()
