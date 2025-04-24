import db from '../db.js';

// Récupérer tous les messages avec nom d'utilisateur
export const findAll = (callback) => {
  const query = `
    SELECT c.id, c.titre, c.message, u.first_name AS name, u.id AS userId
    FROM Contact c
    JOIN users u ON c.idUser = u.id
    ORDER BY c.id DESC
  `;
  db.query(query, callback);
};

// Créer un message de contact
export const create = (idUser, titre, message, callback) => {
  const query = `
    INSERT INTO Contact (idUser, titre, message)
    VALUES (?, ?, ?)
  `;
  db.query(query, [idUser, titre, message], callback);
};
