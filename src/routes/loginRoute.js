import express from 'express';
import { loginUser, logout} from '../Controllers/authController.js';
import isProtected from "../middleWare/IsProtected.js";

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/logout', logout);
authRouter.get("/auth-check",isProtected, (req, res)=>{
res.json({ok:true})
});

export default authRouter;
