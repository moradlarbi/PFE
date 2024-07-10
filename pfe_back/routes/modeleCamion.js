import express from 'express';
import {
  getAll,
  getById,
  create,
  deleteModeleCamion,
  update
} from '../models/modeleCamion.js';

const router = express.Router();

// Get all ModeleCamions
router.get('/', (req, res) => {
   getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single ModeleCamion by id
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

// Create a new ModeleCamion
router.post('/', (req, res) => {
  const { name } = req.body;
   create(name, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, name });
    }
  });
});

// Update an existing ModeleCamion
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
   update(id, name, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a ModeleCamion
router.delete('/:id', (req, res) => {
  const id = req.params.id;
   deleteModeleCamion(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
