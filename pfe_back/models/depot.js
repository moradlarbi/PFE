const db = require('../db');

const Depot = {
  getAll: (callback) => {
    const query = 'SELECT * FROM Depot';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM Depot WHERE id = ?';
    db.query(query, [id], callback);
  },

  create: (longitude, latitude, idRegion, callback) => {
    const query = 'INSERT INTO Depot (longitude, latitude, idRegion) VALUES (?, ?, ?)';
    db.query(query, [longitude, latitude, idRegion], callback);
  },

  update: (id, longitude, latitude, idRegion, callback) => {
    const query = 'UPDATE Depot SET longitude = ?, latitude = ?, idRegion = ? WHERE id = ?';
    db.query(query, [longitude, latitude, idRegion, id], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM Depot WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Depot;
