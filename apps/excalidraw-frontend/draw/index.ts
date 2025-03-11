import { useEffect } from "react";
import { json } from "stream/consumers";
import { Shape } from "./shape";

interface shapetype {
    type: "rectrangle" | "circle";
    x: number;
    y: number;
    width: number;
    heigh: number;
}

interface InitDrowProps {
    canvas: HTMLCanvasElement;
    roomId: string
}

export default function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const existingShape: shapetype[] = [];
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    const shape = new Shape(ctx);

    //get shape from socket
    if (socket) {
        socket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === "CHAT") {
                existingShape.push(parsedData.message);
                getClear(canvas, ctx, existingShape)

            }
        }
    }

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        shape.setStartVertex(e.clientX, e.clientY);
        // console.log("down " + e.clientX + "," + e.clientY);
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        // console.log("up " + e.clientX + "," + e.clientY);
        let width = e.clientX - startX;
        let height = e.clientY - startY;
        shape.setCurrentVertex(e.clientX, e.clientY);
        // shape.makeRect();
        existingShape.push({
            type: "rectrangle",
            x: startX,
            y: startY,
            width: width,
            heigh: height
        })

        // send to to the socket
        socket.send(JSON.stringify({
            type: "CHAT",
            message: {
                type: "rectrangle",
                x: startX,
                y: startY,
                width: width,
                heigh: height
            },
            roomId: roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            // let width = e.clientX - vertexX;
            // let height = e.clientY - vertexY;
            shape.setCurrentVertex(e.clientX, e.clientY);
            getClear(canvas, ctx, existingShape)
            shape.makeRect();
            // ctx.strokeRect(vertexX, vertexY, width, height)

            // console.log("move " + e.clientX + "," + e.clientY);
        }
    })
}


function getClear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingShape: shapetype[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape) => {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.heigh);
    })
}