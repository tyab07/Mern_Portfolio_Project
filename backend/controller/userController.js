import {catchAsyncErrors} from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";


export const register = catchAsyncErrors(async(req,res,next)=>{
    if(!req.filesm||Object.keys(req.files).length===0){
        return next(new ErrorHandler("Please upload a Avatar and resume",400));
    }
    const {avatart,resume} = req.files;

    const cloudinaryAvatarResult = await cloudinary.uploader.upload(avatart.tempFilePath,{
        folder:"avatars",
        
    });
    
    if(!cloudinaryAvatarResult || cloudinaryAvatarResult.error){
        console.error("Cloudinary Avatar Upload Error:", cloudinaryAvatarResult.error);
    }

    const cloudinaryResumeResult = await cloudinary.uploader.upload(resume.tempFilePath,{
        folder:"resumes",
        
    });
    
    if(!cloudinaryResumeResult || cloudinaryResumeResult.error){
        console.error("Cloudinary Resume Upload Error:", cloudinaryResumeResult.error);
    }



     const {
        fullName,email,phone,about,password,githubLink
      } = req.body;

    const user = await User.create({
        fullName,email,phone,about,password,githubLink,
        avatar:{
            public_id:cloudinaryAvatarResult.public_id,
            url:cloudinaryAvatarResult.secure_url
        },
        resume:{
            public_id:cloudinaryResumeResult.public_id,
            url:cloudinaryResumeResult.secure_url
        }
        
    });

    res.status(200).json({
        success:true,
        message:"User registered successfully",
       
    });

});