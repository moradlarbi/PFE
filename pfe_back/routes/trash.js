const express = require('express');
const router = express.Router();
const Trash = require('../models/trash');

// Get all Trash
router.get('/', (req, res) => {
  Trash.getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Trash by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Trash.getById(id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new Trash
router.post('/', (req, res) => {
  const { matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable } = req.body;
  Trash.create(matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable });
    }
  });
});

// Update an existing Trash
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable } = req.body;
  Trash.update(id, matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Trash
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Trash.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
