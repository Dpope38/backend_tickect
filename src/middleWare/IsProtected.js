import jwt from "jsonwebtoken";
import { envConfig } from "../libs/env.js";
import {prisma} from "../libs/prisma.ts"
import AppError from "../utils/customError.js";


  
const protectedRoute = async (req, res, next) => {
  const token = req.cookies?.ident;
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    if(!decoded) return res.status(401).json({ message: "Not authorized, no token" })
    const user = await prisma.user.findUnique({
where:{email:decoded.email}})
console.log("Decoded token user:", user);

req.user = user;

next();
}catch(error){
    console.log(error);
    return res.status(500).json({ message: "internal error" });
}}

export default protectedRoute