// routes/trash.js
import express from 'express';
import { findTrashByUserId } from '../models/task.js';

const router = express.Router();

// GET /trashRegion?id=USER_ID
router.get('/', (req, res) => {
  const userId = parseInt(req.query.id);
  if (!userId) {
    return res.status(400).json({ error: 'ID utilisateur requis' });
  }

  findTrashByUserId(userId, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

export default router;