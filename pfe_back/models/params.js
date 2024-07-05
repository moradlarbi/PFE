const db = require('../db');

const Params = {
  getAll: (callback) => {
    const query = 'SELECT * FROM Params';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM Params WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (cle, valeur, callback) => {
    const query = 'INSERT INTO Params (cle, valeur) VALUES (?, ?)';
    db.query(query, [cle, valeur], callback);
  },

  update: (id, cle, valeur, callback) => {
    const query = 'UPDATE Params SET cle = ?, valeur = ? WHERE id = ?';
    db.query(query, [cle, valeur, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Params WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Params;
