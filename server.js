const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end('RotBrain Landing Page Server Initializing...');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(RotBrain server running at http://localhost: + PORT);
});