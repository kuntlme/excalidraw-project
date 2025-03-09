"use client"
import useSocket from '@/hooks/socket'
import React, { useEffect, useState } from 'react'
import Canvas from './canvas';

function RoomCanvas({roomId}: {roomId: string}) {
    const {socket, loading} = useSocket();
    const [currentMessage, setCurrentMessage] =  useState<string>("")

    useEffect(() => {
      if(socket && !loading){
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data.message);
          setCurrentMessage(message)
        }
      }

    }, [socket])

    if(!socket){
      return (
        <div>
          connecting to ws server.......
        </div>
      )
    }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
  )
}

export default RoomCanvas