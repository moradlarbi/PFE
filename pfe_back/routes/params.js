const express = require('express');
const router = express.Router();
const Params = require('../models/params');

// Get all Params
router.get('/', (req, res) => {
  Params.getAll((err, results) => {
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
  Params.getById(id, (err, results) => {
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
  Params.create(cle, valeur, (err, results) => {
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
  Params.update(id, cle, valeur, (err) => {
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
  Params.delete(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
