import express from "express";
import protectedRoute from "../middleWare/IsProtected.js";
import adminProtectedRoute from "../middleWare/adminProtectedRoute.js";
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
adminDepartmentReport

} from "../Controllers/admin-controllers/adminReportController.js";
import {getAllDepartments, createDepartment} from "../Controllers/admin-controllers/adminDepartment.js";


/*  */
const adminRouter = express.Router();
// adminRouter.use(protectedRoute, adminProtectedRoute ); // Apply both middlewares to all routes below

/* User Route */
adminRouter.route("/users", protectedRoute, adminProtectedRoute).get(getAllUsers).post(createUser);

adminRouter
  .route("/users/:emailId",protectedRoute, adminProtectedRoute)
  .get(getUserByEmail)
  .delete(deleteUserByEmail)
  .put(updateUserById);



/* Ticket route */
adminRouter.route("/tickets",protectedRoute, adminProtectedRoute).get(getAllTickets);
adminRouter
  .route("/tickets/:refCode",protectedRoute, adminProtectedRoute)
  .get(getTicketByRefCode)
  .put(updateSingleTicket);
// .delete(deleteUserByEmail)
// .put(updateUserById);


/**
 * Report routes
 * I still need to work on the reports and routes
 */
adminRouter.get("/reports",getSummaryReports)
adminRouter.get("/reports/agent-performance", getAgentPerformance);
adminRouter.get("/reports/client-activity", getClientActivitySummary);
adminRouter.get("/reports/department-report", adminDepartmentReport);

/* Department Routes */
adminRouter.route("/departments").get(getAllDepartments).post(protectedRoute, adminProtectedRoute, createDepartment);

export default adminRouter;
