import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import paypalRoutes from './routes/paypal.js';
import quizRoutes   from './routes/quiz.js';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/paypal', paypalRoutes);
app.use('/api/quiz',   quizRoutes);

/* ----------  Instagram proxy  ---------- */
const IG_TOKEN = process.env.IG_TOKEN;
app.get('/api/instagram', async (req, res) => {
  const { cursor='' } = req.query;
  const url = `https://graph.instagram.com/me/media`
            + `?fields=id,media_url,thumbnail_url&limit=12&after=${cursor}&access_token=${IG_TOKEN}`;
  const ig = await fetch(url).then(r=>r.json());
  res.json({
    items: ig.data.map(m=>({id:m.id,thumbnail:m.thumbnail_url||m.media_url})),
    next:  ig?.paging?.cursors?.after || ''
  });
});

/* ----------  SQLite initialisation ---------- */
const db = await open({ filename:'./db.sqlite', driver:sqlite3.Database });
await db.run(`CREATE TABLE IF NOT EXISTS quiz_scores(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  score INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);

app.set('db', db);              // make db accessible in routes
app.use(express.static('dist')); // Vite build output

const PORT = process.env.PORT || 5173;
app.listen(PORT, ()=>console.log(`Server on :${PORT}`));
export default app;
