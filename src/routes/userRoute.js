import express from "express";
import {createUser, getUser, loginUser} from "../controllers/userController.js"
const userRouter=express.Router();
import { validate } from "../middlewares/validate.js";
import { createUserSchema } from "../validators/user.Validator.js";

userRouter.post("/register",validate(createUserSchema),createUser)
userRouter.post("/login",loginUser)
userRouter.get("/userDetails",getUser)


export default userRouter;
