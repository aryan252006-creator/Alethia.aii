import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  //
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")  //exclude password and refresh token from user data
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;  //attach user to req object, so that in next steps we can access the user details from req.user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
}) 