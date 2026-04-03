import express from "express";
import { register,Login,resetpassword,forgetpassword,ResetForgottenPassword,Logout,DoubleAuthenticationenable,loginWith2FA } from "../controllers/AuthControllers.js";
import { validate,errorHandler } from "../middlewares/AuthValidations.js";
import { cookies } from "../middlewares/cookies.js";
import { Token } from "../middlewares/verifyToken.js";

const Route = express.Router();

Route.post('/register',validate.register,errorHandler,register)
Route.post('/login',validate.Login,errorHandler,Login)
Route.put('/resetpassword/:id',validate.Reset,errorHandler,resetpassword)
Route.post('/forgetpassword/:id',cookies,validate.forgetpassword,errorHandler,forgetpassword)
Route.put('/reset-forgotten-password/:token',Token,validate.ResetForgottenPassword,errorHandler,ResetForgottenPassword)
Route.post('/logout',Logout)
Route.post('/enable-2fa/:id',DoubleAuthenticationenable)
Route.post('/login-2fa/:id',loginWith2FA)





export default Route;