import db from '../db.js';

const getAll = (query,callback) => {
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = 'SELECT * FROM Trash WHERE id = ?';
  db.query(query, [id], callback);
};
const getByRegion = (idRegion, callback) => {
  const query = 'SELECT * FROM Trash WHERE idRegion = ?';
  db.query(query, [idRegion], callback);
}
const create = ( idModele, idRegion, longitude, latitude, quantity, utilisable, callback) => {
  const query = `
    INSERT INTO Trash ( idModele, idRegion, longitude, latitude, quantity, utilisable)
    VALUES ( ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [ idModele, idRegion, longitude, latitude, quantity, utilisable], callback);
};

const update = (id, idModele, idRegion, longitude, latitude, quantity, utilisable, callback) => {
  const query = `
    UPDATE Trash
    SET  idModele = ?, idRegion = ?, longitude = ?, latitude = ?, quantity = ?, utilisable = ?
    WHERE id = ?
  `;
  db.query(query, [ idModele, idRegion, longitude, latitude, quantity, utilisable, id], callback);
};

const deleteTrash = (id, callback) => {
  const query = 'DELETE FROM Trash WHERE id = ?';
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteTrash,getByRegion };

export default {
  getAll,
  getById,
  create,
  update,
  deleteTrash,
  getByRegion
};
