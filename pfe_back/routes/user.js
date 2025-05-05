import express from 'express';
import {
  findAll,
  findById,
  create,
  update,
  deleteUser,
  updateActiveStatus
} from '../models/user.js';
import { getUserByEmail } from '../models/authModels.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Get all users
const constructQuery = (query) => {
  let baseQuery = 'SELECT users.*, Camion.matricule as matricule, Region.nom as Region FROM users LEFT JOIN Camion ON users.idCamion=Camion.id LEFT JOIN Region ON users.idRegion=Region.id';
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
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      sexe,
      numPermis,
      idRole,
      idRegion,
      idCamion,
      idDepot,
      date_begin,
      active
    } = req.body;

    // Vérifie les champs obligatoires
    if (!email || !password || !first_name || !last_name || !idRole) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 400, message: 'Email already exists' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newData = {
      email,
      password: hashedPassword,
      username: `${last_name}${first_name}`,
      first_name,
      last_name,
      sexe,
      numPermis,
      idRole,
      idRegion,
      idCamion,
      idDepot,
      date_begin: date_begin ? new Date(date_begin) : new Date(),
      active: active ?? true,
    };
    console.log("hey")
    const results = await new Promise((resolve, reject) => {
      create(newData, (err, results) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(results);
      });
    });

    res.status(201).json({ id: results.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
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
