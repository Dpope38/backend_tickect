import {prisma} from "../../libs/prisma.js"

import bcrypt from "bcryptjs";
import AppError from "../../utils/customError.js "
import generateToken from "../../utils/generateToken.js"

/**
 * @description Get all users
 * @route GET /api/v1/admin
 * @access Private -Admin
 */

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  console.log(users);
  if (!users || users.length === 0) {
    throw new AppError("No users found", 404);
  }
  res.status(200).json({
    success: true,
    data: users,
  });
};

/*
 * @description Get user by Email
 * @route GET /api/v1/admin/:id
 * @access Private -Admin
 */

const getUserByEmail = async (req, res) => {
  const emailId = req.params.emailId;
  const user = await prisma.user.findUnique({
    where: { email: emailId },
    omit:{
      password: true, // Exclude password from the response
    }
  });
  console.log(user);
  if (!user) {
    throw new Error("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

/**
//  * @description Delete user by ID
//  * @route DELETE /api/v1/admin/:id
//  * @access Private -Admin
//  */
const deleteUserByEmail = async (req, res) => {
  const emailId = req.params.emailId;
  if (!emailId) {
    throw new AppError("Please provide user's email", 400);
  }

  const deletedUser = await prisma.user.delete({
    where: { email: emailId },
  });

   if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ){
    throw new AppError("User not found", 404);
    }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
};

/**
 * @description Update user by EMAIL
 * @route PATCH /api/v1/admin/:emailId
 * @access Private -Admin
 */
const updateUserById = async (req, res) => {
  const { emailId } = req.params;
  const { fullname, email, role } = req.body;
  if (!fullname || !email || !role) {
    throw new AppError("Please provide all required fields", 400);
  }

  const user = await prisma.user.update({
    where: { email: emailId },
    data: { fullname, email, role },
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
};

/**
 * @description Create a new user
 * @route POST /api/v1/admin
 * @access Private -Admin
 */
const createUser = async (req, res) => {
  const { fullname, email, password, role, deptName } = req.body;
  console.log(fullname, email, password, role, deptName);

  if (!fullname || !email || !password) {
    throw new AppError("Please provide all required fields", 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
  // Hash the password
  const generatedSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, generatedSalt);
  
  const findDepartment = await prisma.department.findUnique({
    where:{
       deptName
    }
  })
  console.log("Department found:", findDepartment);
 if (!findDepartment){
    throw new AppError("Department not found", 404);
 }

   const user = await prisma.user.create({
     data: { fullname, email, password: hashedPassword, role:role , department: {
        connect: {
          id: findDepartment.id,
        },
      }, },
      omit:{
        password: true, // Exclude password from the response
      },
      include:{
        department: {
          select:{
            id: true,
            deptName: true,
          }
        }, // Include department details in the response
      }

   });


   console.log(user)

   generateToken(user.email, res);

 // 
   res.status(201).json({
     success: true,
     message: "User created successfully",
     data: user,
   });
};

export {
  getAllUsers,
  getUserByEmail,
  deleteUserByEmail,
  updateUserById,
  createUser,
};
