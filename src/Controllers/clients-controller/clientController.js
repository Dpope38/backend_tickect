import { PrismaClient, Prisma } from "../../generated/prisma/client.js";
import crypto from "crypto";
import {getIoInstance}from "../../socket/events/adminEvents.js"
// import catchAsync from "../../utils/catchAsyncHandler.js";
// import AppError from "../../utils/customError.js";

const prisma = new PrismaClient();
/**
 * @description POST CREATE CLIENT
 * @route GET /api/v1/client
 * @access Public
 */

const createClient = async (req, res) => {
  console.log(req.body);
    const { name, description, title ,email, priority,deptName} = req.body;
  console.log(priority, deptName);   
const io = getIoInstance();
  //   // validate Input
  if (!name || !title || !description || !email || !deptName) {
    throw new Error("Provide necessary fields");
  }

  const referenceCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  const findDepartment = await prisma.department.findUnique({
    where:{
       deptName
    }
  })

  if(!findDepartment){
    throw new Error("Department not found")
  }
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
      department : {
        connect:{
          id: findDepartment.id
        }
      },
     
     },
     

         ]
       }
     },
     include:{
       tickets: true
    
      
    },
  
  }
  );

   console.log(ticket)
   io.of("/admin").to("admin").emit("ticket-created", ticket);
  

  
  //
  res.status(201).json({
    success: true,
    data: ticket,
  });
};



export default createClient;