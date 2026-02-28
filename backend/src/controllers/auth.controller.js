import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/clodinary.js';

export const signup = async (req,res)=>{
    const{fullname,email,password} = req.body;

    try{
        if(!fullname || !email || !password){
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
            name : fullname,
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
        profilePic : user.ProfilePic,
    })
}   catch(error){
    console.log(error);
    return res.status(500).json({message:"InternalServer Error"});
}

}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"Successfully logged out"});
    }
    catch(error){
        console.log("logout controller error: ",error.message);
    }
}

export const UpdateProfile = async(req,res)=>{
    try{
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(200).json({message : "Profile pic updated"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic : uploadResponse.secure_url},
            {new : true}
        );
            
        res.status(200).json(updatedUser)
    }

    catch(error){
        console.log("error", error);
        return res.status(500).json({message:"internal server error"});
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