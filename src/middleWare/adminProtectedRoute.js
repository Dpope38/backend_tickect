// middlewares/verifyAdmin.js
import jwt from "jsonwebtoken";
import {envConfig} from "../libs/env.js";
import {prisma} from "../libs/prisma.ts"


const adminProtectedRoute =async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies?.ident;
    console.log("Admin token:", token);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify the token
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    const user = await prisma.user.findUnique({where:{email:decoded.email}})
    console.log("Decoded token:", user);

    /* Check user existence */
    if(!user) return res.status(401).json({ message: "Not authorized, no token" })
    /* Check if user is admin */
    if(user.role !== "ADMIN"){
      return res.status(403).json({ message: "Forbidden. Admin access only." });
    }


    // 4️⃣ Attach user to request for downstream handlers
    req.user = user;

    // 5️⃣ Continue to the next middleware/handler
    next();

  } catch (error) {
    console.error("Admin verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default adminProtectedRoute;