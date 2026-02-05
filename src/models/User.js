import mongoose from "mongoose";
import bcrypt from "bcryptjs"
// Mongoose schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  password :{
    type : String,
    required : true,
    

  },
  role: {
    type: String,
    required: true,
    default: "student",
    enum: ['teacher', 'admin', 'student']
  }
}, {
  timestamps: true
});
userSchema.pre("save" ,async function(){
  const salt = await bcrypt.genSalt(10)
  console.log(salt);
  this.password = await bcrypt.hash(this.password,salt);
})

const User = mongoose.model('User', userSchema);

export default User;