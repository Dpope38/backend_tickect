import jwt from "jsonwebtoken";
import {envConfig} from "../libs/env.js"


const generateToken = (emailId, res) => {
  // Check if token is not defined

  const token = jwt.sign({ email: emailId }, envConfig.JWT_SECRET,
{
    expiresIn: envConfig.JWT_EXPIRATION,
  });
  res.cookie("ident", token, {
    httpOnly: true,
    secure: envConfig.NODE_ENV === "development" ? false : true, // Set to true in production
    sameSite: "Strict", // Adjust based on your requirements
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }); // Cookie expires in 1 day 

  return token;
};

export default generateToken;
