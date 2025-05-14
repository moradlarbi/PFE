import express from 'express';
import {
  getAll,
  getById,
  deleteMessage
} from '../models/contact.js';

const router = express.Router();

// Get all messages
router.get('/', (req, res) => {
   getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Get a single message by id
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


// Delete a contact message
router.delete('/:id', (req, res) => {
  const id = req.params.id;
   deleteMessage(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
