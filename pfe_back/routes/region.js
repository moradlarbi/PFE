import express from 'express';
import {
  getAll,
  getById,
  getRegions,
  create,
  update,
  deleteRegion,
  updateActiveStatus
} from '../models/region.js';
import { getByRegion} from "../models/trash.js"
import db from "../db.js"
import axios from 'axios';
import { polygon, randomPoint, booleanPointInPolygon, bbox } from '@turf/turf'
const router = express.Router();
async function fetchTrashModels() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM ModeleTrash", (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}
async function getRegionsCapacity() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT R.id, COALESCE(SUM(tr.volume), 0) AS capacity
FROM Region R
LEFT JOIN (
    SELECT t.idRegion, m.volume
    FROM Trash t
    LEFT JOIN ModeleTrash m ON t.idModele = m.id
) AS tr ON R.id = tr.idRegion
GROUP BY R.id;`, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

export function generatePointsInsideRegion(regionCoordinates, existingPoints, totalPoints) {
  const p = polygon([
    [...regionCoordinates.map(coord => [coord.longitude, coord.latitude]), 
    [regionCoordinates[0].longitude, regionCoordinates[0].latitude]] // on ferme le polygone
  ]);

  const newPoints = [...existingPoints];

  while (newPoints.length < totalPoints + existingPoints.length) {
    const random = randomPoint(1, { bbox: bbox(p) }).features[0];

    if (booleanPointInPolygon(random, p)) {
      newPoints.push({
        longitude: random.geometry.coordinates[0],
        latitude: random.geometry.coordinates[1]
      });
    }
  }

  return newPoints.slice(existingPoints.length);
}
router.get('/predict_all', async (req, res) => {
  try {
    //console.log("Début de la prédiction...");
    
    getRegions(async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erreur de récupération des régions" });
      }

      if (!results.length) {
        return res.status(404).json({ error: "Aucune région trouvée" });
      }

      const inputData = results.map(region => ({
        iso3c: "DZA",
        region_id: "AFR",
        income_id: "LMC",
        composition_food_organic_waste_percent: region.composition_food_organic_waste_percent || null,
        composition_glass_percent: region.composition_glass_percent || null,
        composition_metal_percent: region.composition_metal_percent || null,
        composition_other_percent: region.composition_other_percent || null,
        composition_paper_cardboard_percent: region.composition_paper_cardboard_percent || null,
        composition_plastic_percent: region.composition_plastic_percent || null,
        institutional_framework_department_dedicated_to_solid_waste_management_na: "Yes",
        legal_framework_long_term_integrated_solid_waste_master_plan_na: "Yes",
        legal_framework_solid_waste_management_rules_and_regulations_na: "Yes",
        population_population_number_of_people: region.population || 0,
        primary_collection_mode_form_of_primary_collection_na: "Yes",
        separation_existence_of_source_separation_na: "Yes"
      }));

      // Appel à l'API Flask
      const response = await axios.post('http://127.0.0.1:5001/predict', inputData);
      console.log("Réponse du modèle Flask reçue.");

      // Récupération des prédictions
      const predictions = response.data.predictions.map((pred, index) => ({
        region_id: results[index].id,
        predicted_waste_tons_per_year: pred,
        name: results[index].nom,
        population: results[index].population
      }));

      // // Récupération des modèles de dépotoirs
      const trashModels = await fetchTrashModels()
      const sortedModels = trashModels.sort((a, b) => b.volume - a.volume);
      const dataCapacity = await getRegionsCapacity()
      const regionsCapacity = Object.fromEntries(
        dataCapacity.map(row => [row.id, row.capacity])
      );
      //console.log(regionsCapacity)
      // Définir la fréquence de collecte (par défaut quotidienne)
      const collectionFrequency = 1;

      // Calcul des suggestions de dépotoirs
      const suggestions = predictions.map((region, index) => {
        const periodTonnage = region.predicted_waste_tons_per_year * 100 / (365 / collectionFrequency);
        let needed = periodTonnage - regionsCapacity[region.region_id];
        //console.log("needed:", needed, "region:", region.region_id, index, "capacity:", regionsCapacity[region.region_id]);
    
        const selectedModels = [];
    
        while (needed > 0) {
            let bestFitModel = null;
    
            for (let model of sortedModels) {
                if (model.volume <= needed) {
                    bestFitModel = model;
                    break; // On prend le premier modèle assez petit pour ne pas gaspiller d'espace
                }
            }
    
            if (!bestFitModel) {
                // Si aucun modèle n'est trouvé (trop petit), on prend le plus petit disponible
                bestFitModel = sortedModels[sortedModels.length - 1];
            }
    
            const numModelsRequired = Math.floor(needed / bestFitModel.volume) || 1;
            selectedModels.push({ 
                modelId: bestFitModel.id, 
                modelName: bestFitModel.name, 
                numberOfModels: numModelsRequired 
            });
    
            needed -= numModelsRequired * bestFitModel.volume;
        }
    
        return {
            regionId: region.region_id,
            regionName: region.name,
            population: region.population,
            collectionFrequency,
            predictedWasteTonsPerYear: region.predicted_waste_tons_per_year,
            suggestions: selectedModels
        };
    });

      res.json(suggestions.filter(suggestion => suggestion.suggestions.length > 0));
    });

  } catch (error) {
    console.error("Erreur dans predict_all :", error);
    res.status(500).json({ error: "Erreur lors de la prédiction", details: error.message });
  }
});

router.post('/add_suggest', (req, res) => {
  console.log(req.body)
  //fetch region cordinates

  const { regionId, suggestions } = req.body;
  getById(regionId, (err, results) => {
  if (err) {
    console.error('Database error:', err);
    res.status(500).send(err);
  } else if (results.length === 0) {
    res.status(404).send({ message: 'Region not found' });
  } else {
    const regionInfo = {
      id: results[0].id,
      nom: results[0].nom,
      depotLongitude: results[0].depotLongitude,
      depotLatitude: results[0].depotLatitude,
      active: results[0].active,
      coordinates: results
        .filter(row => row.longitude !== null && row.latitude !== null)
        .map(row => ({
          longitude: row.longitude,
          latitude: row.latitude
        }))
    };
    getByRegion(regionId, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send(err);
    } 
    else {
      const existingPoints = results.map(row => ({
        longitude: row.longitude,
        latitude: row.latitude
      }));
      console.log("existingPoints", existingPoints)
      const totalPoints = suggestions.reduce((sum, suggestion) => sum + suggestion.numberOfModels, 0);

      const newPoints = generatePointsInsideRegion(regionInfo.coordinates, existingPoints, totalPoints);
      console.log("newPoints", newPoints)
      // Insert the new points into the database
      const insertQuery = `
        INSERT INTO Trash (idModele, idRegion, longitude, latitude, quantity, utilisable)
        VALUES ?
      `;
      const values = [];
      let k = 0;
      for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        for (let j = 0; j < suggestion.numberOfModels; j++) {
          values.push([suggestion.modelId, regionId, newPoints[k].latitude, newPoints[k].longitude, 0, 1]);
          k++;
        }
      }
      db.query(insertQuery, [values], (err) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).send(err);
        } else {
          res.status(201).json({ message: 'Suggestions added successfully' });
        }
      });
    }
    });
    
  }
});


});
// Get all Regions
router.get('/', (req, res) => {
  getAll((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const regions = {};
      results.forEach(row => {
        if (!regions[row.id]) {
          regions[row.id] = {
            id: row.id,
            nom: row.nom,
            population: row.population,
            active: row.active,
            depotLatitude: row.depotLatitude,
            depotLongitude: row.depotLongitude,
            coordinates: []
          };
        }
        if (row.longitude !== null && row.latitude !== null) {
          regions[row.id].coordinates.push({
            longitude: row.longitude,
            latitude: row.latitude
          });
        }
      });

      res.json(Object.values(regions));
    }
  });
});


// Get a single Region by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  getById(id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new Region
router.post('/', (req, res) => {
  const { nom, population, coordinates, depotLongitude, depotLatitude } = req.body;
  console.log(req.body)
  // Check if the required fields are provided
  if (!nom || population === undefined || !coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: 'Missing required fields or invalid data.' });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Insert the region
    const createRegionQuery = 'INSERT INTO Region (nom, population,depotLongitude, depotLatitude) VALUES (?, ?,?,?)';
    db.query(createRegionQuery, [nom, population,depotLongitude, depotLatitude], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send(err);
        });
      }

      const regionId = results.insertId;

      // Prepare to insert coordinates
      const createCoordonneesQuery = `
        INSERT INTO Coordonnees (longitude, latitude, idRegion)
        VALUES ?
      `;
      const coordinatesValues = coordinates.map(([longitude, latitude]) => [longitude, latitude, regionId]);

      // Insert the coordinates
      db.query(createCoordonneesQuery, [coordinatesValues], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send(err);
          });
        }

        // Commit the transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send(err);
            });
          }

          res.status(201).json({ id: regionId, nom, population });
        });
      });
    });
  });
});

router.put('/active/:id', async (req, res) => {
  const id = req.params.id;
  const { active } = req.body;
  console.log(active,id)

  try {
    await new Promise((resolve, reject) => {
      updateActiveStatus(id, active, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    res.status(200).json({ message: 'User active status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update an existing Region
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nom, population, active } = req.body;
  update(id, nom, population, active, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a Region
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  deleteRegion(id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

export default router;
