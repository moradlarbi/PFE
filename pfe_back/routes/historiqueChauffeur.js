import express from 'express';
import { findHistoryByDriverId, createHistory } from '../models/historiqueChauffeur.js';

const router = express.Router();

// GET /historyDriver?id=USER_ID
router.get('/', (req, res) => {
  const driverId = parseInt(req.query.id);
  if (!driverId) {
    return res.status(400).json({ error: 'ID chauffeur requis' });
  }

  findHistoryByDriverId(driverId, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// POST /historyDriver
router.post('/', (req, res) => {
  const historyData = req.body;

  if (!historyData.chauffeur_id || !historyData.adresse_depart_longitude || !historyData.adresse_depart_latitude || !historyData.date_debut || !historyData.date_fin || !historyData.titre || !historyData.etat || !historyData.itineraire) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  createHistory(historyData, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Historique créé avec succès', id: result.insertId });
    }
  });
});
// PUT /historyDriver/:id
router.put('/:id', (req, res) => {
  const historyId = parseInt(req.params.id);
  const historyData = req.body;

  if (!historyId || !historyData) {
    return res.status(400).json({ error: 'ID historique et données requises' });
  }

  updateHistory(historyId, historyData, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Historique mis à jour avec succès' });
    }
  });
});
   
export default router;
