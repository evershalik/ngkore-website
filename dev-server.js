#!/usr/bin/env node
/**
 * NgKore Website - Clean URL Development Server
 * This server serves clean URLs without .html extensions appearing in the browser
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

// MIME types mapping
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".webmanifest": "application/manifest+json",
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      serve404(res);
      return;
    }

    const mimeType = getMimeType(filePath);

    res.writeHead(200, {
      "Content-Type": mimeType,
      "Content-Length": data.length,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    });

    res.end(data);
  });
}

function serve404(res) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Page Not Found</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 50px; }
            h1 { color: #4A90E2; }
        </style>
    </head>
    <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <p><a href="/">Return to Home</a></p>
    </body>
    </html>
    `;

  res.writeHead(404, {
    "Content-Type": "text/html",
    "Content-Length": html.length,
  });
  res.end(html);
}

function createServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Remove leading slash
    if (pathname.startsWith("/")) {
      pathname = pathname.substring(1);
    }

    // Handle root path
    if (!pathname || pathname === "index") {
      pathname = "index.html";
    }

    const filePath = path.join(__dirname, pathname);

    // Check if the exact file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (!err) {
        // File exists, serve it
        serveFile(res, filePath);
        return;
      }

      // If file doesn't exist and has no extension, try adding .html
      if (!path.extname(pathname)) {
        const htmlPath = filePath + ".html";
        fs.access(htmlPath, fs.constants.F_OK, (htmlErr) => {
          if (!htmlErr) {
            serveFile(res, htmlPath);
          } else {
            serve404(res);
          }
        });
      } else {
        serve404(res);
      }
    });

    // Log the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  });

  server.listen(port, () => {
    console.log("NgKore Website - Clean URL Server");
    console.log(`Serving from: ${__dirname}`);
    console.log(`Server URL: http://localhost:${port}`);
    console.log("Clean URLs enabled (no .html extensions in browser)");
    console.log("\nTest these clean URLs:");
    console.log(`   http://localhost:${port}/`);
    console.log(`   http://localhost:${port}/pages/about`);
    console.log(`   http://localhost:${port}/pages/contact`);
    console.log(`   http://localhost:${port}/pages/expertise`);
    console.log(
      `   http://localhost:${port}/pages/expertise/telecom-architecture`
    );
    console.log("\n Press Ctrl+C to stop the server\n");
  });

  return server;
}

// Get port from command line or use default
const port = process.argv[2] ? parseInt(process.argv[2]) : 8000;

if (isNaN(port)) {
  console.error("Invalid port number. Using default port 8000.");
  createServer(8000);
} else {
  createServer(port);
}
