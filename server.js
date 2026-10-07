const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.warn('[Server] No .env file found at:', envPath);
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) return;

    const rawKey = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();

    // Strip surrounding quotes if present
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1);
    }

    if (!process.env[rawKey]) {
      process.env[rawKey] = val;
    }
    // Also set uppercase alias for consistency
    const upperKey = rawKey.toUpperCase();
    if (!process.env[upperKey]) {
      process.env[upperKey] = val;
    }
  });
}

loadEnv();

function getGeminiKey() {
  return process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY || process.env.GEMINI || '';
}

function getGeoapifyKey() {
  return process.env.GEOAPIFY_API_KEY || process.env.GEOAPIFY || process.env.Geoapify_API_KEY || '';
}

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const GEMINI_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_SYSTEM_PROMPT = `You are the Vitals Assistant, a friendly guide inside an educational symptom-checker demo covering heart, lungs, and brain.

For any everyday, non-urgent symptom the user describes (fever, cough, cold, sore throat, mild headache, body ache, mild stomach upset, etc.), you MUST answer helpfully using this structure — do NOT refuse, do NOT reply with only an apology or disclaimer, do NOT say things like "I'm sorry, I can't help with that":
1. Likely common cause(s) — phrased as possibilities ("this is often caused by...", "commonly linked to..."), never a firm diagnosis.
2. Self-care tips — rest, hydration, humidified/warm air, honey/warm fluids for a cough, monitoring temperature, gargling salt water for sore throat, etc. You may say "an over-the-counter fever/pain reliever, taken as directed on the label" but never name a specific medication, brand, or dosage.
3. When to see a doctor — a short, concrete trigger (e.g. "if it lasts more than 3 days, gets worse, or you develop [specific red flag]").

Other rules:
- You are NOT a doctor and must never state or imply a certain diagnosis — but giving general possibilities and self-care info (as above) is expected and required, not something to avoid.
- Keep replies short: 3-5 sentences total, plain language, warm but not saccharine.
- If the symptoms relate to the heart, lungs, or brain specifically, briefly mention that checker on this page as an optional next step.
- If something sounds urgent (chest pain, stroke signs, trouble breathing, high fever with stiff neck or confusion, severe sudden symptoms), skip the 3-step structure and instead clearly tell them to seek emergency care now, mentioning the "Find care" section can help locate a hospital.
- If asked something unrelated to health or this site, answer briefly and steer the conversation back.`;

// Helper: send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper: read request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --- HEALTH CHECK ROUTE ---
  if (req.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
    return sendJSON(res, 200, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  // --- API ROUTE: Config status ---
  if (req.method === 'GET' && pathname === '/api/config') {
    return sendJSON(res, 200, {
      ok: true,
      hasGeminiKey: Boolean(getGeminiKey()),
      hasGeoapifyKey: Boolean(getGeoapifyKey())
    });
  }

  // --- API ROUTE: Gemini Chat Proxy ---
  if (req.method === 'POST' && (pathname === '/api/gemini' || pathname === '/api/chat')) {
    const geminiKey = getGeminiKey();
    if (!geminiKey) {
      return sendJSON(res, 500, { error: 'Gemini API key is not configured in .env file.' });
    }

    try {
      const data = await parseBody(req);
      const userText = (data.message || data.userText || '').trim();
      if (!userText) {
        return sendJSON(res, 400, { error: 'No message provided.' });
      }

      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        systemInstruction: { role: 'system', parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.6
        }
      };

      let apiRes = null;
      for (let attempt = 0; attempt <= 2; attempt++) {
        apiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': geminiKey
          },
          body: JSON.stringify(payload)
        });

        if (apiRes.ok || apiRes.status !== 503 || attempt === 2) {
          break;
        }
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }

      if (!apiRes.ok) {
        const errText = await apiRes.text();
        console.error('[Gemini Error]', apiRes.status, errText);
        return sendJSON(res, apiRes.status, { error: 'Gemini request failed: ' + apiRes.status });
      }

      const resData = await apiRes.json();
      const reply = resData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      return sendJSON(res, 200, { reply });
    } catch (err) {
      console.error('[Gemini Route Error]', err);
      return sendJSON(res, 500, { error: err.message || 'Internal server error' });
    }
  }

  // --- API ROUTE: Geoapify Places Proxy ---
  if (req.method === 'GET' && pathname === '/api/places') {
    const geoapifyKey = getGeoapifyKey();
    if (!geoapifyKey) {
      return sendJSON(res, 500, { error: 'Geoapify API key is not configured in .env file.' });
    }

    const categories = parsedUrl.searchParams.get('categories') || 'healthcare.pharmacy';
    const lat = parsedUrl.searchParams.get('lat');
    const lon = parsedUrl.searchParams.get('lon');
    const radius = parsedUrl.searchParams.get('radius') || '6000';
    const limit = parsedUrl.searchParams.get('limit') || '20';

    if (!lat || !lon) {
      return sendJSON(res, 400, { error: 'Missing lat or lon parameters.' });
    }

    const targetUrl = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${geoapifyKey}`;

    try {
      const placesRes = await fetch(targetUrl);
      if (!placesRes.ok) {
        return sendJSON(res, placesRes.status, { error: 'Places request failed: ' + placesRes.status });
      }
      const placesData = await placesRes.json();
      return sendJSON(res, 200, placesData);
    } catch (err) {
      console.error('[Places Error]', err);
      return sendJSON(res, 500, { error: err.message || 'Failed to fetch places' });
    }
  }

  // --- API ROUTE: Geoapify Static Map Proxy ---
  if (req.method === 'GET' && pathname === '/api/map') {
    const geoapifyKey = getGeoapifyKey();
    if (!geoapifyKey) {
      return sendJSON(res, 500, { error: 'Geoapify API key is not configured in .env file.' });
    }

    const style = parsedUrl.searchParams.get('style') || 'osm-bright';
    const width = parsedUrl.searchParams.get('width') || '900';
    const height = parsedUrl.searchParams.get('height') || '360';
    const marker = parsedUrl.searchParams.get('marker') || '';
    const center = parsedUrl.searchParams.get('center') || '';

    let targetUrl = `https://maps.geoapify.com/v1/staticmap?style=${encodeURIComponent(style)}&width=${width}&height=${height}&apiKey=${geoapifyKey}`;
    if (marker) targetUrl += `&marker=${encodeURIComponent(marker)}`;
    if (center) targetUrl += `&center=${encodeURIComponent(center)}`;

    try {
      const mapRes = await fetch(targetUrl);
      if (!mapRes.ok) {
        return sendJSON(res, mapRes.status, { error: 'Map request failed' });
      }
      const buffer = await mapRes.arrayBuffer();
      res.writeHead(200, {
        'Content-Type': mapRes.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(Buffer.from(buffer));
    } catch (err) {
      console.error('[Map Error]', err);
      return sendJSON(res, 500, { error: err.message || 'Failed to fetch map' });
    }
  }

  // --- SECURITY: Block direct access to sensitive files ---
  const normalizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (
    normalizedPath.includes('.env') ||
    normalizedPath.startsWith('/.') ||
    normalizedPath.includes('.git')
  ) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access denied.');
  }

  // --- STATIC FILE SERVING ---
  const isRoot = pathname === '/' || pathname === '' || normalizedPath === '.' || normalizedPath === path.sep || normalizedPath === '/';
  const targetRelativePath = isRoot ? 'index.html' : normalizedPath;
  const filePath = path.join(PUBLIC_DIR, targetRelativePath);

  // Security check: ensure file is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const geminiStatus = getGeminiKey() ? 'Configured ✓' : 'Missing (check .env / Cloud Variables) ✗';
  const geoapifyStatus = getGeoapifyKey() ? 'Configured ✓' : 'Missing (check .env / Cloud Variables) ✗';

  console.log('\n======================================================');
  console.log(`  🌟 Vitals Server running at: http://localhost:${PORT}`);
  console.log('======================================================');
  console.log(`  🔑 Gemini API:    ${geminiStatus}`);
  console.log(`  🔑 Geoapify API:  ${geoapifyStatus}`);
  console.log('  🔒 API keys are kept safely in .env / Cloud Environment');
  console.log('======================================================\n');
});

module.exports = server;
