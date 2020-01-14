import React, { Component } from "react";
import { IRect } from "../../Interfaces";
import {
    calculateImageDimensions,
    calculateImageLocation,
} from "../../Utils/CanvasCalcs";

interface ISoftCropCanvasState { }

interface ISoftCropCanvasProps {
    image?: HTMLImageElement;
    rect: IRect;
    height: number;
    width: number;
    id: number;
    clickedCallback: any;
    selected: boolean;
}

class SoftCropCanvas extends Component<ISoftCropCanvasProps, ISoftCropCanvasState> {
    private ctx: CanvasRenderingContext2D | null;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private imageBounds: IRect;

    constructor(props: any) {
        super(props);
        // Don't call this.setState() here!
        this.imageBounds = {
            x: 0,
            y: 0,
            h: 0,
            w: 0,
        };

        this.ctx = null;
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvasClicked = this.canvasClicked.bind(this);
    }

    public componentDidMount() {
        if (this.canvasRef.current) { // Shouldn't be null, since its declared in the constructor.
            this.ctx = this.canvasRef.current.getContext("2d");
            this.updateImageBounds();
        }
    }

    public componentDidUpdate() {
        this.updateImageBounds();
    }

    public updateImageBounds() {
        if (this.props.image && this.ctx) {
            const maxDimensions = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
            const originalImageDimensions = { width: this.props.image.width, height: this.props.image.height };
            const imageDimensions = calculateImageDimensions(maxDimensions, originalImageDimensions);
            // Center the image on the canvas.
            const imageLocation = calculateImageLocation(maxDimensions, imageDimensions);
            // TODO Figure out if the images should be arranged horizontally or vertically

            this.imageBounds = {
                x: imageLocation.x,
                y: imageLocation.y,
                w: imageDimensions.width,
                h: imageDimensions.height,
            };

            this.draw();
        }
    }

    public rectToCanvas(rect: IRect, imageBounds: IRect, image?: HTMLImageElement) {
        if (image) {
            const scale = image.width / imageBounds.w;

            return {
                x: imageBounds.x + rect.x / scale,
                y: imageBounds.y + rect.y / scale,
                w: rect.w / scale,
                h: rect.h / scale,
            };
        }

        return { x: 0, y: 0, w: 0, h: 0 };
    }

    public canvasClicked() {
        this.props.clickedCallback(this.props.id);
    }

    public draw() {
        if (this.ctx === null) {
            return;
        }

        this.ctx.save();
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (this.props.image) {
            const bounds = this.imageBounds;
            this.ctx.drawImage(this.props.image, bounds.x, bounds.y, bounds.w, bounds.h);

        }

        const rect = this.rectToCanvas(this.props.rect, this.imageBounds, this.props.image);
        if (rect.w !== 0 || rect.h !== 0) {
            this.ctx.beginPath();
            this.ctx.rect(rect.x, rect.y, rect.w, rect.h);
            this.ctx.strokeStyle = "#00FF00";
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }

        if (this.props.selected) {
            this.ctx.globalAlpha = 0.7;
            this.ctx.beginPath();
            this.ctx.rect(
                this.imageBounds.x + 5, this.imageBounds.y + 5,
                this.imageBounds.w - 10, this.imageBounds.h - 10);
            this.ctx.strokeStyle = "#00CC00";
            this.ctx.lineWidth = 10;
            this.ctx.stroke();
            this.ctx.closePath();

            this.ctx.fillStyle = "#00CC00";
            this.ctx.fillRect(
                this.imageBounds.x + this.imageBounds.w - 70,
                this.imageBounds.y + this.imageBounds.h - 70,
                60, 60);

            this.ctx.globalAlpha = 1;
            this.ctx.font = "60px Arial";
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.fillText("\u2714",
                this.imageBounds.x + this.imageBounds.w - 60,
                this.imageBounds.y + this.imageBounds.h - 10);

            this.ctx.restore();
        }
    }

    public render() {
        return <div style={{ height: this.props.height, width: this.props.width, display: "inline-block" }}>
            <canvas
                ref={this.canvasRef}
                width={this.props.width - 10}
                height={this.props.height - 10}
                style={{ padding: "5px" }}
                onClick={this.canvasClicked}>
                Your browser does not support canvas element.
                </canvas>
            {/* TODO: make a second canvas that overlays this one,
                 contains the softcrop and the checked/unchecked overlay */}
        </div>;
    }
}

export default SoftCropCanvas;
