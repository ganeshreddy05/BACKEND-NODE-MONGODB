import express from "express";
import {createUser, getMyProfile, getUser, getUserById, loginUser, logout, refreshAccessToken} from "../controllers/userController.js"
const userRouter=express.Router();
import { validate } from "../middlewares/validate.js";
import { createUserSchema } from "../validators/user.Validator.js";
import { verifyAccessToken } from "../middlewares/auth.js";

userRouter.post("/register",validate(createUserSchema),createUser)
userRouter.post("/login",loginUser)
userRouter.get("/logout",verifyAccessToken,logout)
userRouter.get("/userDetails",getUser)
userRouter.get("/auth/refresh",refreshAccessToken)
userRouter.get("/me",verifyAccessToken,getMyProfile)
userRouter.get("/:id",getUserById);

export default userRouter;
