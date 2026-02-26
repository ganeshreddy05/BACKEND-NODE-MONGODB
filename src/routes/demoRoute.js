import express from "express"
import { createDemo, demoFunction, demoHealth } from "../controllers/demoController.js";
import { Router } from "express";

const demoRouter = Router();

demoRouter.get("/welcome",demoFunction);
demoRouter.get("/health",demoHealth);
demoRouter.post("/create",createDemo);

export default demoRouter;