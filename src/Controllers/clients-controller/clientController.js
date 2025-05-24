import { PrismaClient } from "../../generated/prisma/client.js";
import crypto from "crypto";
// import catchAsync from "../../utils/catchAsyncHandler.js";
// import AppError from "../../utils/customError.js";

const prisma = new PrismaClient();
/**
 * @description POST CREATE CLIENT
 * @route GET /api/v1/client
 * @access Public
 */

const createClient = async (req, res) => {
  const { name, email, description } = req.body;

  //   // validate Input
  if (!name || !email || !description) {
    throw new Error("PProvide necessary fields");
  }

  const referenceCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      referenceCode,
      priority: priority || "LOW",
      clientId: client.id,
    },
  });
  //
  res.status(201).json({
    success: true,
    data: client,
  });
};

export default createClient;
