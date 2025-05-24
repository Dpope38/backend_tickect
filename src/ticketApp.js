import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors"
dotenv.config({ path: "../.env" });
import adminRoute from "./routes/adminRouter.js";
import agentRouter from "./routes/agentRoutes.js";
import clientTicketRouter from "./routes/clientRoute.js";
import authRouter from "./routes/loginRoute.js";
import globalErrorHandler from "../src/middleWare/globalErrorHandler.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/agent", agentRouter);
app.use("/api/v1/create-ticket", clientTicketRouter);
app.use("/api/v1/auth", authRouter);

// app.use("/{*splat}", (req, res, next) => {
//   console.log(`Middleware executed  ${req.method} ${req.url}`);
//   res.status(200).json({
//     status: "failed",
//     message: "not found",
//   });
// });

app.use(globalErrorHandler)
export default app;
