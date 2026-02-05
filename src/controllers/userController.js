import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";
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
    const userDetails = await User.find();
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
    if (!existedUser.password) {
      throw new Error("Password not set for this user");
    }
    const isPasswordSame = await bcrypt.compare(password, existedUser.password);
    console.log("isPasswordSame: ", isPasswordSame);
    if (!isPasswordSame) {
      throw new Error("Wrong password!");
    }

    //create access token and refresh function
    const accessToken = generateAccessToken(existedUser._id);
    const refreshToken = generateRefreshToken(existedUser._id);

    //save the refrsh token inside user
    existedUser.refreshToken = refreshToken;

    //set the browser cookies-access token , refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, //only for production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //send the responsse- accesstoken,refresh token
    res.status(200).json({
      success: true,
      accessToken: accessToken,
      message: "user loggedin succesfully",
      userId : existedUser._id
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
}
async function logout(req, res) {
  try {
    //get the userId from the req.object
    const userId = req.user.userId;
    //Remove refresh token from the DB

    //WE HAVE TO GET THEeUSERiD-Find user document in mongoDb-nullify the refreshToken
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    //clear the cookes also
    res.clearCookie('refreshToken');
    res.status(200).json({
      message : "loggedout succesfully"
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
      error: true,
    });
  }
}
export { createUser, getUser, loginUser, logout };
