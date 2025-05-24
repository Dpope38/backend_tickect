import dotenv from "dotenv";
// import AppError from "../utils/customError.js";
dotenv.config({ path: "../../.env" });

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong!";
  console.log("Error from handler: ", err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
//
export default globalErrorHandler;
