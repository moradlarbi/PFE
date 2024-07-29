import express from 'express';
import {
  findAll,
  findById,
  create,
  update,
  deleteUser,
  updateActiveStatus
} from '../models/user.js';

const router = express.Router();

// Get all users
const constructQuery = (query) => {
  let baseQuery = 'SELECT users.*, Camion.matricule as matricule FROM users JOIN Camion ON users.idCamion=Camion.id';
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

  console.log('Constructed Query:', baseQuery); // Log the query for debugging
  return baseQuery;
};


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
// Get user by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const results = await new Promise((resolve, reject) => {
      findById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  const newUser = req.body;
  try {
    const results = await new Promise((resolve, reject) => {
      create(newUser, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.status(201).json({ id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
    res.status(200).json({ message: 'User active status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update user
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  try {
    await new Promise((resolve, reject) => {
      update(id, updatedUser, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await new Promise((resolve, reject) => {
      deleteUser(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
