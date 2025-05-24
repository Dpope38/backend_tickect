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

  console.log("User found:", user);

  if (!user) {
    throw new AppError("Invalid information provided", 401);
  }

  // 3️⃣ Check if password is correct
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    throw AppError("Invalid Information provided", 401);
  }
  console.log("User found:", isCorrect);

  // 4️⃣ Generate JWT token
  const token = generateToken(user.email);
  //
  // 5️⃣ Send token in cookie (optional) + response
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  //
  res.status(200).json({
    status: "success",
    token,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
};
export {loginUser} 