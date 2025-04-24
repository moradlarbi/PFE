import express from 'express';
import {
  findAll,
  create
} from '../models/contact.js';

const router = express.Router();

// GET /contact — liste de tous les messages
router.get('/', (req, res) => {
  findAll((err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// POST /contact — envoyer un message (utilisateur connecté)
router.post('/', (req, res) => {
  const { idUser, titre, message } = req.body;


  if (!idUser) {
    return res.status(401).json({ error: 'Utilisateur non connecté' });
  }

  if (!titre || !message) {
    return res.status(400).json({ error: 'Titre et message requis' });
  }

  create(idUser, titre, message, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Message envoyé', id: results.insertId });
    }
  });
});

export default router;
