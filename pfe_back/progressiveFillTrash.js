import db from './db.js';
const getAllTrashIds = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT id FROM Trash', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.map(row => row.id));
      });
    });
  };
  
  // Function to update trash quantity
  const updateTrashQuantity = (id, increment) => {
    const query = `
      UPDATE Trash 
      SET quantity = CASE 
        WHEN quantity + ? <= 100 THEN quantity + ? 
        ELSE 100 
      END
      WHERE id = ?
    `;
  
    db.query(query, [increment, increment, id], (err, result) => {
      if (err) {
        console.error(`Failed to update trash quantity for id ${id}:`, err);
        return;
      }
      console.log(`Trash quantity for id ${id} updated by ${increment}%`);
    });
  };
  
  // Function to start the update process for a single trash can
  const startUpdatingTrash = (id) => {
    const randomInterval = Math.random() * 60000 + 30000; // Random interval between 30s to 90s
    const randomIncrement = Math.floor(Math.random() * 10) + 1; // Random increment between 1% to 10%
  
    setInterval(() => {
      updateTrashQuantity(id, randomIncrement);
    }, randomInterval);
  };
  
  // Start the process for all trash cans
  const startUpdatingAllTrash = async () => {
    try {
      const trashIds = await getAllTrashIds();
      trashIds.forEach(id => {
        startUpdatingTrash(id);
      });
    } catch (error) {
      console.error('Failed to start updating trash:', error);
    }
  };
  
  startUpdatingAllTrash();
  
  console.log('Trash quantity update script running...');