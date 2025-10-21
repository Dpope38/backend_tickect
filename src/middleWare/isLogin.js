import getTokenHeader from "../utils/getTokenHeader.js";
import verifyToken from "../utils//verifyToken.js";
import AppError from "../utils/customError.js";

const isLogin =async (req, res, next) => {
  const token = getTokenHeader(req);
  console.log("from isLogin...token req", token);
  const decodedUser = await verifyToken(token);
  console.log(`from isLogin...${decodedUser}`);
  if (!decodedUser) {
    throw new AppError("You are not logged in", 401);
  }
  console.log("Decoded user:", decodedUser);
  req.user = decodedUser;
  next();
};
export default isLogin;

/* @description authenticate user
 * @route POST /api/v1/auth/login
 * @access Public
 */

const login = async (res, next) => {
  
}
