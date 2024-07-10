import db from '../db.js';

// Get all Coordonnees
const getAll = (callback) => {
  const query = 'SELECT * FROM Coordonnees';
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

// Get a single Coordonnees by id
const getById = (id, callback) => {
  const query = 'SELECT * FROM Coordonnees WHERE id = ?';
  db.query(query, [id], (err, results) => {
    callback(err, results);
  });
};

// Create a new Coordonnees
const create = (longitude, latitude, idRegion, callback) => {
  const query = `
    INSERT INTO Coordonnees (longitude, latitude, idRegion)
    VALUES (?, ?, ?)
  `;
  db.query(query, [longitude, latitude, idRegion], (err, results) => {
    callback(err, results);
  });
};

// Update an existing Coordonnees
const update = (id, longitude, latitude, idRegion, callback) => {
  const query = `
    UPDATE Coordonnees
    SET longitude = ?, latitude = ?, idRegion = ?
    WHERE id = ?
  `;
  db.query(query, [longitude, latitude, idRegion, id], (err) => {
    callback(err);
  });
};

// Delete a Coordonnees
const deleteCoordonnees = (id, callback) => {
  const query = 'DELETE FROM Coordonnees WHERE id = ?';
  db.query(query, [id], (err) => {
    callback(err);
  });
};

export { getAll, getById, create, update, deleteCoordonnees };

export default {
  getAll,
  getById,
  create,
  update,
  deleteCoordonnees,
};
