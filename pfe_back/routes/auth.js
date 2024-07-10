import express from 'express';

const router = express.Router();
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { getPassword, getUserByEmail ,createUser, getUser } from "../models/authModels.js";
import jwt from "jsonwebtoken";
import isUserMidd from "../middlewares/authentification.js";
import bcrypt from "bcrypt";


router.post(
  "/signup",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  ),
  async (req, res) => {
    try {
      console.log(req.body)
      const { username, email, password, firstName, lastName, sexe, numPermis, idRole } = req.body;

      // Check if user already exists with the given email
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ status: 400, message: "Email already exists" });
      }


      console.log(req.body)

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in the database
      const newUser = await createUser({
        email,
        password: hashedPassword,
        username,
        first_name: firstName, last_name: lastName, sexe, 
        numPermis: numPermis,
        idRole,
        date_begin: dateBegin?? new Date()
      });

      res.status(201).json({ status: 201, message: "User created successfully", data: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);



router.post(
  "/login",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    try {
      const { email , password } = req.body;
      console.log(email)
      console.log(password)
      const result = await getPassword(email);
      
      if (!result) {
        return res.status(401).json({ status: 401, message: "Unauthorized1" });
      }
      const user = result;

      console.log(user.password)

      const pass = req.body.password;

      console.log(pass)

      const isPasswordCorrect = bcrypt.compareSync(pass, user.password);
        if (!isPasswordCorrect) {
          return res
            .status(401)
            .json({ status: 401, message: "Unauthorized2" });
        }
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_PASSPHRASE ? process.env.JWT_PASSPHRASE : "KbPassword",
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      
        var userPv = user;
        delete userPv.password;
        req.user = userPv;
        res.status(200).json({ status: 200, message: "OK", data: userPv });
      
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  }
);

router.get("/isAuthenticated", isUserMidd, async (req, res) => {
  res.status(200).json({ status: 200, message: "OK", data: req.user });
});

router.get("/logout", (_req, res) => {
  try {
    console.log("logout");
    res.clearCookie("token");
    res.status(200).json({ status: 200, message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

export default router;