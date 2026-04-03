import express from  "express";
const Route = express.Router();
import { SendJoinResquest } from "../controllers/ApplicationControllers.js";
import { cookies } from "../middlewares/cookies.js";


Route.post('/application/:projectid',cookies,SendJoinResquest)


export default Route;