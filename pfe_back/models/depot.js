import db from '../db.js';

const getAll = (callback) => {
  const query = 'SELECT * FROM Depot';
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM Depot WHERE id = ?';
  db.query(query, [id], callback);
};

const create = (longitude, latitude, idRegion, callback) => {
  const query = 'INSERT INTO Depot (longitude, latitude, idRegion) VALUES (?, ?, ?)';
  db.query(query, [longitude, latitude, idRegion], callback);
};

const update = (id, longitude, latitude, idRegion, callback) => {
  const query = 'UPDATE Depot SET longitude = ?, latitude = ?, idRegion = ? WHERE id = ?';
  db.query(query, [longitude, latitude, idRegion, id], callback);
};

const deleteDepot = (id, callback) => {
  const query = 'DELETE FROM Depot WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteDepot };

export default {
  getAll,
  getById,
  create,
  update,
  deleteDepot,
};
