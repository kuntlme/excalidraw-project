"use client";
import React, { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [error, setError] = useState<any>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const handleSignup = (formData: IFormInput) => {
    console.log("submitted");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-700 text-stone-200">
      <div className="w-1/5 flex flex-col items-center justify-center border border-stone-600 rounded-md p-4">
        <h1 className="text-4xl font-bold font-serif my-10">SIGN UP</h1>
        <form
          onSubmit={handleSubmit(handleSignup)}
          className="flex flex-col gap-4"
        >
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="enter your username"
            className="border border-stone-600 rounded-md p-2"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Username must be at most 20 characters",
              },
            })}
          />
          {errors.username && <p className="text-red-400">{errors.username.message}</p>}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="enter your email"
            className="border border-stone-600 rounded-md p-2"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
          />
          {errors.email && <p className="text-red-400">{errors.email.message}</p>}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="enter your password"
            className="border border-stone-600 rounded-md p-2"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && <p className="text-red-400">{errors.password.message}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
