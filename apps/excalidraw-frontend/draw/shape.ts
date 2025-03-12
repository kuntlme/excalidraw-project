type TypeShape = "circle" | "rectangle";

export class Shape {
    private ctx: CanvasRenderingContext2D | null = null;
    private typeShape: TypeShape = "rectangle";
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;


    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    setShape(shape: TypeShape) {
        this.typeShape = shape;
        console.log(this.typeShape)
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

    makeShape() {
        switch (this.typeShape) {
            case "rectangle": {
                this.makeRect();
                break;
            }
            case "circle": {
                this.makeCircle();
                break;
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

    getShape() {
        switch (this.typeShape) {
            case "circle": {
                let centerX = (this.currentX + this.startX) / 2;
                let centerY = (this.currentY + this.startY) / 2;
                let radius = Math.abs(centerX - this.startX);
                return ({
                    type: "circle",
                    x: centerX,
                    y: centerY,
                    radius: radius,
                    startAngle: 0,
                    endAngle: 2 * Math.PI,
                    clockDirection: true
                })
                break;
            }
            case "rectangle": {
                return ({
                    type: "rectangle",
                    x: this.startX,
                    y: this.startY,
                    width: this.currentX - this.startX,
                    height: this.currentY - this.startY
                })
                break;
            }
        }

    }

}