const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users
router.get('/', (req, res) => {
  User.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(results);
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(results[0]);
  });
});

// Create new user
router.post('/', (req, res) => {
  const newUser = req.body;
  User.create(newUser, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Update user
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  User.update(id, updatedUser, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(results);
  });
});

// Delete user
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  User.delete(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
