// routes/camionRoutes.js
const express = require('express');
const router = express.Router();
const Camion = require('../models/camion');

// Get all Camions
router.get('/', (req, res) => {
  Camion.getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single Camion by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Camion.getById(id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new Camion
router.post('/', (req, res) => {
  const { matricule, couleur, idModele } = req.body;
  Camion.create(matricule, couleur, idModele, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, matricule, couleur, idModele });
    }
  });
});

// Update an existing Camion
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { matricule, couleur, idModele } = req.body;
  Camion.update(id, matricule, couleur, idModele, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Camion
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Camion.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
