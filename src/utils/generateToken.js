import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const generateToken = (emailId) => {
  // Check if token is not defined

  return jwt.sign({ email: emailId }, process.env.JWT_SECRET,
{
    expiresIn: process.env.JWT_EXPIRATION, //this should be in .env file  ,
  });
};

export default generateToken;
