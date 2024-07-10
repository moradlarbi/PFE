import db from '../db.js';

const getAll = (callback) => {
  const query = 'SELECT * FROM ModeleCamion';
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM ModeleCamion WHERE id = ?';
  db.query(query, [id], callback);
};

const create = (name, callback) => {
  const query = 'INSERT INTO ModeleCamion (name) VALUES (?)';
  db.query(query, [name], callback);
};

const update = (id, name, callback) => {
  const query = 'UPDATE ModeleCamion SET name = ? WHERE id = ?';
  db.query(query, [name, id], callback);
};

const deleteModeleCamion = (id, callback) => {
  const query = 'DELETE FROM ModeleCamion WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteModeleCamion };

export default {
  getAll,
  getById,
  create,
  update,
  deleteModeleCamion,
};
