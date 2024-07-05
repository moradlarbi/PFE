// routes/index.js
const express = require('express');
const router = express.Router();

const modeleCamionRoutes = require('./modeleCamion');
const camionRoutes = require('./camion');
const userRoutes = require('./user')
const modeleTrashRoutes = require('./modeleTrash')
const regionRoutes = require("./region")
const depotRoutes = require("./depot")
const trashRoutes = require("./trash")
const coordonneesRoutes = require("./coordonnees")
const paramsRoutes = require("./params")
router.use('/modeleCamion', modeleCamionRoutes);
router.use('/camion', camionRoutes);
router.use('/modeleTrash', modeleTrashRoutes);
router.use("/region", regionRoutes)
router.use("/depot", depotRoutes)
router.use("/trash", trashRoutes)
router.use("/coordonnees", coordonneesRoutes)
router.use("/user", userRoutes)
router.use("/params", paramsRoutes)

module.exports = router;
