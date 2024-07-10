import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteRegion
} from '../models/region.js';

const router = express.Router();

// Get all Regions
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Region by id
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

// Create a new Region
router.post('/', (req, res) => {
  const { nom, population } = req.body;
  create(nom, population, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, nom, population });
    }
  });
});

// Update an existing Region
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nom, population } = req.body;
  update(id, nom, population, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Region
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteRegion(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
