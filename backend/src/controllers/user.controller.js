import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from "jsonwebtoken";


const generateAccessTokenAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        // acess and refresh token methods from user model
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // adding refresh token to database
        user.refreshToken = refreshToken
        // saving the and adding this line of validate before save
        // cause we dont want to kickin the password check functionality 
        // so it is must add await as its gonna take some time
        await user.save({ validateBeforeSave: false })
        // also there is no need to hold such methods in any variable 

        // after saving return both tokens
        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "something went wrong while genereating refresh and acess token!!!!!!!!!! ")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const {email='', username='', password='' } = req.body




    // email validation code using regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    // steps to check for registration
    if (
        [email, username, password].some((field) => field.trim() === "") ||
        !isValidEmail(email)
    ) {
        throw new ApiError(400, "All fields are required and email must be valid");
    }

    const existedUser = await User.findOne({

        // operators which can be used to to ccheck multiple 
        // checks for username and email
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exist");

    }


    const profilePictureLocalPath = req.files?.profilePicture?.[0];
    const profilePicture = profilePictureLocalPath ? await uploadOnCloudinary(profilePictureLocalPath.path) : null;
    
    const user = await User.create({
        profilePicture: profilePicture?.url||"",
        email,
        password,
        username: username.toLowerCase()
    })
    // check if user is created or not
    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    //    now we can check
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }


    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully <& - &>")
    )

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    if (!password) {
        throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect");
    }

    try {
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None' // Optional: adds additional security
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    // remove database refresh token and cookies that is storing login
    // refreshtoken and acess token 
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("logout successfuly");
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out Successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser
};