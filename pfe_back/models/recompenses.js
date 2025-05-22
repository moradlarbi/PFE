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
    SELECT 
      r.numero_carte AS cardNumber,
      CONCAT(u.first_name, ' ', u.last_name) AS cardHolder,
      r.points,
      r.type_recompense AS type
    FROM Recompenses r
    JOIN users u ON r.citoyen_id = u.id
    WHERE r.citoyen_id = ?
    LIMIT 1
  `;
  db.query(query, [citoyenId], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    const card = {
      cardNumber: results[0].cardNumber,
      cardHolder: results[0].cardHolder,
      points: results[0].points,
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


export const create = (citoyenId, points, type, date, callback) => {
  const numeroCarte = generateCardNumber();
  const query = `
    INSERT INTO Recompenses (citoyen_id, numero_carte, points, type_recompense, date_recompense)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [citoyenId, numeroCarte, points, type, date], callback);
};

const generateCardNumber = () => {
  const random = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  return random.toString().replace(/(.{4})/g, '$1 ').trim(); // format : "1234 5678 9012 3456"
};

