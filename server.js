const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];

  // Decode URL and strip leading slash
  let relativePath = decodeURIComponent(cleanUrl).replace(/^\/+/, '');
  if (!relativePath || relativePath === '') {
    relativePath = 'index.html';
  }

  let filePath = path.join(__dirname, relativePath);

  // Security check: stay within workspace
  if (!filePath.toLowerCase().startsWith(__dirname.toLowerCase())) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    // If not found or directory, fallback to index.html (SPA routing)
    if (err || !stats.isFile()) {
      // If it looks like a missing asset (has an extension like .jpg or .mp3), 404
      if (path.extname(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Asset Not Found: ' + cleanUrl);
      }
      
      // Otherwise fallback to index.html
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('Server Error');
    });
    stream.pipe(res);
  });
});

// Try ports dynamically starting from 3000
function startServer(port = 3000) {
  server.listen(port, () => {
    console.log('\n======================================================');
    console.log(`🎂 Best Friend Birthday Surprise Website is LIVE! ❤️`);
    console.log(`👉 Open: http://localhost:${port}`);
    console.log(`👉 Or:   http://127.0.0.1:${port}`);
    console.log('======================================================\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(3000);
