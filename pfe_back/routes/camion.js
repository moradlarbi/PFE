import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteCamion,
} from '../models/camion.js';

const router = express.Router();

// Get all Camions
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Camion by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  getById(id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new Camion
router.post('/', (req, res) => {
  const { matricule, couleur, idModele } = req.body;
  create(matricule, couleur, idModele, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, matricule, couleur, idModele });
    }
  });
});

// Update an existing Camion
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { matricule, couleur, idModele } = req.body;
  update(id, matricule, couleur, idModele, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Camion
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteCamion(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
