import db from '../db.js';

// Récupérer l'historique des trajets d'un chauffeur
export const findHistoryByDriverId = (driverId, callback) => {
  const query = `
    SELECT 
      id,
      chauffeur_id,
      adresse_depart_longitude,
      adresse_depart_latitude,
      date_debut,
      date_fin,
      titre,
      etat,
      itineraire
    FROM historiquechauffeur
    WHERE chauffeur_id = ?
    AND etat = "Done"
    ORDER BY date_debut DESC
  `;
  db.query(query, [driverId], callback);
};


// Ajouter un nouvel historique
export const createHistory = (historyData, callback) => {
    const query = `
      INSERT INTO historiquechauffeur 
      (chauffeur_id, adresse_depart_longitude, adresse_depart_latitude, date_debut, date_fin, titre, etat, itineraire) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      historyData.chauffeur_id,
      historyData.adresse_depart_longitude,
      historyData.adresse_depart_latitude,
      historyData.date_debut,
      historyData.date_fin,
      historyData.titre,
      historyData.etat,
      JSON.stringify(historyData.itineraire) // Bien convertir itineraire en JSON
    ];
  
    db.query(query, values, callback);
  };
// Mettre à jour l'historique   
export const updateHistory = (historyId, historyData, callback) => {
  const query = `
    UPDATE historiquechauffeur 
    SET 
      date_fin = ?, 
      etat = ?, 
    WHERE id = ?
  `;
  const values = [
    historyData.date_fin,
    historyData.etat,
    historyId
  ];

  db.query(query, values, callback);
};
// Supprimer un historique
export const deleteHistory = (historyId, callback) => {
  const query = `
    DELETE FROM historiquechauffeur 
    WHERE id = ?
  `;
  db.query(query, [historyId], callback);
};
