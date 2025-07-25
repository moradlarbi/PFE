import jwt from "jsonwebtoken";
import { getPassword } from "../models/authModels.js"; 

async function isUserMidd(req, res, next) {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: 401, message: "Unauthorized1" });
    }

    const decoded = jwt.verify(token, process.env.JWT_PASSPHRASE || "KbPassword");
    const result = await getPassword(decoded.email);
    if (!result || result.length === 0) {
      return res.status(401).json({ status: 401, message: "Unauthorized2" });
    }
    const user = result; 

    // Suppression du mot de passe de l'objet utilisateur avant de le stocker dans req.user
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("not authorized 3");
  }
}

export default isUserMidd;
