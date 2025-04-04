import { WebSocket, WebSocketServer } from 'ws';
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client"
import axios from 'axios';

const wss = new WebSocketServer({ port: 5000 });

interface user {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}

const users: user[] = [];


function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }

}

wss.on('connection', function connection(ws, request) {
  const url = request.url; // ws://localhost:3000?token=123123

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    ws,
    rooms: []
  })


  ws.on('message', async function message(data) {
    // {"type": "JOIN_ROOM", "roomId": "1"}
    // {"type": "LEAVE ROOM", "roomId": "1"}
    // {"type": "CHAT", "message":"hey", "roomId": "1"}
    const parsedData = JSON.parse(data as unknown as string);
    //join room
    if (parsedData.type == "JOIN_ROOM") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }

      // Ensure `user.rooms` is initialized as an array
      // if (!Array.isArray(user.rooms)) {
      //   user.rooms = [];
      // }

      user.rooms.push(parsedData.roomId);
    }

    //exit room
    if (parsedData.type == "LEAVE ROOM") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter(x => x != parsedData.roomId);

    }

    //chat 
    if (parsedData.type == "CHAT") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;


      //spread the chat to others
      users.forEach(user => {
        if (user.rooms.includes(parsedData.roomId)) {
          console.log("enter")
          user.ws.send(JSON.stringify({
            type: "CHAT",
            message: message,
            roomId: roomId
          }))
        }
      })


      //make chat in database
      try {
        const response = await axios.post("http://localhost:8080/chat",
          {
            roomId: Number(roomId),
            message: JSON.stringify(message),
          },
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
        console.log(response.data);
      } catch (error) {
        console.log("error in creating chat")
      }
    }
  });

});