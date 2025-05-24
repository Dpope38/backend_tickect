import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";
import AppError from "./customError.js";
import { clear } from "console";
dotenv.config({ path: "../../.env" });

const verifyTokenHeader = async (token) => {
  try{
    
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decoded;
  console.log("decoded from verify token header", decoded);
  }catch (error) {

  
  if (!token) {
    throw new AppError("No token provided", 401);
  }

  if (error.name === "JsonWebTokenError") {
    throw new AppError(`Invalid token >>${error}`, 404);
  }
  if (error.name === "TokenExpiredError") {
    throw new AppError("Token expired");
  }}
};
export default verifyTokenHeader;