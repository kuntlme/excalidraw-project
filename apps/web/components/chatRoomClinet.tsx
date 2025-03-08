"use client"
import React, { useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { json } from 'stream/consumers'

function ChatRoomClinet({id, messages}: {id: string; messages: {message: string}[];}) {
    const {socket, loading} = useSocket()
    const [chats, setChats] = useState<{message: string}[]>(messages)
    const [currentChat, setCurrentChat] = useState("")
    useEffect(() => {
        if(socket && !loading){
            socket.send(JSON.stringify({
                type: "JOIN_ROOM",
                roomId: id
            }))

            socket.onmessage = (event) => {
                const parseData = JSON.parse(event.data)
                console.log(parseData)
                console.log(chats)

                if(parseData.type === "CHAT"){
                    console.log("enter")
                    setChats(c => [...c, {message: parseData.message}])
                }
            }
        }
    }, [socket, loading, id])

    const handleClick = () => {
        socket?.send(JSON.stringify({
            type: "CHAT",
            message: currentChat,
            roomId: id
        }))
        setCurrentChat("")
    }

  return (
    <div>
        {chats.map(m => <div>{m.message}</div>)}

        <input type="text" value={currentChat} onChange={e => setCurrentChat(e.target.value)}/>
        <button onClick={handleClick}>enter</button>
    </div>
  )
}

export default ChatRoomClinet