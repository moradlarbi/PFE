import db from '../db.js';

// Récupérer les poubelles liées à un utilisateur via son idRegion
export const findTrashByUserId = (userId, callback) => {
  const query = `
    SELECT r.id AS region_id, t.id AS trash_id, t.longitude, t.latitude, t.quantity, r.nom AS region_nom
    FROM trash t
    JOIN region r ON t.idRegion = r.id
    JOIN users u ON r.id = u.idRegion
    WHERE u.id = ?
  `;
  db.query(query, [userId], callback);
};
