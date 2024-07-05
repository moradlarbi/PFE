const express = require('express');
const router = express.Router();
const Coordonnees = require('../models/coordonnees');

// Get all Coordonnees
router.get('/', (req, res) => {
  Coordonnees.getAll((err, results) => {
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
  Coordonnees.getById(id, (err, results) => {
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
  Coordonnees.create(longitude, latitude, idRegion, (err, results) => {
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
  Coordonnees.update(id, longitude, latitude, idRegion, (err) => {
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
  Coordonnees.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
