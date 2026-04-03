import express from "express";
const Route = express.Router();
import { PostIdea,GetIdea, updateIdea } from "../controllers/IdeaControllers.js";
import { cookies } from "../middlewares/cookies.js";
import { validator,errorHandler } from "../middlewares/IdeaValidations.js";

Route.post('/create-project-post/:id',cookies,validator.Idea,errorHandler,PostIdea)
Route.get('/discover/:id',GetIdea)
Route.post('/create-project-post/:id/update/:ideaid',cookies,validator.updateIdea,errorHandler,updateIdea)

export default Route;