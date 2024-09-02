import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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


export {
    registerUser
};