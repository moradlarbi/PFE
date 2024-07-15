import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteRegion
} from '../models/region.js';
import db from "../db.js"
const router = express.Router();

// Get all Regions
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const regions = {};
      results.forEach(row => {
        if (!regions[row.id]) {
          regions[row.id] = {
            id: row.id,
            nom: row.nom,
            population: row.population,
            coordinates: []
          };
        }
        if (row.longitude !== null && row.latitude !== null) {
          regions[row.id].coordinates.push({
            longitude: row.longitude,
            latitude: row.latitude
          });
        }
      });

      res.json(Object.values(regions));
    }
  });
});


// Get a single Region by id
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

// Create a new Region
router.post('/', (req, res) => {
  const { nom, population, coordinates } = req.body;
  console.log(req.body)
  // Check if the required fields are provided
  if (!nom || population === undefined || !coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: 'Missing required fields or invalid data.' });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Insert the region
    const createRegionQuery = 'INSERT INTO Region (nom, population) VALUES (?, ?)';
    db.query(createRegionQuery, [nom, population], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send(err);
        });
      }

      const regionId = results.insertId;

      // Prepare to insert coordinates
      const createCoordonneesQuery = `
        INSERT INTO Coordonnees (longitude, latitude, idRegion)
        VALUES ?
      `;
      const coordinatesValues = coordinates.map(([longitude, latitude]) => [longitude, latitude, regionId]);

      // Insert the coordinates
      db.query(createCoordonneesQuery, [coordinatesValues], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send(err);
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send(err);
            });
          }

          res.status(201).json({ id: regionId, nom, population });
        });
      });
    });
  });
});


// Update an existing Region
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nom, population } = req.body;
  update(id, nom, population, (err) => {
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
  deleteRegion(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
