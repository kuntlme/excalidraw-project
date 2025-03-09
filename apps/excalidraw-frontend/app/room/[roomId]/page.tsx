"use client"
import initDraw from '@/draw';
import React, { useEffect, useRef, useState } from 'react'

function page() {
    const [x, setX] = useState(0);
    const [y, sety] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current
            initDraw(canvas)

        }

    }, [])
  return (
    <div>
        <canvas ref={canvasRef} width={700} height={700} className='border border-red-600'></canvas>
    </div>
  )
}

export default page