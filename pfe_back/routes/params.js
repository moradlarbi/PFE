import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteParams
} from '../models/params.js';
import db from '../db.js';
const router = express.Router();

router.get("/kpi", (req, res) => {
  const queryTrash = `Select count(*) as total_poubelle from trash where utilisable = 1;`;
  const queryChauffeur = `Select count(*) as total_chauffeur from users where idRole = 1 AND active = 1;`;
  const queryCapacity = 'Select sum(M.volume) as total_capacite from Trash T LEFT JOIN modeletrash M on T.idModele = M.id;'

  // Execute the queries in parallel
  db.query(queryTrash, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error executing query');
    }
    const totalPoubelle = results[0].total_poubelle;

    db.query(queryChauffeur, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error executing query');
      }
      const totalChauffeur = results[0].total_chauffeur;

      db.query(queryCapacity, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error executing query');
        }
        const totalCapacite = results[0].total_capacite;
        // Send the response with all three values
        res.json({ totalPoubelle, totalChauffeur, totalCapacite });
      });
    });
  });

})

router.get("/capacity", (req,res) => {
  const query = `SELECT
  SUM((t.quantity / 100.0) * m.volume) AS volume_utilise,
  SUM(m.volume) AS capacite_totale_theorique
  FROM trash t
  JOIN modeletrash m ON t.idModele = m.id;`
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error executing query');
    }
    const {volume_utilise, capacite_totale_theorique} = results[0];
    res.json({ volume_utilise, capacite_totale_theorique });
  })
})
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
