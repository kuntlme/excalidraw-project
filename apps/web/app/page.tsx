"use client"
import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { json } from "stream/consumers";
import { useRouter } from "next/navigation";


export default function Home() {
  const [input, setinput] = useState("")
  const router = useRouter();


  function handleClick(){
    router.push(`/room/${input}`);
  }

  return (
    <div style={{display:"flex", justifyContent:"center", alignItems: "center", flexDirection: "column"}}>
      <input type="text" onChange={e => setinput(e.target.value)} placeholder="enter the room id"/>
      <button onClick={handleClick}>submit</button>
      {input}

    </div>
  );
}
