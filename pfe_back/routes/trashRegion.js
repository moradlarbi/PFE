import express from "express";
import { getTrashWithRegionName } from "../models/trashRegion.js";

const router = express.Router();
router.get("/", (req, res) => {
  getTrashWithRegionName((err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

export default router;
