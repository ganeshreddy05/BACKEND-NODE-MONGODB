import Book from "../models/bookModel.js";
import { generateAccessToken } from "../utils/jwtToken.js";

async function createNewBook(req, res){
    try {
        const newBookData = req.body;
        const {title} = newBookData;

        const existingBook = await Book.findOne({title: title});
        
        if(existingBook?._id){
            throw new Error("Already, book exist with the same title!")
        }

        const newBook = await Book.create(newBookData);
        if(!newBook._id){
            throw new Error("Book has not been created in db.")
        }

        res.status(201).json({
            message: "New Book has been created!",
            newBookId: newBook._id,
            request: {
                body: req.body,
                params: req.params,
                query: req.query,
                headers: req.headers
            },
            jwtToken: generateAccessToken("1234567890")
        })
        
    } catch (error) {
        console.error(error)
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
}

export default createNewBook;