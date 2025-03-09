"use client"
import React, { useEffect, useRef } from 'react'

function Page() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if(canvasRef.current){
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d");

            if(!ctx){
                return;
            }

            // ctx.fillStyle = "green";
            // ctx.strokeRect(5,5,120,456);

            canvas.addEventListener("mousedown", (e) => {
                console.log("down " + e.clientX + "," + e.clientY);
            })

            canvas.addEventListener("mouseup", (e) => {
                console.log("up " + e.clientX + "," + e.clientY);

            })

            canvas.addEventListener("mousemove", (e) => {
                console.log("move " + e.clientX + "," + e.clientY);
            })

        }

    }, [canvasRef])
    
  return (
    <div>
        <canvas ref={canvasRef} width={500} height={500} className='border border-red-500'></canvas>
    </div>
  )
}

export default Page