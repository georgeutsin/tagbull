import React, { Component } from "react";
import { IRect } from "../../Interfaces";
import {
    calculateImageDimensions,
    calculateImageLocation,
    MouseAdaptor,
    TouchAdaptor,
} from "../../Utils";

interface IBaseCanvasState {
    windowWidth: number;
    image?: HTMLImageElement;
}

interface IBaseCanvasProps {
    media_url: string;
    instructionDims: DOMRect;
    actionDims: DOMRect;
    viewDims: DOMRect;
    handleStartCB(evt: any): any;
    handleMoveCB(evt: any): any;
    handleEndCB(evt: any): any;
    drawCB(ctv: CanvasRenderingContext2D): any;
    setImageCB(imageBounds: IRect, image?: HTMLImageElement): any;
}

class BaseCanvas extends Component<IBaseCanvasProps, IBaseCanvasState> {
    private ctx: CanvasRenderingContext2D | null;
    private mouseAdaptor?: MouseAdaptor;
    private touchAdaptor?: TouchAdaptor;
    private canvasWidth: number;
    private canvasHeight: number;
    private imageBounds: IRect;
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: any) {
        super(props);

        const image = new Image();
        image.src = this.props.media_url;
        image.onload = () => {
            this.setState({
                image,
            }, () => {
                this.updateImageBounds();
            });
        };
        // Don't call this.setState() here!
        this.state = {
            windowWidth: window.innerWidth,
        };

        this.ctx = null;
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.canvasHeight = 0;
        this.canvasWidth = 0;
        this.imageBounds = { x: 0, y: 0, w: 0, h: 0 };
        this.canvasRef = React.createRef<HTMLCanvasElement>();

        window.addEventListener("resize", this.windowResizeListener.bind(this));
        window.addEventListener("orientationchange", this.windowResizeListener.bind(this));
    }

    public windowResizeListener() {
        this.setState({ windowWidth: window.innerWidth }, () => {
            this.updateImageBounds();
        });
    }

    public componentDidMount() {
        if (this.canvasRef.current) { // Shouldn't be null, since its declared in the constructor.
            this.ctx = this.canvasRef.current.getContext("2d");
            const el: any = this.canvasRef.current;

            // Add touch listeners.
            this.mouseAdaptor = new MouseAdaptor(el);
            this.touchAdaptor = new TouchAdaptor(el);
            el.addEventListener("ptrstart", this.handleStart, false);
            el.addEventListener("ptrmove", this.handleMove, false);
            el.addEventListener("ptrend", this.handleEnd, false);

            this.updateImageBounds();
        }
    }

    public componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        const el: any = document.getElementById("tbCanvas");
        if (this.mouseAdaptor !== undefined) {
            this.mouseAdaptor.removeListeners(el);
        }
        if (this.touchAdaptor !== undefined) {
            this.touchAdaptor.removeListeners(el);
        }
        el.removeEventListener("ptrstart", this.handleStart, false);
        el.removeEventListener("ptrmove", this.handleMove, false);
        el.removeEventListener("ptrend", this.handleEnd, false);

        window.removeEventListener("resize", this.windowResizeListener);
    }

    public componentDidUpdate() {
        this.updateImageBounds();
        this.props.setImageCB(this.imageBounds, this.state.image);
        this.draw();
    }

    public updateImageBounds() {
        if (this.state.image && this.ctx) {
            const maxDimensions = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
            const originalImageDimensions = { width: this.state.image.width, height: this.state.image.height };
            const imageDimensions = calculateImageDimensions(maxDimensions, originalImageDimensions);
            // Center the image on the canvas.
            const imageLocation = calculateImageLocation(maxDimensions, imageDimensions);
            this.imageBounds = {
                x: imageLocation.x,
                y: imageLocation.y,
                w: imageDimensions.width,
                h: imageDimensions.height,
            };
            this.draw();
        }
    }

    public handleStart(evt: any) {
        this.draw();
        this.props.handleStartCB(evt);
    }

    public handleMove(evt: any) {
        this.draw();
        this.props.handleMoveCB(evt);
    }

    public handleEnd(evt: any) {
        this.draw();
        this.props.handleEndCB(evt);
    }

    public updateCanvasDims() {
        const parentDims = this.props.viewDims;
        if (window.innerHeight < 600) {
            this.canvasHeight = parentDims.height;
            this.canvasWidth = parentDims.width / 2;
        } else {
            this.canvasHeight = parentDims.height
                - this.props.instructionDims.height
                - this.props.actionDims.height;
            this.canvasHeight = this.canvasHeight > 0 ? this.canvasHeight : 0;
            this.canvasWidth = parentDims.width;
        }
    }

    public draw() {
        if (this.ctx === null) {
            return;
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.state.image) {
            const bounds = this.imageBounds;
            this.ctx.drawImage(this.state.image, bounds.x, bounds.y, bounds.w, bounds.h);
        }

        this.props.drawCB(this.ctx);
    }

    public render() {
        this.updateCanvasDims();
        return <canvas
            className="tagbullCanvas"
            ref={this.canvasRef}
            width={this.canvasWidth}
            height={this.canvasHeight}>
            Your browser does not support canvas element.
            </canvas>;
    }
}

export default BaseCanvas;
