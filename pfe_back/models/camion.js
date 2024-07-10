import db from '../db.js';

// Get all Camions
const getAll = (callback) => {
  const query = 'SELECT * FROM Camion';
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

// Get a single Camion by id
const getById = (id, callback) => {
  const query = 'SELECT * FROM Camion WHERE id = ?';
  db.query(query, [id], (err, results) => {
    callback(err, results);
  });
};

// Create a new Camion
const create = (matricule, couleur, idModele, callback) => {
  const query = `
    INSERT INTO Camion (matricule, couleur, idModele)
    VALUES (?, ?, ?)
  `;
  db.query(query, [matricule, couleur, idModele], (err, results) => {
    callback(err, results);
  });
};

// Update an existing Camion
const update = (id, matricule, couleur, idModele, callback) => {
  const query = `
    UPDATE Camion
    SET matricule = ?, couleur = ?, idModele = ?
    WHERE id = ?
  `;
  db.query(query, [matricule, couleur, idModele, id], (err) => {
    callback(err);
  });
};

// Delete a Camion
const deleteCamion = (id, callback) => {
  const query = 'DELETE FROM Camion WHERE id = ?';
  db.query(query, [id], (err) => {
    callback(err);
  });
};

export { getAll, getById, create, update, deleteCamion };

export default {
  getAll,
  getById,
  create,
  update,
  deleteCamion,
};
