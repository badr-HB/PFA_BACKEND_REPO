import express from  "express";
const Route = express.Router();
import { SendJoinResquest,JoinRequest,join_notification,report,report_notification,handle_report,handle_report_delete } from "../controllers/ApplicationControllers.js";
import { validate,errorHandler } from "../middlewares/ApplicationValidations.js";
import { cookies } from "../middlewares/cookies.js";


Route.post('/application/:projectid/join-request',cookies,SendJoinResquest)
Route.post('/application/:joinid/handle-request',cookies,JoinRequest)
Route.get('/application/requests/:projectid',cookies,join_notification)
Route.post('/application/:targetid/report/:projectid',cookies,validate.report,errorHandler,report)
Route.get('/application/reportnotification',cookies,report_notification)
Route.delete('/application/report/handle/:reportid/delete-member',cookies,handle_report_delete)
Route.get('/application/report/handle/:reportid/',cookies,handle_report)
export default Route;