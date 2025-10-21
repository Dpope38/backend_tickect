import { PrismaClient } from "../../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";
import  generateToken  from "../utils/generateToken.js";
import AppError from "../utils/customError.js";

const prisma = new PrismaClient();

// /**
//  * @description Authenticate user
//  * @route POST /api/users/signup
//  * @access Private -Admin
//  */


/* Create a new user */

const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // 1️⃣ Check if all fields are provided
  if (!name || !email || !password || !role) {
    throw new AppError("Please provide all fields", 400);
  }

  // 2️⃣ Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
}

/* Login new user */

const loginUser = async (req, res) => {
  const  {email, password} = req.body;
  console.log("Login request body:", email);

  // 1️⃣ Check if email and password exist
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // 2️⃣ Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });


  if (!user) {
    throw new AppError("Invalid information provided", 401);
  }

  // 3️⃣ Check if password is correct
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    throw new AppError("Invalid Information provided", 401);
  }

  // 4️⃣ Generate JWT token
   generateToken(user.email, res);
  //
  
  //
  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
      name: user.fullname,
    },
  });
};

const logout = async (req, res)=>{
  res.cookie("ident", "",{maxAge:0})
  res.status(200).json({message:"logged out successfully"})
}
export {loginUser, logout}
