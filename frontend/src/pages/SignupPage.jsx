import React from 'react'
import { useState } from 'react';
import {useAuthStore} from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const[password,setPassword] = useState(0);
  const[showPassword,setShowPassword] = useState(false);
  const[formData,setFormData] = useState({
    fullName :"",
    email : "",
    password : "",
  });

  const {signup , isSigningUp} = useAuthStore();

  const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("full name is required");
    if(!formData.email.trim()) return toast.error("email is required");
    if(!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) return toast.error("invalid email");
    if(!formData.password.trim()) return toast.error("password is required");
    if(formData.password.length < 6) return toast.error("password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async(e) =>{ 
    e.preventDefault();

    const success = validateForm();
    if(success === true) {
      signup(formData);
    }

  };

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
      
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <MessageSquare className='size-6 text-primary' />
              </div>
              <h2 className='text-2xl font-semibold tracking-tight'>Create Account</h2>
              <p className='text-base-content/60'>Get Started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className ='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='w-6 h-6 text-base-content/40 z-10'/>
                </div>
                <input 
                type='text'
                className={'input input-bordered w-full pl-10'}
                placeholder='john doe'
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='w-6 h-6 text-blue-500 z-10'/>
                </div>
                <input 
                type='email'
                className={'input input-bordered w-full pl-10'}
                placeholder='email'
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='w-6 h-6 text-base-content/40 z-10'/>
                </div>
                <input 
                type={showPassword ? "text" : "password"}
                className={'input input-bordered w-full pl-10'}
                placeholder='password'
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                <button
                type='button'
                
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-sm text-blue-500'
                onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='w-6 h-6' />
                  ) : (
                    <Eye className='w-6 h-6' />
                  )}
                </button>
                </div>
              </div>

              <button type='submit' className='btn btn-primary w-full' disabled={isSigningUp}>
                  {isSigningUp ? (
                    <>
                      <Loader2 className='size-5 animate-spin mr-2' />
                    Signing Up...
                    </>
                  ) : (
                    "Create Account"
                  )}
              </button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side*/}
      <AuthImagePattern 
        title="Join our community"
        subtitle="Connect with friends and share your thoughts with the world."
      />
    </div>
  );
}

export default SignupPage