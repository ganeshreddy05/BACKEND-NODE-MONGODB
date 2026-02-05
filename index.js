import express from "express";
import demoRouter from './src/routes/demoRoute.js';
import userRouter from './src/routes/userRoute.js';
import connectDB from './src/config/mongoDB.js';
import bookRouter from "./src/routes/bookRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express();
app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials : true
    }
));
app.use(express.json());
app.use(cookieParser());

const PORT=3000;
 app.use("/demo",demoRouter)
app.use("/users",userRouter)
app.use("/books",bookRouter)


async function startingBackendApplication(){//this function is used because after connecting DB only the servee should start
    await connectDB();
    runningServer();
}

function runningServer(){
    app.listen(PORT,()=>{
    console.log("server is running ")
})

}
startingBackendApplication();