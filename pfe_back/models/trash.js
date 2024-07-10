import db from '../db.js';

const getAll = (callback) => {
  const query = 'SELECT * FROM Trash';
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM Trash WHERE id = ?';
  db.query(query, [id], callback);
};

const create = (matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, callback) => {
  const query = `
    INSERT INTO Trash (matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable], callback);
};

const update = (id, matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, callback) => {
  const query = `
    UPDATE Trash
    SET matricule = ?, couleur = ?, idModele = ?, idRegion = ?, longitude = ?, latitude = ?, quantity = ?, utilisable = ?
    WHERE id = ?
  `;
  db.query(query, [matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable, id], callback);
};

const deleteTrash = (id, callback) => {
  const query = 'DELETE FROM Trash WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteTrash };

export default {
  getAll,
  getById,
  create,
  update,
  deleteTrash,
};
