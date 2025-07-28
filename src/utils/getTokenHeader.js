import AppError from "./customError.js";
const getTokenHeader = (req) => {
  let tokenHeader;
  //   const tokenHeader = token.headers.authorization.split(" ")[1];
  //   if (!tokenHeader) {
  //     throw new Error("Token not found");
  //   }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    
  ) {
    console.log("From get Token Header >>> ",req.headers)
    tokenHeader = req.headers.authorization.split(' ')[1];
  } else {
    throw new AppError("Token not found or invalid", 401);
  }
  return tokenHeader;
};
export default getTokenHeader;
