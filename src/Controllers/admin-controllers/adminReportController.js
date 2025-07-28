import { PrismaClient } from "../../generated/prisma/client.js";
import AppError from "../../utils/customError.js";

/**
 * @description Get all reports
 * @route GET /api/v1/admin/reports
 * @access Private -Admin
 */

const prisma = new PrismaClient();
let cachedReport = null;
let lastUpdated = null;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const generateSummaryReport = async () => {
  const [result] = await prisma.$queryRaw`
    SELECT
      COUNT(*) AS "totalTickets",
      SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) AS "openTickets",
      SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) AS "closedTickets",
      SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS "inProgressTickets",
      SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS "resolvedTickets",
      SUM(CASE WHEN priority = 'HIGH' THEN 1 ELSE 0 END) AS "highPriorityTickets"
    FROM "Ticket"
  `;
  if (!result) {
    throw new AppError("No tickets found", 404);
  }
  return {
    totalTickets: Number(result.totalTickets),
    openTickets: Number(result.openTickets),
    closedTickets: Number(result.closedTickets),
    inProgressTickets: Number(result.inProgressTickets),
    resolvedTickets: Number(result.resolvedTickets),
    
    highPriorityTickets: Number(result.highPriorityTickets),
  };
};

/**
 * Get summary reports
 * @route GET /api/v1/admin/reports/summary
 * @access Private -Admin
 */

const getSummaryReports = async (_req, res) => {
  const now = Date.now();

  // Check if cache is valid
  if (!cachedReport || now - lastUpdated > REFRESH_INTERVAL_MS) {
    cachedReport = await generateSummaryReport();
    lastUpdated = now;
  }

  res.status(200).json({
    success: true,
    data: cachedReport,
    lastUpdated: new Date(lastUpdated).toISOString(),
  });
};

const getAgentPerformance = async (_req, res) => {
  const agentPerformance = await prisma.user.findMany({
    where: { role: "AGENT" },
    select: {
      id: true,
      name: true,
      tickets: {
        select: {
          id: true,
          status: true,
          referenceCode:true,
          title:true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  console.log(agentPerformance);
  res.status(200).json({
    success: true,
    data: agentPerformance,
  });
};

const getClientActivitySummary = async (_req, res) => {
  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      tickets: {
        select: {
          status: true,
          referenceCode:true,
          title:true
        },
      },
    },
  });
  if (!clients || clients.length === 0) {
    throw new AppError("No clients found", 404);
  }
  // Build summary per client
  const summary = clients.map((client) => {
    const totalTickets = client.tickets.length;
    const statusCounts = client.tickets.reduce(
      (acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      },
      { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 }
    );

    return {
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      totalTickets,
      openTickets: statusCounts.OPEN,
      inProgressTickets: statusCounts.IN_PROGRESS,
      closedTickets: statusCounts.CLOSED,
    };
  });

  res.status(200).json({
    success: true,
    data: { summary },
  });
};
//
export { getSummaryReports, getAgentPerformance, getClientActivitySummary };
