const express = require('express');
const router = express.Router();
const Region = require('../models/region');

// Get all Regions
router.get('/', (req, res) => {
  Region.getAll((err, results) => {
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
  Region.getById(id, (err, results) => {
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
  Region.create(nom, population, (err, results) => {
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
  Region.update(id, nom, population, (err) => {
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
  Region.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
