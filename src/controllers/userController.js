import User from "../models/User.js";
import user from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtToken.js";

async function createUser(req, res) {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    console.log(newUser);
    res.status(200).json({
      message: "data has been recieved succesfully",
      data: newUser,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
      error: true,
    });
  }
}
async function getUser(req, res) {
  try {
    const userDetails = await user.find();
    console.log(userDetails);
    res.status(200).json({
      message: "data fetched succesfully",
      count: userDetails.length,
      data: userDetails,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
}
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    //check if user exiist with username,if not throw error
    const existedUser = await User.findOne({ username });
    if (!existedUser) {
      throw new Error("user with this username is not existed");
    }
    //check if password matches
    const x = await existedUser.comparePassword(password);
    console.log(x);

    //create access token and refresh function
    const accessToken = generateAccessToken(existedUser._id);
    const refreshToken = generateRefreshToken(existedUser._id);

    //save the refrsh token inside user
    existedUser.refreshToken = refreshToken;

    //set the browser cookies-access token , refresh token
     res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : true,//only for production
        sameSite : 'strict',
        maxAge : 7*24*60*60*1000
     }) 
    //send the responsse- accesstoken,refresh token
    res.status(200).json({
        success : true,
        message : "user loggedin succesfully",

    })
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
}
export { createUser, getUser, loginUser };
