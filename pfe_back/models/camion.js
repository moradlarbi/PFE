// models/Camion.js
const db = require('../db');

const Camion = {
  getAll: (callback) => {
    db.query('SELECT * FROM Camion', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM Camion WHERE id = ?', [id], callback);
  },

  create: (matricule, couleur, idModele, callback) => {
    db.query('INSERT INTO Camion (matricule, couleur, idModele) VALUES (?, ?, ?)', [matricule, couleur, idModele], callback);
  },

  update: (id, matricule, couleur, idModele, callback) => {
    db.query('UPDATE Camion SET matricule = ?, couleur = ?, idModele = ? WHERE id = ?', [matricule, couleur, idModele, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM Camion WHERE id = ?', [id], callback);
  }
};

module.exports = Camion;
