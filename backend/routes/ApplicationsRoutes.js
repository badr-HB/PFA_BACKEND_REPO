import express from  "express";
const Route = express.Router();
import { SendJoinResquest,JoinRequest,join_notification } from "../controllers/ApplicationControllers.js";
import { cookies } from "../middlewares/cookies.js";


Route.post('/application/:projectid/join-request',cookies,SendJoinResquest)
Route.post('/application/:joinid/handle-request',cookies,JoinRequest)
Route.get('/application/requests/:projectid',cookies,join_notification)

export default Route;