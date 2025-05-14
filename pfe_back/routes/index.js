import express from 'express';

const router = express.Router();

// Import route modules
import modeleCamionRoutes from './modeleCamion.js';
import camionRoutes from './camion.js';
import userRoutes from './user.js';
import modeleTrashRoutes from './modeleTrash.js';
import regionRoutes from './region.js';
import depotRoutes from './depot.js';
import trashRoutes from './trash.js';
import coordonneesRoutes from './coordonnees.js';
import paramsRoutes from './params.js';
import authRoutes from './auth.js';
import contactRoutes from './contact.js';

router.use('/modeleCamion', modeleCamionRoutes);
router.use('/camion', camionRoutes);
router.use('/modeleTrash', modeleTrashRoutes);
router.use("/region", regionRoutes)
router.use("/depot", depotRoutes)
router.use("/trash", trashRoutes)
router.use("/coordonnees", coordonneesRoutes)
router.use("/user", userRoutes)
router.use("/params", paramsRoutes)
router.use("/auth", authRoutes)
router.use("/contact", contactRoutes)
export default router;
