import db from "../db.js";

export const findAll = (query, callback) => {
  db.query(query, callback);
};

export const findById = (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], callback);
};

export const create = (userData, callback) => {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    sexe,
    date_begin,
    numPermis,
    idRole,
    idCamion,
    idDepot,
  } = userData;
  const query = `
    INSERT INTO users (username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [
      username,
      email,
      password,
      first_name,
      last_name,
      sexe,
      date_begin,
      numPermis,
      idRole,
      idCamion,
      idDepot,
    ],
    callback
  );
};

export const update = (id, userData, callback) => {
  const {
    username,
    active,
    email,
    password,
    first_name,
    last_name,
    sexe,
    date_begin,
    numPermis,
    idRole,
    idCamion,
    idDepot,
  } = userData;
  const query = `
    UPDATE users 
    SET username = ?,active= ?, email = ?, password = ?, first_name = ?, last_name = ?, sexe = ?, date_begin = ?, numPermis = ?, idRole = ?, idCamion = ?, idDepot = ?
    WHERE id = ?
  `;
  db.query(
    query,
    [
      username,
      active,
      email,
      password,
      first_name,
      last_name,
      sexe,
      date_begin,
      numPermis,
      idRole,
      idCamion,
      idDepot,
      id,
    ],
    callback
  );
};

export const updateActiveStatus = (userId, active, callback) => {
  const query = "UPDATE users SET active = ? WHERE id = ?";
  db.query(query, [active, userId], callback);
};
export const deleteUser = (id, callback) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], callback);
};
