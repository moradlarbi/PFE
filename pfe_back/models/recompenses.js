import db from '../db.js';

// Récupérer toutes les récompenses avec nom utilisateur
export const findAll = (callback) => {
  const query = `
    SELECT r.id, u.first_name AS name, r.points
    FROM Recompenses r
    JOIN users u ON r.citoyen_id = u.id
    ORDER BY r.points DESC
  `;
  db.query(query, callback);
};

export const getUserRewardCard = (citoyenId, callback) => {
    const query = `
      SELECT numero_carte AS cardNumber, titulaire_carte AS cardHolder
      FROM Recompenses
      WHERE citoyen_id = ?
      LIMIT 1
    `;
    db.query(query, [citoyenId], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      const card = {
        cardNumber: results[0].cardNumber,
        cardHolder: results[0].cardHolder,
        codeBar: "lib/UI/Assets/Images/barcode.gif"
      };
      callback(null, card);
    });
  };

  
// Incrémenter les points d'un utilisateur
export const incrementPoints = (citoyenId, increment, callback) => {
  const query = `
    UPDATE Recompenses
    SET points = points + ?
    WHERE citoyen_id = ?
  `;
  db.query(query, [increment, citoyenId], callback);
};

// Ajouter une récompense (nouvel utilisateur)
export const create = (citoyenId, points, type, date, callback) => {
  const query = `
    INSERT INTO Recompenses (citoyen_id, points, type_recompense, date_recompense)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [citoyenId, points, type, date], callback);
};
