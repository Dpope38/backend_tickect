import { PrismaClient } from "../../generated/prisma/client.js";
// import AppError from "../../utils/customError.js";
// import catchAsync from "../../utils/catchAsyncHandler.js";

const prisma = new PrismaClient();
/**
 * @description GET Profile
 * @route GET /api/v1/agents/profile
 * @access Private -agent
 */

const getProfile = async (req, res) => {
  const agentEmail = req.user.email; // assuming user ID is attached to request after auth

  const agent = await prisma.user.findUnique({
    where: { email: agentEmail },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!agent) {
    throw new Error("Agent not found");
  }
  //
  res.status(200).json({
    success: true,
    data: agent,
  });
};

/**
 * @description GET tickets assigned to agent
 * @route GET /api/v1/agents/ticket
 * @access Private -agent
 */

const getAssignedTickets = async (req, res) => {
  const agentEmail = req.user.id; // assuming user ID is attached to request after auth

  const tickets = await prisma.ticket.findMany({
    where: { assignedAgentId: agentEmail },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      referenceCode: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    data: tickets,
  });
};

/**
 * @description PATCH update ticket status
 * @route PATCH /api/v1/agents/tickets/:ticketId
 * @access Private -agent
 */
const updateTicketStatus = async (req, res) => {
  const { ticketId } = req.params; // Ensure the route uses ticketId
  const { status } = req.body;
  const agentId = req.user.email; // assuming user email is attached to request after auth

  const validStatuses = ["OPEN", "IN_PROGRESS", "CLOSED"];
  if (!validStatuses.includes(status)) {
    throw new AppError(
      `Invalid status ${validStatuses}! Status must be OPEN", "IN_PROGRESS", "CLOSED `,
      400
    );
  }

  //   // Check ticket exists and belongs to agent
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      assignedAgentId: agentId,
    },
  });

  if (!ticket) {
    throw new AppError("Ticket not found or not assigned to you", 404);
  }

  //   // Update status
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  res.status(200).json({
    success: true,
    message: "Ticket status updated",
    data: updatedTicket,
  });
};

export { getProfile, getAssignedTickets, updateTicketStatus };
