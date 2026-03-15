import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";


export const register = catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Please upload an avatar and resume", 400));
    }

    const { avatar, resume } = req.files;

    const cloudinaryAvatarResult = await cloudinary.uploader.upload(avatar.tempFilePath,{
        folder:"avatars",
        
    });
    
    if(!cloudinaryAvatarResult || cloudinaryAvatarResult.error){
        console.error("Cloudinary Avatar Upload Error:", cloudinaryAvatarResult.error);
        return next(new ErrorHandler(`Avatar upload failed: ${cloudinaryAvatarResult.error || 'Unknown error'}`, 400));
    }

    const cloudinaryResumeResult = await cloudinary.uploader.upload(resume.tempFilePath,{
        folder:"resumes",
        resource_type: "raw"
        
    });
    
    if(!cloudinaryResumeResult || cloudinaryResumeResult.error){
        console.error("Cloudinary Resume Upload Error:", cloudinaryResumeResult.error);
        return next(new ErrorHandler(`Resume upload failed: ${cloudinaryResumeResult.error || 'Unknown error'}`, 400));
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