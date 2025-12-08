import {prisma} from "../../libs/prisma"

import * as z from "zod";


/**
 * @description Get all tickets
 * @route GET /api/v1/admin/tickets
 * @access Private -Admin
 * 
 *
 */


const getAllTickets = async (req, res) => {

// Query parameters for filtering
  const {status, title, priority} = req.query

  const querySchema = z.object({
    status: z.string().optional(),
    title: z.string().optional(),
    priority: z.string().optional(),
  });
const parseQuery = querySchema.parse({ status, title, priority });


 
  const getallTickets = await prisma.ticket.findMany({
where:{
  status: parseQuery.status ? parseQuery.status : undefined,
  title: parseQuery.title ? { contains: parseQuery.title, mode: 'insensitive' } : undefined,
  priority: parseQuery.priority ? parseQuery.priority : undefined,
},
    include:{
      client:{
        select: {
          name: true,
          email: true,
        },
      },
      assignedAgent: {
        select: {
          fullname: true,
          email: true,
        },
      },
    
    }
  });
  if (!getallTickets) {
    throw new Error("No tickets found");
  }
  res.status(200).json({
    success: true,
    data: getallTickets,
  });
};

/**
 * @description Get ticket by ID
 * @route GET /api/v1/admin/tickets/:id
 * @access Private -Admin
 */
const getTicketByRefCode = async (req, res) => {
  const { refCode } = req.params;

  const ticket = await prisma.ticket.findUnique({
    where: { referenceCode: refCode},
    include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        assignedAgent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
  });

  if (!ticket) {
    throw new Error("no ticket found");
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
};

/**
 * @description Update ticket status and assigned to agent by ID
 * @route PATCH /api/v1/admin/tickets/:id by
 * @access Private -Admin
 */
const updateSingleTicket = async (req, res) => {
  const { refCode } = req.params;
  const { status = "PENDING", agentEmail } = req.body;

  console.log("Request Body +++++:", status, agentEmail);
  if(!refCode){
    throw new Error("Reference code is required");}
    console.log("RefCode:", refCode, req.body);

    /* Check if ticket exist by filtering using RefCode...
    If it does not exist, throw an error
    If it exists, update the ticket with the provided status and assigned agent email
    If the ticket is not assigned to an agent and an agent email is provided, assign the agent to the ticket
    If the status is provided and is not "PENDING", update the ticket status
    Finally, return the updated ticket information
    */
   
    const ticket = await prisma.ticket.findUnique({
    where: { referenceCode: refCode }});

    console.log("Ticket found using refCode:", ticket);
    
    if(!ticket) {
      throw new Error("Ticket not found");
    }
    if (!status && !agentEmail) {
      throw new Error("At least one of status or agentEmail must be provided");
    }
    if(ticket.assignedAgentId && status === "PENDING") {
      return res.status(200).json({
        success: true,
        data: "Ticket already assigned to an agent",
      }); 
    }
 
     let  updatedTicket = await prisma.ticket.update({
      where:{ referenceCode: refCode },
      data: {
        assignedAgent:{
          connect:{
            email: agentEmail
          }
        }
      },
      select: {
        assignedAgent: {
          select: {
            fullname: true,
            email: true,
          },
        },
      }
    })


  console.log("Updated Ticket after assigning agent:", updatedTicket);

  const updateTicketStatus = async (status)=>{
    if(status && status !== "PENDING") {
  const updatedStatus = await prisma.ticket.update({
      where: { referenceCode: refCode },
      data: {
        status: status,
      },
      select: {
        status: true,
        assignedAgent: {
          select: {
            fullname: true,
            email: true,
          },
        },
      }
    });
  }else{
    return{status:"PENDING"}
  }
  return updatedStatus;
  }

  const statusUpdateResult = await updateTicketStatus(status);

  res.status(200).json({
    success: true,
    data: {
      updatedTicket,
      statusUpdateResult,
    },
  });
};



export { getAllTickets, getTicketByRefCode, updateSingleTicket }
