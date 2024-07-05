// routes/modeleCamionRoutes.js
const express = require('express');
const router = express.Router();
const ModeleCamion = require('../models/modeleCamion');

// Get all ModeleCamions
router.get('/', (req, res) => {
  ModeleCamion.getAll((err, results) => {
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
  ModeleCamion.getById(id, (err, results) => {
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
  ModeleCamion.create(name, (err, results) => {
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
  ModeleCamion.update(id, name, (err) => {
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
  ModeleCamion.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
