import express from "express";
import {
    createItem,
    getAllItems,
    getCategories,
    getItemById,
    updateItem,
    deleteItem,
    getFreshness,
    getCountdown,
    getExpiringSoon,
    getExpiredItems,
    getAnalytics,
    getSuggestions,
} from "../controllers/itemController.js";
import { verifyAccessToken } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createItemSchema } from "../validators/item.Validator.js";

const itemRouter = express.Router();

//NOTE: static routes MUST come before /:id routes
//otherwise express will treat "expiring-soon" as an id parameter

//special routes (these come FIRST)
itemRouter.get("/expiring-soon", verifyAccessToken, getExpiringSoon);
itemRouter.get("/expired", verifyAccessToken, getExpiredItems);
itemRouter.get("/analytics", verifyAccessToken, getAnalytics);
itemRouter.get("/suggestions", verifyAccessToken, getSuggestions);
itemRouter.get("/categories", verifyAccessToken, getCategories);

//CRUD routes
itemRouter.post("/", verifyAccessToken, validate(createItemSchema), createItem);
itemRouter.get("/", verifyAccessToken, getAllItems);
itemRouter.get("/:id", verifyAccessToken, getItemById);
itemRouter.put("/:id", verifyAccessToken, validate(createItemSchema), updateItem);
itemRouter.delete("/:id", verifyAccessToken, deleteItem);

//per-item special routes
itemRouter.get("/:id/freshness", verifyAccessToken, getFreshness);
itemRouter.get("/:id/countdown", verifyAccessToken, getCountdown);

export default itemRouter;
