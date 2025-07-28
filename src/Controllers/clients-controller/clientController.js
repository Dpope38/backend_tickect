import { PrismaClient, Prisma } from "../../generated/prisma/client.js";
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
  const { name, email, description, title , priority} = req.body;
  console.log(priority)

  //   // validate Input
  if (!name || !email || !description) {
    throw new Error("PProvide necessary fields");
  }

  const referenceCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  const ticket = await prisma.client.create({
    data:{
      name,
      email,
      tickets:{
        create:[
          {
             title,
      description,
      referenceCode,
      priority: priority || Prisma.TicketPriority.LOW,
     }
        ]
      }
    },
    include:{
      tickets: true
    }
  });

  console.log(ticket)
  //
  res.status(201).json({
    success: true,
    data: ticket,
  });
};

export default createClient;