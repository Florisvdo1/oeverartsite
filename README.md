## Quick start
1. cp .env.example .env && fill in tokens.
2. npm i
3. npm run dev         # Local test at http://localhost:5173
4. npm run build
5. Netlify: drag‑and‑drop /dist as static site, set environment vars.
6. Render.com: connect repo → Web Service → start command `node backend/server.js`.

## Security hardening
- Helmet & rate‑limit middleware (add before launch).
- ENV secrets kept server‑side; IG & PayPal never exposed to client.
- SQLite parameterised queries prevent injection.

## Performance
- Three.js scene lazy‑loads GLB after first frame.
- Images use `loading="lazy"` and are scaled to 1 × 1 preview squares.
- Code‑splitting via Vite; gzip/brotli enabled automatically.
