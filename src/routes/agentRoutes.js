import express from "express";
import {
  getProfile,
  getAssignedTickets,
  updateTicketStatus,
} from "../Controllers/agent-actions/agentController.js";

const agentRouter = express.Router();
agentRouter.route("/profile").get(getProfile);
agentRouter.route("/ticket").get(getAssignedTickets);
agentRouter.route("/ticket/:ticketId/status").patch(updateTicketStatus);
//
export default agentRouter;
