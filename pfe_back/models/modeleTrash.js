const db = require('../db');

const ModeleTrash = {
  getAll: (callback) => {
    const query = 'SELECT * FROM ModeleTrash';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM ModeleTrash WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (name, volume, couleur, callback) => {
    const query = 'INSERT INTO ModeleTrash (name, volume, couleur) VALUES (?, ?, ?)';
    db.query(query, [name, volume, couleur], callback);
  },

  update: (id, name, volume, couleur, callback) => {
    const query = 'UPDATE ModeleTrash SET name = ?, volume = ?, couleur = ? WHERE id = ?';
    db.query(query, [name, volume, couleur, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM ModeleTrash WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = ModeleTrash;
