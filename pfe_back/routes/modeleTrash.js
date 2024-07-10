import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteModeleTrash,
} from '../models/modeleTrash.js';

const router = express.Router();

// Get all ModeleTrash
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single ModeleTrash by id
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

// Create a new ModeleTrash
router.post('/', (req, res) => {
  const { name, volume, couleur } = req.body;
  create(name, volume, couleur, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, name, volume, couleur });
    }
  });
});

// Update an existing ModeleTrash
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, volume, couleur } = req.body;
  update(id, name, volume, couleur, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a ModeleTrash
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteModeleTrash(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
