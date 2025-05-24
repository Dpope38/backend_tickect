import express from 'express';
import { loginUser } from '../Controllers/authController.js';
import isLogin from "../middleWare/isLogin.js";

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.get("/auth-check",isLogin, (req, res)=>{
res.json({ok:true})
});

export default authRouter;
