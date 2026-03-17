import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/clodinary.js';

export const signup = async (req,res)=>{
    const{fullName,email,password} = req.body;
    try{
        
        if(!fullName || !email || !password){
            return res.status(400).json({message : "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password length must be equal to 6 or more than 6 characters"});
        }

        const user = await User.findOne({email})
        
        if(user){
            return res.status(400).json({message : "User already existssss"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name : fullName,
            email : email,
            password : hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            return res.status(201).json({
                _id : newUser._id,
                name : newUser.name,
                email : newUser.email,
                password : newUser.password
            })
        }
        else{
            return res.status(400).json({message:"Invalid user data"})
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"InternalServer Error"});
    }
}

export const login = async (req,res)=>{
    try{
        const{email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message : "Invalid credentials"});
        }

        const isPassword = bcrypt.compare(password,user.password);

        if(!isPassword){
            return res.status(400).json({message : "Invalid credentials"});
        }

        generateToken(user._id,res);

        return res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            profilePic : user.profilePic,
        })
    }   
        
    catch(error){
        console.log(error);
        return res.status(500).json({message:"InternalServer Error"});
    }

}

export const logout = (req,res)=>{
    try{
        res.cookie("token","",{maxAge:0});
        return res.status(200).json({message:"Successfully logged out"});
    }
    catch(error){
        console.log("logout controller error: ",error.message);
    }
}

export const UpdateProfile = async(req,res)=>{
    try{
        console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
        console.log("API Key:", process.env.CLOUDINARY_API_KEY);
        console.log("API Secret:", process.env.CLOUDINARY_SECRET_KEY);
        console.log("BODY:");
        console.log("FILE:", req.file);
        const userId = req.user._id; 

        if(!req.file){
            return res.status(400).json({message : "Profile pic required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(
        req.file.path.replace(/\\/g, "/")
        );
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic : uploadResponse.secure_url},
            {new : true}
        );
            
        res.status(200).json(updatedUser);
    }

    catch(error){
        console.log("FULL ERROR:", error);
        console.log("MESSAGE:", error.message);
        return res.status(500).json({message:"internal serverrr error"});
    }

}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};