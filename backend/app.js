import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoute from "./routes/AuthRoutes.js";
import userRoute from "./routes/UserRoutes.js";
import ideaRoute from "./routes/IdeaRoutes.js";
import moderationRoute from './routes/ApplicationsRoutes.js'
import cookieParser from "cookie-parser";
config()
const PORT = `${process.env.PORT}`
const app = express();

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)
app.use('/api/project',ideaRoute)
app.use('/api/moderation',moderationRoute)




app.listen(PORT,() => {
    console.log(`server is running ${PORT}`);
})