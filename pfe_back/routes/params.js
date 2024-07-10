import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteParams
} from '../models/params.js';

const router = express.Router();

// Get all Params
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Params by id
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

// Create a new Params
router.post('/', (req, res) => {
  const { cle, valeur } = req.body;
  create(cle, valeur, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, cle, valeur });
    }
  });
});

// Update an existing Params
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { cle, valeur } = req.body;
  update(id, cle, valeur, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Params
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteParams(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
