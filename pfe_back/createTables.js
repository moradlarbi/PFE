const db = require('./db');

// Define the SQL commands to create multiple tables
const createRoleTable = `
CREATE TABLE IF NOT EXISTS role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)
`;

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id)
)
`;

const createPostsTable = `
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`;

const createCommentsTable = `
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INT,
  user_id INT,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
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
    await executeQuery(createUsersTable);
    await executeQuery(createPostsTable);
    await executeQuery(createCommentsTable);
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
