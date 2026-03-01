import Item from "../models/Item.js";
import mongoose from "mongoose";

// CREATE - Add a new food item to the pantry
async function createItem(req, res) {
    try {
        //get the userId from the verified access token (req.user)
        const userId = req.user.userId;

        //create a new item with the request body and userId
        const newItem = new Item({ ...req.body, userId });
        await newItem.save();
        console.log(newItem);
        res.status(200).json({
            message: "item has been added succesfully",
            data: newItem,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// READ - Get all items with search, filter, pagination, and sort
// Query params: ?search=milk&category=dairy&page=1&limit=10&sortBy=expiryDate&sortOrder=asc
async function getAllItems(req, res) {
    try {
        const userId = req.user.userId;

        //get query parameters from the URL
        const { search, category, page = 1, limit = 12, sortBy = "createdAt", sortOrder = "desc" } = req.query;

        //build the filter object
        const filter = { userId };

        //if search query exists, search by item name (case-insensitive)
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        //if category filter exists, filter by category (case-insensitive)
        if (category) {
            filter.category = { $regex: `^${category}$`, $options: "i" };
        }

        //calculate how many items to skip for pagination
        const skip = (Number(page) - 1) * Number(limit);

        //build sort object (1 for ascending, -1 for descending)
        const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        //find items with filter, sort, pagination
        const items = await Item.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        //get total count for pagination info
        const totalItems = await Item.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / Number(limit));

        console.log(`Fetched ${items.length} items (page ${page} of ${totalPages})`);
        res.status(200).json({
            message: "items fetched succesfully",
            count: items.length,
            totalItems: totalItems,
            totalPages: totalPages,
            currentPage: Number(page),
            data: items,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// GET CATEGORIES - Get all unique categories for filter dropdown
async function getCategories(req, res) {
    try {
        const userId = req.user.userId;

        //use MongoDB distinct to get all unique category values
        const categories = await Item.distinct("category", { userId });

        res.status(200).json({
            message: "categories fetched succesfully",
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// READ - Get a single item by ID
async function getItemById(req, res) {
    try {
        const itemId = req.params.id;
        const userId = req.user.userId;

        //find item by id and make sure it belongs to the logged-in user
        const item = await Item.findOne({ _id: itemId, userId });
        if (!item) {
            throw new Error("item not found or you dont have access");
        }

        res.status(200).json({
            message: "item found succesfully",
            data: item,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// UPDATE - Update an existing item
async function updateItem(req, res) {
    try {
        const itemId = req.params.id;
        const userId = req.user.userId;

        //find and update the item, return the updated document
        const updatedItem = await Item.findOneAndUpdate(
            { _id: itemId, userId },
            req.body,
            { new: true }
        );

        if (!updatedItem) {
            throw new Error("item not found or you dont have access");
        }

        console.log(updatedItem);
        res.status(200).json({
            message: "item updated succesfully",
            data: updatedItem,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// DELETE - Remove an item from the pantry
async function deleteItem(req, res) {
    try {
        const itemId = req.params.id;
        const userId = req.user.userId;

        //find and delete the item
        const deletedItem = await Item.findOneAndDelete({ _id: itemId, userId });

        if (!deletedItem) {
            throw new Error("item not found or you dont have access");
        }

        console.log(deletedItem);
        res.status(200).json({
            message: "item deleted succesfully",
            data: deletedItem,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// FRESHNESS SCORE - Calculate how fresh the item is (percentage)
// Formula: freshness = (daysLeft / totalShelfLife) * 100
async function getFreshness(req, res) {
    try {
        const itemId = req.params.id;
        const userId = req.user.userId;

        const item = await Item.findOne({ _id: itemId, userId });
        if (!item) {
            throw new Error("item not found or you dont have access");
        }

        //calculate total shelf life (expiryDate - purchaseDate) in days
        const totalShelfLife = (new Date(item.expiryDate) - new Date(item.purchaseDate)) / (1000 * 60 * 60 * 24);

        //calculate days left (expiryDate - today) in days
        const daysLeft = (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);

        //calculate freshness percentage
        let freshness = (daysLeft / totalShelfLife) * 100;

        //clamp between 0 and 100
        if (freshness < 0) freshness = 0;
        if (freshness > 100) freshness = 100;

        freshness = Math.round(freshness);

        res.status(200).json({
            message: "freshness score calculated succesfully",
            data: {
                itemName: item.name,
                freshness: freshness,
                
                daysLeft: Math.ceil(daysLeft),
                totalShelfLife: Math.ceil(totalShelfLife),
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// COUNTDOWN - How many days until expiry or how many days ago it expired
async function getCountdown(req, res) {
    try {
        const itemId = req.params.id;
        const userId = req.user.userId;

        const item = await Item.findOne({ _id: itemId, userId });
        if (!item) {
            throw new Error("item not found or you dont have access");
        }

        //calculate difference between expiryDate and today
        const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

        let countdownMessage;
        if (daysLeft > 0) {
            countdownMessage = `Expires in ${daysLeft} days`;
        } else if (daysLeft === 0) {
            countdownMessage = "Expires today!";
        } else {
            countdownMessage = `Expired ${Math.abs(daysLeft)} days ago`;
        }

        res.status(200).json({
            message: "countdown calculated succesfully",
            data: {
                itemName: item.name,
                countdown: countdownMessage,
                daysLeft: daysLeft,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// EXPIRING SOON - Get items expiring in the next 7 days
async function getExpiringSoon(req, res) {
    try {
        const userId = req.user.userId;

        //get today's date and the date 7 days from now
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        //find items where expiryDate is between today and 7 days from now
        const expiringSoonItems = await Item.find({
            userId,
            expiryDate: { $gte: today, $lte: sevenDaysFromNow },
        });

        res.status(200).json({
            message: "expiring soon items fetched succesfully",
            count: expiringSoonItems.length,
            data: expiringSoonItems,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// EXPIRED - Get all expired items
async function getExpiredItems(req, res) {
    try {
        const userId = req.user.userId;

        //find items where expiryDate is before today
        const today = new Date();
        const expiredItems = await Item.find({
            userId,
            expiryDate: { $lt: today },
        });

        res.status(200).json({
            message: "expired items fetched succesfully",
            count: expiredItems.length,
            data: expiredItems,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// ANALYTICS - Get category-wise item counts using MongoDB aggregation
async function getAnalytics(req, res) {
    try {
        const userId = req.user.userId;

        //use MongoDB aggregation to group items by category and count them
        const analytics = await Item.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        //convert to a more readable format { category: count }
        const categoryWiseCount = {};
        analytics.forEach((item) => {
            categoryWiseCount[item._id] = item.count;
        });

        res.status(200).json({
            message: "analytics fetched succesfully",
            data: categoryWiseCount,
            rawData: analytics,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

// SUGGESTIONS - Get items expiring within 2 days (use them soon!)
async function getSuggestions(req, res) {
    try {
        const userId = req.user.userId;

        //get today's date and the date 2 days from now
        const today = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(today.getDate() + 2);

        //find items where expiryDate is between today and 2 days from now
        const suggestions = await Item.find({
            userId,
            expiryDate: { $gte: today, $lte: twoDaysFromNow },
        });

        res.status(200).json({
            message: "suggestions fetched succesfully - use these items soon!",
            count: suggestions.length,
            data: suggestions,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
}

export {
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
};
