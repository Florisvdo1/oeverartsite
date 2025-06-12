import { Router } from 'express';
const router = Router();
router.post('/score', async (req, res)=>{
  const { score } = req.body;
  const db = req.app.get('db');
  await db.run('INSERT INTO quiz_scores(score) VALUES (?)', [score]);
  res.json({ok:true});
});
export default router;
