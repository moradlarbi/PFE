import db from '../db.js';

const getAll = (callback) => {
  const query = 'SELECT * FROM Params';
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM Params WHERE id = ?';
  db.query(query, [id], callback);
};

const create = (cle, valeur, callback) => {
  const query = 'INSERT INTO Params (cle, valeur) VALUES (?, ?)';
  db.query(query, [cle, valeur], callback);
};

const update = (id, cle, valeur, callback) => {
  const query = 'UPDATE Params SET cle = ?, valeur = ? WHERE id = ?';
  db.query(query, [cle, valeur, id], callback);
};

const deleteParams = (id, callback) => {
  const query = 'DELETE FROM Params WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteParams };

export default {
  getAll,
  getById,
  create,
  update,
  deleteParams,
};
