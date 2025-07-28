import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

/**
 * @description Get all tickets
 * @route GET /api/v1/admin/tickets
 * @access Private -Admin
 */

const getAllTickets = async (req, res) => {
  const getallTickets = await prisma.ticket.findMany({

    include:{
      client:{
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
    
    }
  });
  console.log(getallTickets);
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
  console.log("Ticket ID:", refCode);

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
  const { status, agentEmail } = req.body;
  if(!refCode){
    throw new Error("Reference code is required");}
    console.log("RefCode:", refCode, status, agentEmail);

    /* Check if ticket exist by filtering using RefCode...
    If it does not exist, throw an error
    If it exists, update the ticket with the provided status and assigned agent email
    If the ticket is not assigned to an agent and an agent email is provided, assign the agent to the ticket
    If the status is provided and is not "PENDING", update the ticket status
    Finally, return the updated ticket information
    */
   
    const ticket = await prisma.ticket.findUnique({
    where: { referenceCode: refCode }});

    console.log(ticket);
    
    if(!ticket) {
      throw new Error("Ticket not found");
    }
    let updatedTicket;

    // if(!ticket.assignedAgentId && agentEmail) {
    const agent = await prisma.user.findUnique({
    where: { email: agentEmail }});
    updatedTicket = await prisma.ticket.update({
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
            name: true,
            email: true,
          },
        },
      }
    })
  // }
  if(status && status !== "PENDING") {
    updatedTicket = await prisma.ticket.update({
      where: { referenceCode: refCode },
      data: {
        status: status,
      },
      select: {
        status: true,
        assignedAgent: {
          select: {
            name: true,
            email: true,
          },
        },
      }
    });
  }
    
    
    
    console.log(updatedTicket)
    res.status(200).json({
      success: true,
      data: updatedTicket,

    })
  }
  



export { getAllTickets, getTicketByRefCode, updateSingleTicket }
