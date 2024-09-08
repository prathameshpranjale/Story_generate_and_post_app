import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

        // Check if the token is provided
        if (!token) {
            throw new ApiError(401, "Unauthorized request: Token is required");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user associated with the token, excluding password and refresh token
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        // Check if user exists
        if (!user) {
            throw new ApiError(401, "Invalid or expired access token");
        }

        // Attach the user to the request object for further use
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle JWT verification errors and other errors
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid access token");
        }
        // Default error message
        throw new ApiError(401, "Unauthorized access");
    }
});
