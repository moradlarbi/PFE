// models/ModeleCamion.js
const db = require('../db');

const ModeleCamion = {
  getAll: (callback) => {
    db.query('SELECT * FROM ModeleCamion', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM ModeleCamion WHERE id = ?', [id], callback);
  },

  create: (name, callback) => {
    db.query('INSERT INTO ModeleCamion (name) VALUES (?)', [name], callback);
  },

  update: (id, name, callback) => {
    db.query('UPDATE ModeleCamion SET name = ? WHERE id = ?', [name, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM ModeleCamion WHERE id = ?', [id], callback);
  }
};

module.exports = ModeleCamion;
