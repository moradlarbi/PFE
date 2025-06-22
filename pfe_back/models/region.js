import db from '../db.js';

const getAll = (callback) => {
  const query = `
    SELECT 
      r.*,
      c.longitude, c.latitude
    FROM Region r
    LEFT JOIN Coordonnees c ON r.id = c.idRegion
  `;
  db.query(query, callback);
};
const getRegions = (callback) => {
  const query = `
    SELECT *
    FROM Region r where r.active = 1
  `;
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = `SELECT 
      r.*,
      c.longitude, c.latitude
    FROM Region r
    LEFT JOIN Coordonnees c ON r.id = c.idRegion WHERE r.id = ?`;
  db.query(query, [id], callback);
};

const create = (nom, population,depotLongitude, depotLatitude, callback) => {
  const query = 'INSERT INTO Region (nom, population,depotLongitude,depotLatitude ) VALUES (?, ?)';
  db.query(query, [nom, population,depotLongitude, depotLatitude], callback);
};

const update = (id, nom, population, active, callback) => {
  const query = 'UPDATE Region SET nom = ?, population = ?, active= ? WHERE id = ?';
  db.query(query, [nom, population, active, id], callback);
};

const deleteRegion = (id, callback) => {
  const query = 'DELETE FROM Region WHERE id = ?';
  db.query(query, [id], callback);
};
export const updateActiveStatus = (regionId, active, callback) => {
  const query = 'UPDATE region SET active = ? WHERE id = ?';
  db.query(query, [active, regionId], callback);
};


export { getAll, getById, create, update, deleteRegion,getRegions };

export default {
  getAll,
  getById,
  create,
  update,
  deleteRegion,
  getRegions
};
