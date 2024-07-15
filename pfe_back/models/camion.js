import db from '../db.js';

// Get all Camions
export const findAll = (query, callback) => {
  db.query(query, callback);
};

// Get a single Camion by id
const getById = (id, callback) => {
  const query = 'SELECT * FROM Camion WHERE id = ?';
  db.query(query, [id], (err, results) => {
    callback(err, results);
  });
};
export const updateActiveStatus = (userId, active, callback) => {
  const query = 'UPDATE camion SET active = ? WHERE id = ?';
  db.query(query, [active, userId], callback);
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
const update = (id, matricule, couleur, idModele,active, callback) => {
  const query = `
    UPDATE Camion
    SET matricule = ?, couleur = ?, idModele = ?,active = ?
    WHERE id = ?
  `;
  db.query(query, [matricule, couleur, idModele,active, id], (err) => {
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

export { getById, create, update, deleteCamion };

export default {
  findAll,
  getById,
  create,
  update,
  deleteCamion,
};
