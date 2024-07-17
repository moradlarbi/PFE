import express from 'express';
import {
  getAll,
  getById,
  create,
  update,
  deleteModeleTrash,
} from '../models/modeleTrash.js';
import db from "../db.js"
const router = express.Router();
const constructQuery = (query) => {
  let baseQuery = 'SELECT modeleTrash.*, COUNT(Trash.id) AS total FROM modeleTrash LEFT JOIN Trash ON Trash.idModele = modeleTrash.id';
  const whereClauses = [];
  const orderClauses = [];
  let limitClause = '';
  let offsetClause = '';

  // Filters
  if (query.filters) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (typeof value === 'object' && '$eq' in value) {
        whereClauses.push(`${key} = '${value['$eq']}'`);
      }
    }
  }

  // Construct the WHERE clause
  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  // Group by
  baseQuery += ' GROUP BY modeleTrash.id';

  // Sorting
  if (query.sort) {
    const sort = Array.isArray(query.sort) ? query.sort : [query.sort];
    for (const sortParam of sort) {
      const [field, direction] = sortParam.split(':');
      orderClauses.push(`${field} ${direction.toUpperCase()}`);
    }
  }

  // Construct the ORDER BY clause
  if (orderClauses.length > 0) {
    baseQuery += ` ORDER BY ${orderClauses.join(', ')}`;
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

  // Construct the final query with LIMIT and OFFSET
  if (limitClause) {
    baseQuery += ` ${limitClause}`;
  }
  if (offsetClause) {
    baseQuery += ` ${offsetClause}`;
  }

  console.log('Constructed Query:', baseQuery); // Log the query for debugging
  return baseQuery;
};


// Get all ModeleTrash
router.get('/', async (req, res) => {
  try {
    const prepquery = {
      filters: req.query.filters,
      sort: req.query.sort,
      pagination: {
        page: req.query['pagination[page]'],
        pageSize: req.query['pagination[pageSize]']
      }
    };
    const query = constructQuery(prepquery);
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

// Get a single ModeleTrash by id
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
router.post('/cans', (req, res) => {
  const trashData = req.body;
  if (!Array.isArray(trashData) || trashData.length === 0) {
    return res.status(400).json({ error: 'Invalid data format or empty data.' });
  }

  const query = 'INSERT INTO Trash (idModele, idRegion, longitude, latitude, quantity, utilisable) VALUES ?';
  const values = trashData.map(trash => [trash.model, null, trash.lng, trash.lat, 0, 1]);

  db.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to insert trash data.', details: err });
    }
    res.status(201).json({ message: 'Trash data inserted successfully.', insertId: result.insertId });
  });
});
// Create a new ModeleTrash
router.post('/', (req, res) => {
  const { name, volume, couleur } = req.body;
  console.log(req.body)
  create(name, volume, couleur, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: results.insertId, name, volume, couleur });
    }
  });
});

// Update an existing ModeleTrash
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, volume, couleur } = req.body;
  update(id, name, volume, couleur, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a ModeleTrash
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteModeleTrash(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
