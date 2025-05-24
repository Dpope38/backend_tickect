import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

/**
 * @description Get all tickets
 * @route GET /api/v1/admin/tickets
 * @access Private -Admin
 */

const getAllTickets = async (req, res) => {
  const getallTickets = await prisma.ticket.findMany();
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
    where: { referenceCode: refCode },
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
  const { refCode } = req.params; // Ticket ID from URL
  const { status, userAgentId } = req.body; // New status and agent assignment
  console.log("Ticket ID:", refCode);
  console.log(`Status:${status} and ${userAgentId}`);

  if (!status || !userAgentId) {
    throw new Error("Please provide status and userAgentId");
  }

  // Fetch the ticket
  const ticket = await prisma.ticket.findUnique({
    where: { referenceCode: refCode },
  });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // If no agent is assigned, assign it
  let updatedTicket;
  if (!ticket.userAgentId && userAgentId) {
    updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status,
        assignedAgentId: userAgentId,
      },
    });
  } else {
    // Only update the status if agent is already assigned
    updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  res.status(201).json({
    status: "success",
    message: "Ticket updated successfully",
    data: { updatedTicket },
  });
};

export { getAllTickets, getTicketByRefCode, updateSingleTicket };
