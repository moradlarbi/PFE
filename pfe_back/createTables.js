const db = require('./db');

// Define the SQL commands to create multiple tables
const createRoleTable = `
CREATE TABLE IF NOT EXISTS role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)
`;
const createModeleCamionTable = `
CREATE TABLE IF NOT EXISTS ModeleCamion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)
`;
const createCamionTable = `
INSERT INTO ModeleCamion (name) VALUES ('Volvo FH16');
INSERT INTO ModeleCamion (name) VALUES ('Scania R500');
INSERT INTO ModeleCamion (name) VALUES ('Mercedes-Benz Actros');
INSERT INTO ModeleCamion (name) VALUES ('MAN TGX');
INSERT INTO ModeleCamion (name) VALUES ('DAF XF');

`;
const createModeleTrashTable = `
CREATE TABLE IF NOT EXISTS ModeleTrash (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  volume INT NOT NULL,
  couleur VARCHAR(50)
)
`;
const createTrashTable = `
CREATE TABLE IF NOT EXISTS Trash (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricule VARCHAR(100) NOT NULL,
  couleur VARCHAR(50) NOT NULL,
  idModele INT NOT NULL,
  idRegion INT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  utilisable boolean DEFAULT TRUE,
  FOREIGN KEY (idRegion) REFERENCES Region(id),
  FOREIGN KEY (idModele) REFERENCES ModeleTrash(id)
)
`;
const createRegionTable = `
CREATE TABLE IF NOT EXISTS Region (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  population INT NOT NULL
)
`;
const createDepotTable = `
CREATE TABLE IF NOT EXISTS Depot (
  id INT AUTO_INCREMENT PRIMARY KEY,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  idRegion INT NOT NULL,
  FOREIGN KEY (idRegion) REFERENCES Region(id)
)
`;
const createCoordonneesTable = `
CREATE TABLE IF NOT EXISTS Coordonnees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  idRegion INT NOT NULL,
  FOREIGN KEY (idRegion) REFERENCES Region(id)
)
`;
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  sexe boolean DEFAULT FALSE,
  date_begin DATE,
  numPermis INT,
  idRole INT,
  idCamion INT NULL,
  idDepot INT NULL,
  FOREIGN KEY (idCamion) REFERENCES Camion(id),
  FOREIGN KEY (idDepot) REFERENCES Depot(id),
  FOREIGN KEY (idRole) REFERENCES role(id)
)
`;

const createParamsTable = `
CREATE TABLE IF NOT EXISTS Params (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cle VARCHAR(100) NOT NULL,
  valeur VARCHAR(100) NOT NULL
)
`;
// Function to execute a query and log the result
const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results, fields) => {
      if (err) {
        console.error('Error executing query:', err.stack);
        reject(err);
      } else {
        console.log('Query executed successfully:', query);
        resolve(results);
      }
    });
  });
};

// Execute the SQL commands
const createTables = async () => {
  try {
    await executeQuery(createRoleTable);
    await executeQuery(createModeleCamionTable);
    await executeQuery(createCamionTable);
    await executeQuery(createModeleTrashTable);
    await executeQuery(createRegionTable);
    await executeQuery(createTrashTable);
    await executeQuery(createDepotTable);
    await executeQuery(createCoordonneesTable);
    await executeQuery(createUsersTable);
    await executeQuery(createParamsTable);
    console.log('All tables created or already exist.');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    // Close the database connection
    db.end();
  }
};

// Run the function to create tables
createTables();
