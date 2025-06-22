import express from 'express';
import {
  findAll,
  getById,
  create,
  update,
  deleteCamion,
  updateActiveStatus
} from '../models/camion.js';

const router = express.Router();

// Get all Camions
const constructQuery = (query) => {
  let baseQuery = `
  SELECT camion.*, ModeleCamion.name as modeleName 
  FROM camion 
  JOIN ModeleCamion ON camion.idModele = ModeleCamion.id`;
  const whereClauses = [];
  const orderClauses = [];
  let limitClause = '';
  let offsetClause = '';

  // Filters
  if (query.filters) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (typeof value === 'object' && '$eq' in value) {
        whereClauses.push(`${key} = ${value['$eq']}`);
      }
    }
  }

  // Sorting
  if (query.sort) {
    const sort = Array.isArray(query.sort) ? query.sort : [query.sort];
    for (const sortParam of sort) {
      const [field, direction] = sortParam.split(':');
      orderClauses.push(`${field} ${direction.toUpperCase()}`);
    }
  }

  

  // Construct the final query
  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
  }
  if (orderClauses.length > 0) {
    baseQuery += ` ORDER BY ${orderClauses.join(', ')}`;
  }
  if (limitClause) {
    baseQuery += ` ${limitClause}`;
  }
  if (offsetClause) {
    baseQuery += ` ${offsetClause}`;
  }

  return baseQuery;
};
router.get('/', async (req, res) => {
  try {
    const query = constructQuery(req.query);
    const results = await new Promise((resolve, reject) => {
      findAll(query, (err, results) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        else {resolve(results)};
      });
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Camion by id
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

// Create a new Camion
router.post('/', (req, res) => {
  const { matricule, couleur, idModele } = req.body;
  create(matricule, couleur, idModele, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, matricule, couleur, idModele });
    }
  });
});
router.put('/active/:id', async (req, res) => {
  const id = req.params.id;
  const { active } = req.body;
  console.log(active,id)

  try {
    await new Promise((resolve, reject) => {
      updateActiveStatus(id, active, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    res.status(200).json({ message: 'Camion active status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update an existing Camion
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { matricule, couleur, idModele,active } = req.body;
  update(id, matricule, couleur, idModele,active, (err) => {
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
  deleteCamion(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
