import express from "express";
const Route = express.Router();
import { profile,getprofile,updateProfile } from "../controllers/UserControllers.js";
import { validator,errorHandler } from "../middlewares/UserValidations.js";
import { cookies } from "../middlewares/cookies.js";

Route.post('/profile/:id',cookies,validator.profile,errorHandler,profile)
Route.get('/profile/:id',getprofile)
Route.put('/profile/:id/update/:profileid',cookies,validator.updateprofile,errorHandler,updateProfile)

export default Route