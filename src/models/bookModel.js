import mongoose from "mongoose";

const bookSchema =  new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    author :{
          type : String,
           required : true,
           trim : true
    },
    PublishedYear :{
        type : Number,
        required : true,
        min : 1000,
       
    },
    genre : {
        type : String,
        trim : true,
    },
    pages : {
        type : Number,
        min : 1,
        max : 1000
    }
},{
    timestamps: true
});
const Book = mongoose.model("book",bookSchema);
export default Book;