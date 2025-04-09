"use client";
import { MakeCanvas } from "@/draw/canvas";
import {
  Circle,
  Eraser,
  Pencil,
  RectangleHorizontal,
  Slash,
  TypeOutline,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CanvasPrps {
  roomId: string;
  socket: WebSocket;
}

function Canvas({ roomId, socket }: CanvasPrps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectedCanvasRef = useRef<MakeCanvas | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [selectedShape, setSelectedShape] = useState<
    "circle" | "rectangle" | "line" | "pencil" | "text" | "eraser"
  >("rectangle");
  const [selectedStrockColor, setSelectedStrockColor] = useState<
    "#f7f9f9" | "#cb4335" | "#a569bd" | "#58d68d"
  >("#f7f9f9");

  const [zoomLevel, setZoomLevel] = useState<number>(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textarea = textareaRef.current;
    if (canvas && !selectedCanvasRef.current && textarea) {
      const newcanvas = new MakeCanvas(canvas, roomId, textarea, socket);
      selectedCanvasRef.current = newcanvas;
      selectedCanvasRef.current = newcanvas;
      // Add zoom change listener
      newcanvas.setZoomChangeCallback((scale: number) => {
        setZoomLevel(scale);
      });
    }
  }, [roomId, socket]);

  const handleZoomIn = () => {
    if (selectedCanvasRef.current) {
      selectedCanvasRef.current.zoomIn();
      setZoomLevel(selectedCanvasRef.current.getScale());
    }
  };

  const handleZoomOut = () => {
    if (selectedCanvasRef.current) {
      selectedCanvasRef.current.zoomOut();
      setZoomLevel(selectedCanvasRef.current.getScale());
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block bg-neutral-900"
      ></canvas>

      <div className="fixed top-4 left-1/2 flex gap-2 bg-zinc-800 rounded-md p-2">
        <button
          className={`px-3 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 text-white ${
            selectedShape === "rectangle" ? "border border-white/30" : ""
          }`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setTool("rectangle");
              setSelectedShape("rectangle");
            }
            console.log("clicked rect");
          }}
        >
          <RectangleHorizontal size={28} />
        </button>

        <button
          className={`px-3 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 text-white ${
            selectedShape === "circle" ? "border border-white/30" : ""
          }`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setTool("circle");
              setSelectedShape("circle");
            }
            console.log("clicked circle");
          }}
        >
          <Circle size={28} />
        </button>

        <button
          className={`px-3 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 text-white ${
            selectedShape === "line" ? "border border-white/30" : ""
          }`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setTool("line");
              setSelectedShape("line");
            }
            console.log("clicked line");
          }}
        >
          <Slash size={28} />
        </button>

        <button
          className={`px-3 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 text-white ${
            selectedShape === "pencil" ? "border border-white/30" : ""
          }`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setTool("pencil");
              setSelectedShape("pencil");
            }
            console.log("clicked pencil");
          }}
        >
          <Pencil size={28} />
        </button>

        <button
          className={`px-3 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 text-white ${
            selectedShape === "text" ? "border border-white/30" : ""
          }`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setTool("text");
              setSelectedShape("text");
            }
            console.log("clicked text");
          }}
        >
          <TypeOutline size={28} />
        </button>

        <button
          className={`px-3 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600 text-white ${
            selectedShape === "eraser" ? "border border-white/30" : ""
          }`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setTool("eraser");
              setSelectedShape("eraser");
            }
            console.log("clicked eraser");
          }}
        >
          <Eraser size={28} />
        </button>
      </div>

      <div className="fixed flex flex-col items-end text-white right-7 top-7 gap-3">
        <div
          className={`bg-[#f7f9f9] size-9 rounded-full ${selectedStrockColor === "#f7f9f9" ? "border-3 border-fuchsia-800" : ""}`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setStrockColor("#f7f9f9");
              setSelectedStrockColor("#f7f9f9");
            }
          }}
        ></div>
        <div
          className={`bg-[#cb4335] size-9 rounded-full ${selectedStrockColor === "#cb4335" ? "border-3 border-fuchsia-800" : ""}`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setStrockColor("#cb4335");
              setSelectedStrockColor("#cb4335");
            }
          }}
        ></div>
        <div
          className={`bg-[#a569bd] size-9 rounded-full ${selectedStrockColor === "#a569bd" ? "border-3 border-fuchsia-800" : ""}`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setStrockColor("#a569bd");
              setSelectedStrockColor("#a569bd");
            }
          }}
        ></div>
        <div
          className={`bg-[#58d68d] size-9 rounded-full ${selectedStrockColor === "#58d68d" ? "border-3 border-fuchsia-800" : ""}`}
          onClick={() => {
            if (selectedCanvasRef.current) {
              selectedCanvasRef.current.setStrockColor("#58d68d");
              setSelectedStrockColor("#58d68d");
            }
          }}
        ></div>
        <p className="text-2xl font-bold text-center">Text-size</p>
        <input
          type="range"
          min={1}
          max={5}
          defaultValue={2}
          onChange={(e) => {
            if (selectedCanvasRef.current) {
              console.log(e.target.value);
              selectedCanvasRef.current.setTextSize(Number(e.target.value));
            }
          }}
        />
        <div className="flex gap-2 bg-zinc-800 rounded-xl justify-center cursor-pointer">
          <button
            className="text-xl py-2 px-6 hover:bg-zinc-700 rounded-xl"
            onClick={handleZoomOut}
          >
            -
          </button>

          <div className="py-2 px-4 hover:bg-zinc-700 rounded-xl">
            <p className="text-xl">{Math.abs(zoomLevel)}%</p>
          </div>

          <button
            className="text-xl py-2 px-6 hover:bg-zinc-700 rounded-xl"
            onClick={handleZoomIn}
          >
            +
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        name=""
        id=""
        rows={1}
        cols={1}
        className="fixed top-0 left-0 p-0 h-auto resize-none  outline-none whitespace-nowrap font-serif"
      ></textarea>
    </div>
  );
}

export default Canvas;
