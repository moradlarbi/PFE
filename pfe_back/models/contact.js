import db from '../db.js';

const getAll = (callback) => {
  const query = 'SELECT * FROM contact';
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM contact WHERE id = ?';
  db.query(query, [id], callback);
};


const deleteMessage = (id, callback) => {
  const query = 'DELETE FROM contact WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, deleteMessage };

export default {
  getAll,
  getById,
  deleteMessage
};
