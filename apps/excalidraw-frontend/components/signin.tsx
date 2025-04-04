"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
interface IFormInput {
  email: string;
  password: string;
}

const Signin = () => {
  const router = useRouter();
  const [error, setError] = useState<any>("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IFormInput>();
  const handleSignin = async (formData: IFormInput) => {
    try {
      console.log(formData);
      const response = await axios.post(`${process.env.BACKEND_URL}/signin`, {
        email: formData.email,
        password: formData.password,
      });
      if (response.data.token) {
        Cookies.set("token", response.data.token);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response || "Signin failed");
      console.log(err.response);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-700 text-stone-200">
      <div className="w-1/5 flex flex-col items-center justify-center border border-stone-600 rounded-md p-4">
        <h1 className="text-4xl font-bold font-serif my-10">SIGN IN</h1>
        <form
          onSubmit={handleSubmit(handleSignin)}
          className="flex flex-col gap-4"
        >
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
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}
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
          {errors.password && (
            <p className="text-red-400">{errors.password.message}</p>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Signin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
