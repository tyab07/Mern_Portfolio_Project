import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  


const userSchema  = new mongoose.Schema({
    fullName:{
        type: String,
        minLength:[2,'Name must be at least 2 characters long'],
        maxLength:[50,'Name cannot exceed 50 characters'],
        required:[true,'Name is required']
    },
    email:{
        type: String,
        required:[true,'Email is required'],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email address']
    },
    phone:{
        type: String,
        required:[true,'Phone number is required'],
        unique:true,
        match:[/^\+?[1-9]\d{1,14}$/,'Please enter a valid phone number']
    },
    about:{
        type:String,
        maxLength:[500,'About section cannot exceed 500 characters'],
        required:[true,'About section is required']
    },
    password:{
        type: String,
        required:[true,'Password is required'],
        minLength:[6,'Password must be at least 6 characters long'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    resume:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },

    githubLink:{
        type:String,
        match:[/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,'Please enter a valid GitHub profile URL']
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,   

});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.comparePassword = async function(enteredPassword){ 
    return await bcrypt.compare(enteredPassword,this.password);
};

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    });
};

export const User = mongoose.model("User", userSchema);