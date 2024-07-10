import db from '../db.js';

// Get the user's password by email
export const getPassword = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error getting password:', err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
};

// Create a new user
export const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot } = userData;
    const query = `
      INSERT INTO users (username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot], (err, results) => {
      if (err) {
        console.error('Error creating user:', err);
        return reject(err);
      }
      resolve({ id: results.insertId, ...userData });
    });
  });
};

// Get a user by ID
export const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error getting user:', err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
};

// Get a user by email
export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error getting user by email:', err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
};
