import dotenv from "dotenv";
dotenv.config();
import express from "express";
import demoRouter from './src/routes/demoRoute.js';
import userRouter from './src/routes/userRoute.js';
import connectDB from './src/config/mongoDB.js';
import bookRouter from "./src/routes/bookRoute.js";
import itemRouter from "./src/routes/itemRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173","http://localhost:5174","https://backend-project-frontend-jade.vercel.app"],

        credentials: true
    }
));
app.use(morgan("dev"))
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;
app.use("/demo", demoRouter)
app.use("/users", userRouter)
app.use("/books", bookRouter)
app.use("/items", itemRouter)


async function startingBackendApplication() {//this function is used because after connecting DB only the servee should start
    await connectDB();
    runningServer();
}

function runningServer() {
    app.listen(PORT, () => {
        console.log("server is running ")
    })

}
startingBackendApplication();