import express from 'express';
import {
  findAll,
  findById,
  create,
  update,
  deleteUser
} from '../models/user.js';

const router = express.Router();

// Get all users
const constructQuery = (query) => {
  let baseQuery = 'SELECT * FROM users';
  const whereClauses = [];
  const orderClauses = [];
  let limitClause = '';
  let offsetClause = '';

  // Filters
  if (query.filters) {
    const filters = JSON.parse(query.filters);
    for (const [key, value] of Object.entries(filters)) {
      whereClauses.push(`${key} = ${value}`);
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
    const pagination = JSON.parse(query.pagination);
    if (pagination.page && pagination.pageSize) {
      const page = parseInt(pagination.page, 10);
      const pageSize = parseInt(pagination.pageSize, 10);
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
    console.log(query)
    const results = await new Promise((resolve, reject) => {
      findAll(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    console.log(results)
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
