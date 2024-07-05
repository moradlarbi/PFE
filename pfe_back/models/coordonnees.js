const db = require('../db');

const Coordonnees = {
  getAll: (callback) => {
    const query = 'SELECT * FROM Coordonnees';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM Coordonnees WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (longitude, latitude, idRegion, callback) => {
    const query = 'INSERT INTO Coordonnees (longitude, latitude, idRegion) VALUES (?, ?, ?)';
    db.query(query, [longitude, latitude, idRegion], callback);
  },

  update: (id, longitude, latitude, idRegion, callback) => {
    const query = 'UPDATE Coordonnees SET longitude = ?, latitude = ?, idRegion = ? WHERE id = ?';
    db.query(query, [longitude, latitude, idRegion, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Coordonnees WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Coordonnees;
