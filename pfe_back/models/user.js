import db from '../db.js';

export const findAll = (callback) => {
  const query = 'SELECT * FROM users';
  db.query(query, callback);
};

export const findById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], callback);
};

export const create = (userData, callback) => {
  const { username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot } = userData;
  const query = `
    INSERT INTO users (username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot], callback);
};

export const update = (id, userData, callback) => {
  const { username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot } = userData;
  const query = `
    UPDATE users 
    SET username = ?, email = ?, password = ?, first_name = ?, last_name = ?, sexe = ?, date_begin = ?, numPermis = ?, idRole = ?, idCamion = ?, idDepot = ?
    WHERE id = ?
  `;
  db.query(query, [username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot, id], callback);
};

export const deleteUser = (id, callback) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], callback);
};
