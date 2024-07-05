const db = require('../db');

const Trash = {
  getAll: (callback) => {
    const query = 'SELECT * FROM Trash';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM Trash WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, callback) => {
    const query = 'INSERT INTO Trash (matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable], callback);
  },

  update: (id, matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, callback) => {
    const query = 'UPDATE Trash SET matricule = ?, couleur = ?, idModele = ?, idRegion = ?, longitude = ?, latitude = ?, quantity = ?, utilisable = ? WHERE id = ?';
    db.query(query, [matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Trash WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Trash;
