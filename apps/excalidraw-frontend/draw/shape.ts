import { shapetype, typeColor, TypeShape } from "./canvas";


export class Shape {
    private ctx: CanvasRenderingContext2D | null = null;
    private typeShape: TypeShape = "rectangle";
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;
    private text: string = "";
    private textSize: number = 2;
    private strockColor: typeColor = "#f7f9f9";


    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    setShape(shape: TypeShape) {
        this.typeShape = shape;
        console.log(this.typeShape)
    }

    setStrockColor(strockColor: typeColor) {
        this.strockColor = strockColor;
    }

    setStartVertex(vertexX: number, vertexY: number) {
        this.startX = vertexX;
        this.startY = vertexY;
    }

    setCurrentVertex(vertexX: number, vertexY: number) {
        this.currentX = vertexX;
        this.currentY = vertexY;
        // this.clicked = false;
    }

    setText(text: string) {
        this.text = text;
    }

    setTextSize(textSize: number){
        this.textSize = textSize;
    }

    makeShape() {
        if (this.ctx) {
            this.ctx.strokeStyle = this.strockColor;
        }
        switch (this.typeShape) {
            case "rectangle": {
                this.makeRect();
                break;
            }
            case "circle": {
                this.makeCircle();
                break;
            }
            case "line": {
                this.makeLine();
                break;

            }
            case "pencil": {
                this.makeLine();
                break;
            }
            case "text": {
                this.makeText();
            }
        }
    }

    makeRect() {
        let width = this.currentX - this.startX;
        let height = this.currentY - this.startY;
        this.ctx?.strokeRect(this.startX, this.startY, width, height);
    }

    makeCircle() {
        let centerX = (this.currentX + this.startX) / 2;
        let centerY = (this.currentY + this.startY) / 2;
        let radius = Math.abs(centerX - this.startX);
        this.ctx?.beginPath();
        this.ctx?.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        this.ctx?.stroke();
        this.ctx?.closePath();
    }

    makeLine() {
        this.ctx?.beginPath();
        this.ctx?.moveTo(this.startX, this.startY);
        this.ctx?.lineTo(this.currentX, this.currentY);
        // Draw the Path
        this.ctx?.stroke();
        this.ctx?.closePath();
    }

    makeText() {
        if (this.ctx) {
            this.ctx.font = `${this.textSize * 15}px serif`;
            this.ctx.textBaseline = "top";
        }
        const textOffset = this.textSize * 15 * 0.323;
        this.ctx?.fillText(this.text, this.currentX, this.currentY + textOffset);
    }

    getShape() {
        let shapObject: shapetype | null = null;
        switch (this.typeShape) {
            case "circle": {
                let centerX = (this.currentX + this.startX) / 2;
                let centerY = (this.currentY + this.startY) / 2;
                let radius = Math.abs(centerX - this.startX);
                shapObject = {
                    type: "circle",
                    x: centerX,
                    y: centerY,
                    radius: radius,
                    startAngle: 0,
                    endAngle: 2 * Math.PI,
                    clockDirection: true,
                    strockColor: this.strockColor
                }
                break;
            }
            case "rectangle": {
                shapObject = {
                    type: "rectangle",
                    x: this.startX,
                    y: this.startY,
                    width: this.currentX - this.startX,
                    height: this.currentY - this.startY,
                    strockColor: this.strockColor
                }
                break;
            }
            case "line": {
                shapObject = {
                    type: "line",
                    movetoX: this.startX,
                    movetoY: this.startY,
                    linetoX: this.currentX,
                    linetoY: this.currentY,
                    strockColor: this.strockColor
                }
                break;
            }
            case "pencil": {
                shapObject = {
                    type: "pencil",
                    movetoX: this.startX,
                    movetoY: this.startY,
                    linetoX: this.currentX,
                    linetoY: this.currentY,
                    strockColor: this.strockColor
                }
                break;
            }
            case "text": {
                shapObject = {
                    type: "text",
                    content: this.text,
                    x: this.startX,
                    y: this.startY,
                    size: this.textSize,
                    fillColor: this.strockColor
                }
                break;
            }
        }
        return shapObject;

    }

}