import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteTrash
} from '../models/trash.js';

const router = express.Router();

// Get all Trash
const constructQuery = (query) => {
  let baseQuery = 'SELECT * FROM trash';
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

  // Pagination
  if (query.pagination) {
    if (query.pagination.page && query.pagination.pageSize) {
      const page = parseInt(query.pagination.page, 10);
      const pageSize = parseInt(query.pagination.pageSize, 10);
      offsetClause = `OFFSET ${(page - 1) * pageSize}`;
      limitClause = `LIMIT ${pageSize}`;
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
      getAll(query, (err, results) => {
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

// Get a single Trash by id
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

// Create a new Trash
router.post('/', (req, res) => {
  console.log(req.body)
  const { matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable } = req.body;
  create(matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, (err, results) => {
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
  update(id, matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, (err) => {
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
  deleteTrash(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
