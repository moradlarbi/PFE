const express = require('express');
const router = express.Router();
const Depot = require('../models/depot');

// Get all Depots
router.get('/', (req, res) => {
  Depot.getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Depot by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Depot.getById(id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new Depot
router.post('/', (req, res) => {
  const { longitude, latitude, idRegion } = req.body;
  Depot.create(longitude, latitude, idRegion, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, longitude, latitude, idRegion });
    }
  });
});

// Update an existing Depot
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { longitude, latitude, idRegion } = req.body;
  Depot.update(id, longitude, latitude, idRegion, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Depot
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Depot.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
