"use client"
import { MakeCanvas } from '@/draw/canvas';
import React, { useEffect, useRef, useState } from 'react'

interface CanvasPrps {
    roomId: string;
    socket: WebSocket
}

function Canvas({ roomId, socket }: CanvasPrps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const selectedCanvasRef = useRef<MakeCanvas | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas && !selectedCanvasRef.current) {
            const newcanvas = new MakeCanvas(canvas, roomId, socket);
            selectedCanvasRef.current = newcanvas;
        }
    }, [roomId, socket])

    return (
        <div className='w-screen h-screen overflow-hidden'>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className='border border-red-500 block'></canvas>
            <div className='fixed top-2 left-1/2 flex gap-2'>
            <button className='p-2 bg-green-500 rounded-xl' onClick={() => {
                if(selectedCanvasRef.current){
                    selectedCanvasRef.current.setTool('circle');
                }
                console.log("clicked circle")
                }}>circle</button>
            <button className='p-2 bg-red-500 rounded-xl' onClick={() => {
                if(selectedCanvasRef.current){
                    selectedCanvasRef.current.setTool("rectangle");
                }

                console.log("clicked rect")
                }}>rect</button>
            </div>
            

        </div>
    )
}

export default Canvas