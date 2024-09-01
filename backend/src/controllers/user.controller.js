
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    // console.log('Request received in controller:', req.body);  // Log the request body in the controller
    // res.status(200).json({
    //     message: "ok doneee"
    // });

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // form se data aa raha hai 
    const { email, username, password } = req.body
    // console.log("email",email)




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
    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath.path);
    const user = await User.create({
        profilePicture: profilePicture.url,
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
        new ApiResponse(200, createdUser, "User registered Successfully <& - &>")
    )

});


export {
    registerUser
};