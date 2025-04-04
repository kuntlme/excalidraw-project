"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
interface Room {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

const page = () => {
  const router = useRouter();
  const [rooms, setrooms] = useState<Room[]>([]);
  const [joinRoomId, setJoinRoomId] = useState<string>("");
  useEffect(() => {
    const fetchRooms = async () => {
      const token = Cookies.get("token");
      console.log(token);
      console.log(process.env.BACKEND_URL);
      const response = await axios.get(`${process.env.BACKEND_URL}/room`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setrooms(response.data.rooms);
    };
    fetchRooms();
  }, []);
  return (
    <div>
      <h1>Rooms</h1>
      <h2>Join Room</h2>
      <input type="text" value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)} />
      <button onClick={() => router.push(`/room/${joinRoomId}`)} className="bg-blue-500 text-white p-2 rounded-md">Join room</button>
      {Array.isArray(rooms) && rooms.map(room => (
        <div key={room.id} className="border border-stone-600 rounded-md p-2">
          <h2>{room.slug}</h2>
          <p>{room.createdAt}</p>
          <p>{room.adminId}</p>
          <button onClick={() => router.push(`/room/${room.id}`)} className="bg-blue-500 text-white p-2 rounded-md">Join room</button>
        </div>
      ))}
    </div>
  );
};

export default page;
