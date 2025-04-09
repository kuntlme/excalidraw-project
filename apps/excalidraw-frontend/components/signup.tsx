"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const Signup = () => {
  const router = useRouter();
  const [error, setError] = useState<any>("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IFormInput>();
  const handleSignup = async (formData: IFormInput) => {
    try {
      console.log(formData);
      const response = await axios.post(`${process.env.BACKEND_URL}/signup`, {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (response.data.token) {
        Cookies.set("token", response.data.token);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response || "Signup failed");
      console.log(err.response);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-stone-200">
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
          <button disabled={isSubmitting}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>

      {/* <Card className="w-1/5 bg-black border border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white text-4xl">Signup</CardTitle>
          <CardDescription>Signup to get started</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input type="text"></Input>
          </div>
          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input type="password"></Input>
          </div>
          <Button className="w-full">Signup</Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center">
          <div className="mt-4 text-center text-sm text-white flex flex-row items-center justify-center">
            Don&apos;t have an account?{" "}
            <Link href="/signin" className="underline underline-offset-4 text-white">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card> */}
    </div>
  );
};

export default Signup;
