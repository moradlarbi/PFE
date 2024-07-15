import db from "../db.js";

const getAll = (query, callback) => {
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = "SELECT * FROM Trash WHERE id = ?";
  db.query(query, [id], callback);
};
// Get trash by region
const getByRegion = (callback) => {
  const query = `
    SELECT 
      trash.id, trash.matricule, trash.couleur, trash.idModele, 
      trash.idRegion, trash.longitude, trash.latitude, trash.quantity, 
      trash.utilisable, region.nom as region_name
    FROM trash
    JOIN region ON trash.idRegion = region.id
  `;
  db.query(query, callback);
};

const create = (
  matricule,
  couleur,
  idModele,
  idRegion,
  longitude,
  latitude,
  quantity,
  utilisable,
  callback
) => {
  const query = `
    INSERT INTO Trash (matricule, couleur, idModele, idRegion, longitude, latitude, quantity, utilisable)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      matricule,
      couleur,
      idModele,
      idRegion,
      longitude,
      latitude,
      quantity,
      utilisable,
    ],
    callback
  );
};

const update = (
  id,
  matricule,
  couleur,
  idModele,
  idRegion,
  longitude,
  latitude,
  quantity,
  utilisable,
  callback
) => {
  const query = `
    UPDATE Trash
    SET matricule = ?, couleur = ?, idModele = ?, idRegion = ?, longitude = ?, latitude = ?, quantity = ?, utilisable = ?
    WHERE id = ?
  `;
  db.query(
    query,
    [
      matricule,
      couleur,
      idModele,
      idRegion,
      longitude,
      latitude,
      quantity,
      utilisable,
      id,
    ],
    callback
  );
};

const deleteTrash = (id, callback) => {
  const query = "DELETE FROM Trash WHERE id = ?";
  db.query(query, [id], callback);
};

export { getAll, getByRegion, getById, create, update, deleteTrash };

export default {
  getAll,
  getByRegion,
  getById,
  create,
  update,
  deleteTrash,
};
