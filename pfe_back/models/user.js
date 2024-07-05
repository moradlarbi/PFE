const db = require('../db');

const User = {
  create: (userData, callback) => {
    const { username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot } = userData;
    const query = `INSERT INTO users (username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot], callback);
  },
  findAll: (callback) => {
    db.query('SELECT * FROM users', callback);
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback);
  },
  update: (id, userData, callback) => {
    const { username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot } = userData;
    const query = `UPDATE users SET username = ?, email = ?, password = ?, first_name = ?, last_name = ?, sexe = ?, date_begin = ?, numPermis = ?, idRole = ?, idCamion = ?, idDepot = ? WHERE id = ?`;
    db.query(query, [username, email, password, first_name, last_name, sexe, date_begin, numPermis, idRole, idCamion, idDepot, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [id], callback);
  }
};

module.exports = User;
