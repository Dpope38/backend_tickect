import express from "express";
import createClient from "../Controllers/clients-controller/clientController.js";

const clientTicketRouter = express.Router();
clientTicketRouter.post("/", createClient);

export default clientTicketRouter;
