"use client"
import useSocket from '@/hooks/socket'
import React, { useEffect, useState } from 'react'
import Canvas from './canvas';

function RoomCanvas({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {

      socket.send(JSON.stringify({
        type: "JOIN_ROOM",
        roomId: roomId
      }))

      // socket.onmessage = (event) => {
      //   const message = JSON.parse(event.data.message);
      //   setCurrentMessage(message)
      // }
      console.log("joined");
    }

  }, [socket])

  if (!socket) {
    return (
      <div>
        connecting to ws server.......
      </div>
    )
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  )
}

export default RoomCanvas