import db from '../db.js';

const getAll = (callback) => {
  const query = `
    SELECT 
      r.id, r.nom, r.population,
      c.longitude, c.latitude
    FROM Region r
    LEFT JOIN Coordonnees c ON r.id = c.idRegion
  `;
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM Region WHERE id = ?';
  db.query(query, [id], callback);
};

const create = (nom, population, callback) => {
  const query = 'INSERT INTO Region (nom, population) VALUES (?, ?)';
  db.query(query, [nom, population], callback);
};

const update = (id, nom, population, callback) => {
  const query = 'UPDATE Region SET nom = ?, population = ? WHERE id = ?';
  db.query(query, [nom, population, id], callback);
};

const deleteRegion = (id, callback) => {
  const query = 'DELETE FROM Region WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteRegion };

export default {
  getAll,
  getById,
  create,
  update,
  deleteRegion,
};
