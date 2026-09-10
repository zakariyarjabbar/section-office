import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.includes("..") || pathname.includes("\0")) {
        res.writeHead(400).end();
        return;
      }
      let target = path.join(root, pathname);
      try {
        const stat = await fs.stat(target);
        if (stat.isDirectory()) {
          if (!pathname.endsWith("/")) {
            res.writeHead(308, { Location: pathname + "/" + url.search }).end();
            return;
          }
          target = path.join(target, "index.html");
        }
      } catch {
        target = path.join(root, "404.html");
        res.statusCode = 404;
      }
      let data;
      try {
        data = await fs.readFile(target);
      } catch {
        data = await fs.readFile(path.join(root, "404.html"));
        res.statusCode = 404;
        target = "404.html";
      }
      res.setHeader(
        "Content-Type",
        types[path.extname(target)] || "application/octet-stream",
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader(
        "Cache-Control",
        pathname.startsWith("/_next/static/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      );
      res.setHeader("Content-Length", data.length);
      if (req.method === "HEAD") res.end();
      else res.end(data);
    } catch {
      res
        .writeHead(500)
        .end("Static preview unavailable. Run npm run build first.");
    }
  })
  .listen(port, "0.0.0.0", () =>
    console.log(`SECTION OFFICE static preview: http://localhost:${port}`),
  );
