import express from "express";
import isLogin from "../middleWare/isLogin.js";
import {
  getAllUsers,
  getUserByEmail,
  deleteUserByEmail,
  updateUserById,
  createUser,
} from "../Controllers/admin-controllers/adminUserControllers.js";
import {
  getAllTickets,
  getTicketByRefCode,
  updateSingleTicket,
} from "../Controllers/admin-controllers/adminTicketController.js";

import {
  getSummaryReports,
  getAgentPerformance,
  getClientActivitySummary,
} from "../Controllers/admin-controllers/adminReportController.js";



const adminRouter = express.Router();
adminRouter.use(isLogin);
adminRouter.route("/users").get(getAllUsers).post(createUser);

adminRouter
  .route("/users/:emailId")
  .get(getUserByEmail)
  .delete(deleteUserByEmail)
  .put(updateUserById);

adminRouter.route("/tickets").get(getAllTickets);
adminRouter
  .route("/tickets/:refCode")
  .get(getTicketByRefCode)
  .put(updateSingleTicket);
// .delete(deleteUserByEmail)
// .put(updateUserById);


/**
 * I still need to work on the reports and routes
 */
adminRouter.get("/reports",getSummaryReports)
adminRouter.get("/reports/agent-performance", getAgentPerformance);
adminRouter.get("/reports/client-activity", getClientActivitySummary);

export default adminRouter;
