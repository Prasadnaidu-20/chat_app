import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import {toast} from 'react-hot-toast';
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set,get) =>({
    authUser:null,
    isSigningUp: false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:false, 
    onlineUsers : [],
    socket : null,

    checkAuth: async() =>{  
        set({isCheckingAuth: true});
        try{
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data});
            get().connectSocket();
        }
        catch(error){
            console.log("Error in checkAuth:", error);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    },

    login: async(data) =>{
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("Login Successful");
            get().connectSocket();
        }
        catch(error){
            console.log("Error in login:", error);

        }
        finally{
            set({isLoggingIn: false});
        }
    },

    signup : async(data) =>{
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});
            toast.success("Signup Successful");
            get().connectSocket();
            
        }
        catch(error){
            console.log("Error in signup:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        }
        finally{
            set({isSigningUp: false});
        }
    },

    logout : async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");

            get().disconnectSocket();
        }
        catch(error){
            console.log("Error in Logout:", error);
            toast.error("Logout failed");
        }
    },

    updateProfile : async(file) =>{
        set({isUpdatingProfile: true});
        try{
            const formData = new FormData();
            formData.append("profilePic", file);
            const res = await axiosInstance.put("/auth/update-profile",formData,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({authUser: res.data});
            toast.success("Profile got updated successfully");
        }
        catch(error){
            console.log("Error in updateProfile:", error);
        }
        finally{
            set({isUpdatingProfile: false});
        }

    },

    connectSocket : ()=>{
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({socket : socket});

        socket.on("getOnlineUsers",(userIds) =>{
            set({ onlineUsers : userIds}); 
        });
    },

    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));