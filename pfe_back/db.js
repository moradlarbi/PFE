const mysql = require('mysql');

// Load environment variables from .env file (only needed for local development)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
