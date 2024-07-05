const db = require('../db');

const Region = {
  getAll: (callback) => {
    const query = 'SELECT * FROM Region';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM Region WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (nom, population, callback) => {
    const query = 'INSERT INTO Region (nom, population) VALUES (?, ?)';
    db.query(query, [nom, population], callback);
  },

  update: (id, nom, population, callback) => {
    const query = 'UPDATE Region SET nom = ?, population = ? WHERE id = ?';
    db.query(query, [nom, population, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Region WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Region;
