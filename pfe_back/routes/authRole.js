import express from "express";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { getPassword } from "../models/authModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const loginRole = async (req, res, role) => {
  try {
    const { email, password } = req.body;
    const result = await getPassword(email);

    if (!result) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }
    const user = result;

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    if (user.idRole !== role) {
      return res
        .status(403)
        .json({ status: 403, message: "Forbidden: Incorrect role" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        idRole: user.idRole,
      },
      process.env.JWT_PASSPHRASE || "KbPassword",
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const userPv = { ...user };
    delete userPv.password;
    req.user = userPv;
    res.status(200).json({ status: 200, message: "OK", data: userPv });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

router.post(
  "/loginClient",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    await loginRole(req, res, 3);
  }
);

router.post(
  "/loginDriver",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    await loginRole(req, res, 1);
  }
);

router.post(
  "/loginAdmin",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    await loginRole(req, res, 2);
  }
);

export default router;
