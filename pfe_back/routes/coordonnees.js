import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteCoordonnees,
} from '../models/coordonnees.js';

const router = express.Router();

// Get all Coordonnees
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Coordonnees by id
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

// Create a new Coordonnees
router.post('/', (req, res) => {
  const { longitude, latitude, idRegion } = req.body;
  create(longitude, latitude, idRegion, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, longitude, latitude, idRegion });
    }
  });
});

// Update an existing Coordonnees
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { longitude, latitude, idRegion } = req.body;
  update(id, longitude, latitude, idRegion, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Coordonnees
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteCoordonnees(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
