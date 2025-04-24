import express from 'express';
import {
  findAll,
  incrementPoints,
  create
} from '../models/recompenses.js';

const router = express.Router();

// GET /recompenses — liste des participants
router.get('/', (req, res) => {
  findAll((err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // On les renvoie dans le même format que _fetchParticipants()
      const formatted = results.map((row, index) => ({
        rank: index + 1,
        name: row.name,
        points: row.points
      }));
      res.status(200).json(formatted);
    }
  });
});

router.get('/carte', (req, res) => {
  //  const citoyenId = req.user?.id;
    const  citoyenId  = req.body;
  
    if (!citoyenId) {
      return res.status(401).json({ error: 'Utilisateur non connecté' });
    }
  
    getUserRewardCard(citoyenId, (err, card) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!card) return res.status(404).json({ error: 'Carte non trouvée' });
      res.status(200).json(card);
    });
  });
  
// POST /recompenses/increment — incrémenter les points d’un utilisateur connecté
router.post('/increment', (req, res) => {
  const citoyenId = req.user?.id; 
  const { increment = 10 } = req.body;

  if (!citoyenId) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }

  incrementPoints(citoyenId, increment, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Points mis à jour avec succès' });
    }
  });
});

export default router;
