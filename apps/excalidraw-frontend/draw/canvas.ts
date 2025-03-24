import { eventNames } from "process";
import { Shape } from "./shape";

export type shapetype = {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
    strockColor: typeColor
} | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    clockDirection: boolean;
    strockColor: typeColor
} | {
    type: "line",
    movetoX: number,
    movetoY: number,
    linetoX: number,
    linetoY: number,
    strockColor: typeColor
} | {
    type: "pencil",
    movetoX: number,
    movetoY: number,
    linetoX: number,
    linetoY: number,
    strockColor: typeColor
} | {
    type: "text",
    content: string,
    x: number,
    y: number,
    size: number,
    fillColor: typeColor
}

type Point = {
    x: number;
    y: number;
};

export type TypeShape = "circle" | "rectangle" | "line" | "pencil" | "text" | "eraser";

export type typeColor = "#f7f9f9" | "#cb4335" | "#a569bd" | "#58d68d";

export class MakeCanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShape: shapetype[];
    private roomId: string;
    private socket: WebSocket;
    private shape: Shape;
    private clicked: boolean = false;
    private panClicked: boolean = false;
    private selectedShape: TypeShape;
    private strokeColor: typeColor = "#f7f9f9";
    private textarea: HTMLTextAreaElement;
    private startOffsetX: number = 0;
    private startOffsetY: number = 0;
    private currentOffsetX: number = 0;
    private currentOffsetY: number = 0;
    private panOffsetX: number;
    private panOffsetY: number;
    private scale: number;
    private scaleOffsetX: number;
    private scaleOffsetY: number;
    private mousePosX: number = 0;
    private mousePosY: number = 0;
    private viewportTopLeft: Point = { x: 0, y: 0 };
    private onZoomChange?: (scale: number) => void;

    private clientId: string = Math.random().toString(36).substr(2, 9);

    constructor(canvas: HTMLCanvasElement, roomId: string, textarea: HTMLTextAreaElement, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.strokeStyle = this.strokeColor;
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;

        this.scale = 1;
        this.scaleOffsetX = 0;
        this.scaleOffsetY = 0;

        this.panOffsetX = 0;
        this.panOffsetY = 0;

        this.selectedShape = "rectangle";
        this.shape = new Shape(this.ctx, this.panOffsetX, this.panOffsetY);
        this.shape.setShape(this.selectedShape);
        this.textarea = textarea;

        this.initTextarea();
        // this.init();
        this.initSocket();
        this.mousehandler();
    }

    init() {
        //get the existingShape from backend
    }

    initSocket() {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "CHAT") {
                    this.existingShape.push(parsedData.message);
                    this.redrawCanvas();
                }
            }
        }
    }

    initTextarea = () => {
        this.textarea.style.color = this.strokeColor;
        this.textarea.style.fontSize = "30px";
        this.textarea.style.font = "serif";
        this.textarea.style.height = "auto";
    }

    setTool = (tool: TypeShape) => {
        this.selectedShape = tool;
        this.shape.setShape(this.selectedShape);
    }

    setMousePos = (x: number, y: number) => {
        this.mousePosX = x;
        this.mousePosY = y;
    }

    zoomIn = () => {
        const zoom = 1.2; // Zoom in factor
        const mouseX = this.canvas.width / 2;  // Zoom center X
        const mouseY = this.canvas.height / 2; // Zoom center Y

        // Apply the same zoom logic as handleMouseWheel
        this.panOffsetX = mouseX - zoom * (mouseX - this.panOffsetX);
        this.panOffsetY = mouseY - zoom * (mouseY - this.panOffsetY);
        this.shape.setPanOffset(this.panOffsetX, this.panOffsetY);

        this.scale *= zoom;
        this.shape.setScale(this.scale);

        this.onZoomChange?.(this.getScale());

        this.redrawCanvas();
    }

    zoomOut = () => {
        const zoom = 0.8; // Zoom out factor
        const mouseX = this.canvas.width / 2;
        const mouseY = this.canvas.height / 2;

        this.panOffsetX = mouseX - zoom * (mouseX - this.panOffsetX);
        this.panOffsetY = mouseY - zoom * (mouseY - this.panOffsetY);
        this.shape.setPanOffset(this.panOffsetX, this.panOffsetY);

        this.scale *= zoom;
        this.shape.setScale(this.scale);

        this.onZoomChange?.(this.getScale());

        this.redrawCanvas();
    }

    getScale = () => {
        return Math.round(this.scale * 100);
    }

    setStrockColor = (strokeColor: typeColor) => {
        this.strokeColor = strokeColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.shape.setStrockColor(this.strokeColor);

        this.textarea.style.color = this.strokeColor;
    }

    setText() {
        this.shape.setText(this.textarea.value);
        this.textarea.style.height = "auto";
        this.textarea.style.height = `${this.textarea.scrollHeight}px`
    }

    setTextSize(textSize: number) {
        this.shape.setTextSize(textSize)
        this.textarea.style.fontSize = `${textSize * 15}px`
    }

    makeOffset() {
        let panX = this.currentOffsetX - this.startOffsetX;
        let panY = this.currentOffsetY - this.startOffsetY;
        this.panOffsetX = this.panOffsetX + panX;
        this.panOffsetY = this.panOffsetY + panY;
        this.shape.setPanOffset(this.panOffsetX, this.panOffsetY);

        this.redrawCanvas();

        console.log("{" + this.panOffsetX + ", " + this.panOffsetY + "}");
    }


    // A helper function to check if a point is inside a rectangle shape
    isPointInRectangle(point: { x: number; y: number }, shape: { x: number; y: number; width: number; height: number }): boolean {
        return (
            point.x >= shape.x &&
            point.x <= shape.x + shape.width &&
            point.y >= shape.y &&
            point.y <= shape.y + shape.height
        );
    }

    // A sample hit test for a circle
    isPointInCircle(point: { x: number; y: number }, shape: { x: number; y: number; radius: number }): boolean {
        const dist = Math.sqrt(Math.pow(point.x - shape.x, 2) + Math.pow(point.y - shape.y, 2));
        return dist <= shape.radius;
    }

    // General collision detection function for different shapes
    isShapeHitByEraser(shape: shapetype | null | undefined, eraserPoint: { x: number; y: number }): boolean {
        if(!shape) return false;
        
        // Transform eraser point to account for pan and scale
        const transformedPoint = {
            x: (eraserPoint.x - this.panOffsetX) / this.scale,
            y: (eraserPoint.y - this.panOffsetY) / this.scale
        };

        switch (shape.type) {
            case "rectangle":
                return this.isPointInRectangle(transformedPoint, shape);
            case "circle":
                return this.isPointInCircle(transformedPoint, shape);
            case "line":
            case "pencil": {
                // For lines, implement a more accurate line segment hit test
                const lineStart = { x: shape.movetoX, y: shape.movetoY };
                const lineEnd = { x: shape.linetoX, y: shape.linetoY };
                return this.isPointNearLine(transformedPoint, lineStart, lineEnd, 5 / this.scale); // 5 is the hit tolerance
            }
            case "text": {
                const textWidth = shape.content.length * shape.size * 10;
                const textHeight = shape.size * 15;
                return this.isPointInRectangle(transformedPoint, 
                    { x: shape.x, y: shape.y, width: textWidth, height: textHeight });
            }
            default:
                return false;
        }
    }

    // Add this new helper method for more accurate line hit testing
    isPointNearLine(point: Point, lineStart: Point, lineEnd: Point, tolerance: number): boolean {
        // Calculate the distance from point to line segment
        const A = point.x - lineStart.x;
        const B = point.y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }

        const dx = point.x - xx;
        const dy = point.y - yy;

        return Math.sqrt(dx * dx + dy * dy) <= tolerance;
    }

    // In your eraser mouse move handler:
    handleEraserMouseMove = (event: MouseEvent) => {
        // Get the current eraser point (you might need to adjust coordinates for canvas scale/translation)
        const eraserPoint = { x: event.clientX, y: event.clientY };

        // Filter out any shapes that the eraser touches
        this.existingShape = this.existingShape.filter(shape => {
            // If the eraser touches the shape, remove it (return false)
            return !this.isShapeHitByEraser(shape, eraserPoint);
        });

        // Redraw canvas after removal
        this.redrawCanvas();
    }

    handleMouseDown = (event: MouseEvent) => {
        console.log("clicked {" + event.clientX + ", " + event.clientY + "}");
        if (event.button === 1) {
            this.panClicked = true;
            this.startOffsetX = event.clientX;
            this.startOffsetY = event.clientY;
        } else {
            if (this.selectedShape != "text") {
                this.clicked = true;
            }
            this.shape.setStartVertex(event.clientX, event.clientY);
            if (this.selectedShape === "text") {
                this.textarea.style.top = `${event.offsetY}px`;
                this.textarea.style.left = `${event.offsetX}px`;
                this.textarea.value = "";
                this.textarea.style.position = "absolute"
                this.textarea.style.display = "block"
                // Delay focusing to ensure the textarea is rendered
                setTimeout(() => {
                    this.textarea.focus();
                }, 0);


            }
        }

    }

    handleMouseUp = (event: MouseEvent) => {
        if (event.button === 1) {
            this.currentOffsetX = event.clientX;
            this.currentOffsetY = event.clientY;
            this.makeOffset();
            this.panClicked = false;
        } else {
            if (this.selectedShape != "text") {
                this.clicked = false;
                this.shape.setCurrentVertex(event.clientX, event.clientY);
                const currentShape = this.shape.getShape() as shapetype;
                console.log("currentShape ", currentShape);
                this.existingShape.push(currentShape);

                this.redrawCanvas()
                this.socket.send(JSON.stringify({
                    type: "CHAT",
                    message: currentShape,
                    roomId: this.roomId
                }))
            }
        }


    }

    handleMouseMove = (event: MouseEvent) => {
        this.setMousePos(event.clientX, event.clientY);
        if (this.panClicked) {
            this.currentOffsetX = event.clientX;
            this.currentOffsetY = event.clientY;
            this.makeOffset();
            this.startOffsetX = event.clientX;
            this.startOffsetY = event.clientY;
        }
        else if (this.selectedShape === "eraser" && this.clicked) {
            this.handleEraserMouseMove(event);
        }
        else {
            if (this.clicked) {
                this.shape.setCurrentVertex(event.clientX, event.clientY);
                this.redrawCanvas();
                this.shape.makeShape();
                if (this.selectedShape === "pencil") {
                    const currentShape = this.shape.getShape() as shapetype;
                    console.log("currentShape ", currentShape);
                    this.existingShape.push(currentShape);
                    this.redrawCanvas()
                    this.socket.send(JSON.stringify({
                        type: "CHAT",
                        message: currentShape,
                        roomId: this.roomId
                    }))
                    this.shape.setStartVertex(event.clientX, event.clientY);
                }
            }
        }

    }

    addPoints = (p1: Point, p2: Point) => {
        return { x: p1.x + p2.x, y: p2.y + p2.y };
    }

    setViewportTopLeft = (point: Point) => {
        this.viewportTopLeft = {
            x: point.x,
            y: point.y
        }
    }

    handleMouseWheel = (event: WheelEvent) => {
        // Calculate zoom factor
        const zoom = 1 - event.deltaY / 500;
        // Get mouse coordinates relative to the canvas
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Adjust panOffset so that the point under the mouse remains stationary.
        // This formula comes from the idea:
        // newPanOffset = mousePos - zoom * (mousePos - currentPanOffset)
        this.panOffsetX = mouseX - zoom * (mouseX - this.panOffsetX);
        this.panOffsetY = mouseY - zoom * (mouseY - this.panOffsetY);
        this.shape.setPanOffset(this.panOffsetX, this.panOffsetY);

        // Update scale
        this.scale *= zoom;
        this.shape.setScale(this.scale);

        // Notify about zoom change
        this.onZoomChange?.(this.getScale());

        // Redraw with the new transformation
        this.redrawCanvas();
    }

    handleKeydown = (event: KeyboardEvent) => {
        if (this.selectedShape === "text") {
            if (event.key === "Enter") {
                this.setText();
                const currentShape = this.shape.getShape() as shapetype;
                console.log("currentShape ", currentShape);
                this.existingShape.push(currentShape);
                this.textarea.blur();
                this.textarea.style.display = "none";
                this.redrawCanvas()
                this.socket.send(JSON.stringify({
                    type: "CHAT",
                    message: currentShape,
                    roomId: this.roomId
                }))
            }
        }
    }

    handleTextareaSize = () => {
        this.textarea.style.height = "auto";
        this.textarea.style.height = `${this.textarea.scrollHeight}px`;
        this.textarea.style.width = "auto";
        this.textarea.style.width = `${this.textarea.scrollWidth}px`;
        this.textarea.style.overflow = "hidden";
    }

    mousehandler() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("wheel", this.handleMouseWheel)
        this.textarea.addEventListener("keydown", this.handleKeydown);
        this.textarea.addEventListener("input", this.handleTextareaSize);
    }

    redrawCanvas() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.panOffsetX, this.panOffsetY);
        this.ctx.scale(this.scale, this.scale);
        console.log(this.existingShape)
        this.existingShape
        .filter(shape => shape !== null && shape !== undefined)
        .map((s) => {
            switch (s.type) {
                case "circle": {
                    this.ctx.strokeStyle = s.strockColor;
                    this.ctx?.beginPath();
                    this.ctx?.arc(s.x, s.y, s.radius, 0, 2 * Math.PI, true);
                    this.ctx?.stroke();
                    this.ctx.closePath();
                    break;
                }
                case "rectangle": {
                    this.ctx.strokeStyle = s.strockColor;
                    this.ctx.strokeRect(s.x, s.y, s.width, s.height);
                    break;
                }
                case "line": {
                    this.ctx.strokeStyle = s.strockColor;
                    this.ctx.beginPath();
                    this.ctx.moveTo(s.movetoX, s.movetoY);
                    this.ctx.lineTo(s.linetoX, s.linetoY);
                    // Draw the Path
                    this.ctx.stroke();
                    this.ctx.closePath();
                    break;
                }
                case "pencil": {
                    this.ctx.strokeStyle = s.strockColor;
                    this.ctx.beginPath();
                    this.ctx.moveTo(s.movetoX, s.movetoY);
                    this.ctx.lineTo(s.linetoX, s.linetoY);
                    // Draw the Path
                    this.ctx.stroke();
                    this.ctx.closePath();
                    break;
                }
                case "text": {
                    this.ctx.fillStyle = s.fillColor;
                    if (this.ctx) {
                        this.ctx.font = `${s.size * 15}px serif`;
                    }
                    this.ctx.textBaseline = "top";
                    const textOffset = s.size * 15 * 0.323;
                    this.ctx.fillText(s.content, s.x, s.y + textOffset);
                    break;
                }
            }
        })
        this.ctx.restore();
    }

    setZoomChangeCallback(callback: (scale: number) => void) {
        this.onZoomChange = callback;
    }

}