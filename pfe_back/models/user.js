import db from '../db.js';

export const findAll = (query, callback) => {
  db.query(query, callback);
};

export const findById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], callback);
};

export const create = (userData, callback) => {
  console.log("data",userData)
  const { username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion,idRegion } = userData;
  const query = `
    INSERT INTO users (username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion,idRegion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion,idRegion], callback);
};

export const update = (id, userData, callback) => {
  const { username,active, email, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion,idRegion } = userData;
  const query = `
    UPDATE users 
    SET username = ?,active= ?, email = ?, first_name = ?, last_name = ?, sexe = ?, date_begin = ?, numPermis = ?, idRole = ?, idCamion = ?, idRegion= ?
    WHERE id = ?
  `;
  db.query(query, [username,active, email, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion,idRegion, id], callback);
};
export const updateActiveStatus = (userId, active, callback) => {
  const query = 'UPDATE users SET active = ? WHERE id = ?';
  db.query(query, [active, userId], callback);
};
export const deleteUser = (id, callback) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], callback);
};
