"use client"
import initDraw from '@/draw';
import { MakeCanvas } from '@/draw/canvas';
import React, { useEffect, useRef, useState } from 'react'

interface CanvasPrps {
    roomId: string;
    socket: WebSocket
}

function Canvas({ roomId, socket }: CanvasPrps) {
    const [selectedCanvas, setSelectedCanvas] = useState<MakeCanvas | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            // initDraw(canvas, roomId, socket);
            const newcanvas = new MakeCanvas(canvas, roomId, socket);
            setSelectedCanvas(newcanvas);
        }
    }, [])

    return (
        <div>
            <canvas ref={canvasRef} width={700} height={700} className='border border-red-500'></canvas>
            <button className='p-2 bg-red-500 rounded-xl' onClick={() => selectedCanvas?.setTool("rectangle")}>rect</button>
            <button className='p-2 bg-green-500 rounded-xl' onClick={() => selectedCanvas?.setTool("circle")}>circle</button>

        </div>
    )
}

export default Canvas