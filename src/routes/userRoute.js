import express from "express";
import {createUser, getUser, loginUser, logout} from "../controllers/userController.js"
const userRouter=express.Router();
import { validate } from "../middlewares/validate.js";
import { createUserSchema } from "../validators/user.Validator.js";
import { verifyAccessToken } from "../middlewares/auth.js";

userRouter.post("/register",validate(createUserSchema),createUser)
userRouter.post("/login",loginUser)
userRouter.get("/logout",verifyAccessToken,logout)
userRouter.get("/userDetails",getUser)


export default userRouter;
