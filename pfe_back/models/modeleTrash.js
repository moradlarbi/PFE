import db from "../db.js";


const getAll = (query, callback) => {
  const query = "SELECT * FROM ModeleTrash";
  db.query(query, callback);
};

const getById = (id, callback) => {
  const query = "SELECT * FROM ModeleTrash WHERE id = ?";
  db.query(query, [id], callback);
};

const create = (name, volume, couleur, callback) => {
  const query =
    "INSERT INTO ModeleTrash (name, volume, couleur) VALUES (?, ?, ?)";
  db.query(query, [name, volume, couleur], callback);
};

const update = (id, name, volume, couleur, callback) => {
  const query =
    "UPDATE ModeleTrash SET name = ?, volume = ?, couleur = ? WHERE id = ?";
  db.query(query, [name, volume, couleur, id], callback);
};

const deleteModeleTrash = (id, callback) => {
  const query = "DELETE FROM ModeleTrash WHERE id = ?";
  db.query(query, [id], callback);
};

export { getAll, getById, create, update, deleteModeleTrash };

export default {
  getAll,
  getById,
  create,
  update,
  deleteModeleTrash,
};
