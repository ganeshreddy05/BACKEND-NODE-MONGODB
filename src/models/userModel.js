import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    phone : String,
    age : Number,
    fullname :String
},{
    timestamps : true
})
const user = mongoose.model("user",userSchema);
export default user;
