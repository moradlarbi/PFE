import db from "../db.js";

const getTrashWithRegionName = (callback) => {
  const query = `
    SELECT 
      t.id, 
      t.idModele, 
      r.nom AS region_nom, 
      t.longitude, 
      t.latitude, 
      t.quantity, 
      t.utilisable
    FROM 
      trash t
    LEFT JOIN 
      region r ON t.idRegion = r.id;
  `;
  db.query(query, callback);
};

export { getTrashWithRegionName };

export default {
  getTrashWithRegionName,
};
