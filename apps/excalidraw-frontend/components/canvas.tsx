"use client"
import initDraw from '@/draw';
import React, { useEffect, useRef } from 'react'

interface CanvasPrps {
    roomId: string;
    socket: WebSocket
}

function Canvas({ roomId, socket }: CanvasPrps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas){
            initDraw(canvas, roomId, socket);
        }
    }, [])



    return (
        <div>
            <canvas ref={canvasRef} width={700} height={700}></canvas>
        </div>
    )
}

export default Canvas