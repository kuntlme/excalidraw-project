"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = Cookies.get("token");
    if(token){
      setToken(token);
    }
  }, []);
  return (
    <div>
      <div>{token}</div>  
      <button onClick={() => router.push("/signup")}>signup</button>
      <button onClick={() => router.push("/signin")}>signin</button>
      <button onClick={() => router.push("/room")}>room</button>
    </div>
  );
}
