// TODO: delete this once we confirm 4 point bb is good
// NOT SUPPORTED
import React, { Component } from "react";
import { IRect } from "../../Interfaces";
import {
    calculateImageDimensions,
    calculateImageLocation,
    isTouchInBounds,
    MouseAdaptor,
    rectToCanvasCoords,
    TouchAdaptor,
    touchToImageCoords,
    windowTouchToCanvasCoords,
} from "../../Utils";
import { ActivityAction, DoneButtonComponent } from "../UIElements";

interface IBoundingBoxState {
    rect: IRect;
    windowWidth: number;
    image?: HTMLImageElement;
    imageBounds: IRect;

    currentStage: number;
    hasInput: boolean;
}

interface IBoundingBoxProps {
    activityConfig: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

class BoundingBox extends Component<IBoundingBoxProps, IBoundingBoxState> {
    private ctx: CanvasRenderingContext2D | null;
    private mouseAdaptor?: MouseAdaptor;
    private touchAdaptor?: TouchAdaptor;
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;
    private handlers: any;
    private handlerInUse: string;
    private prevTouchImageCoords: any;
    private numberOfStages: number;

    constructor(props: any) {
        super(props);

        this.numberOfStages = 1; // Change to 4 once we have point by point.
        const image = new Image();
        image.src = this.props.activityConfig.media_url;
        image.onload = () => {
            this.setState({
                image,
            }, () => {
                this.updateImageBounds();
            });
        };
        // Don't call this.setState() here!
        this.state = {
            rect: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
            },
            imageBounds: {
                x: 0,
                y: 0,
                h: 0,
                w: 0,
            },
            windowWidth: window.innerWidth,
            hasInput: false,
            currentStage: 0,
        };

        this.ctx = null;
        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.resetInput = this.resetInput.bind(this);

        this.handlerInUse = "";
        this.handlers = {
            "TL": (touch: any) => {
                this.state.rect.w += this.state.rect.x - touch.x;
                this.state.rect.h += this.state.rect.y - touch.y;
                this.state.rect.x = touch.x;
                this.state.rect.y = touch.y;
            },
            "TR": (touch: any) => {
                this.state.rect.w = -(this.state.rect.x - touch.x);
                this.state.rect.h += this.state.rect.y - touch.y;
                this.state.rect.y = touch.y;
            },
            "BL": (touch: any) => {
                this.state.rect.w += this.state.rect.x - touch.x;
                this.state.rect.h = -(this.state.rect.y - touch.y);
                this.state.rect.x = touch.x;
            },
            "BR": (touch: any) => {
                this.state.rect.w = -(this.state.rect.x - touch.x);
                this.state.rect.h = -(this.state.rect.y - touch.y);
            },
            "draw": (touch: any) => {
                this.state.rect.w = touch.x - this.state.rect.x;
                this.state.rect.h = touch.y - this.state.rect.y;
            },
            "drag": (touch: any) => {
                const deltaX = touch.x - this.prevTouchImageCoords.x;
                const deltaY = touch.y - this.prevTouchImageCoords.y;
                this.state.rect.x += deltaX;
                this.state.rect.y += deltaY;
                if (this.state.rect.x < 0) {
                    this.state.rect.x = 0;
                }
                if (this.state.rect.y < 0) {
                    this.state.rect.y = 0;
                }
                if (this.state.image) {
                    if (this.state.rect.x + this.state.rect.w > this.state.image.width) {
                        this.state.rect.x -= (this.state.rect.x + this.state.rect.w) - this.state.image.width;
                    }
                    if (this.state.rect.y + this.state.rect.h > this.state.image.height) {
                        this.state.rect.y -= (this.state.rect.y + this.state.rect.h) - this.state.image.height;
                    }
                }
            },
            "": (touch: any) => {
                return;
            },
        };

        this.prevTouchImageCoords = {};
        window.addEventListener("resize", this.windowResizeListener.bind(this));
        window.addEventListener("orientationchange", this.windowResizeListener.bind(this));

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
    }

    public windowResizeListener() {
        this.setState({ windowWidth: window.innerWidth }, () => {
            this.updateImageBounds();
        });
    }

    public doneButtonClicked() {
        this.setState({
            hasInput: false,
            currentStage: this.state.currentStage + 1,
        }, () => {
            if (this.state.currentStage === this.numberOfStages) {
                this.props.notifyActivityComplete({
                    top_left_x: Math.floor(this.state.rect.x),
                    top_left_y: Math.floor(this.state.rect.y),
                    bottom_right_x: Math.floor(this.state.rect.x + this.state.rect.w),
                    bottom_right_y: Math.floor(this.state.rect.y + this.state.rect.h),
                    label: "object",
                });
            }
        });
    }

    public componentDidMount() {
        // Add touch listeners.
        const el: any = document.getElementById("boundingBoxCanvas");
        this.ctx = el.getContext("2d");
        this.mouseAdaptor = new MouseAdaptor(el);
        this.touchAdaptor = new TouchAdaptor(el);
        el.addEventListener("ptrstart", this.handleStart, false);
        el.addEventListener("ptrmove", this.handleMove, false);
        el.addEventListener("ptrend", this.handleEnd, false);

        this.updateImageBounds();
    }

    public componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        const el: any = document.getElementById("boundingBoxCanvas");
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
        this.draw();
    }

    public updateImageBounds() {
        if (this.state.image && this.ctx) {
            const maxDimensions = { width: this.ctx.canvas.width, height: this.ctx.canvas.height };
            const originalImageDimensions = { width: this.state.image.width, height: this.state.image.height };
            const imageDimensions = calculateImageDimensions(maxDimensions, originalImageDimensions);
            // Center the image on the canvas.
            const imageLocation = calculateImageLocation(maxDimensions, imageDimensions);
            this.setState({
                imageBounds: {
                    x: imageLocation.x,
                    y: imageLocation.y,
                    w: imageDimensions.width,
                    h: imageDimensions.height,
                },
            }, () => {
                this.draw();
            });
        }
    }

    public normalizeRect() {
        const rect = this.state.rect;
        if (rect.w < 0) {
            rect.x += rect.w;
            rect.w = -rect.w;
        }
        if (rect.h < 0) {
            rect.y += rect.h;
            rect.h = -rect.h;
        }
        this.setState({ rect });
    }

    public rectExists(): boolean {
        return this.state.rect.w !== 0 && this.state.rect.h !== 0;
    }

    public resetInput() {
        const rect = { x: 0, y: 0, w: 0, h: 0 };
        this.setState({
            rect,
            hasInput: false,
        });
    }

    public getTouchOnHandler(touch: any): string {
        if (!isTouchInBounds(touch, this.state.imageBounds)) {
            return "";
        }
        const handlerPadding = 40;
        const rect = this.state.rect;
        const imageCoords = touchToImageCoords(touch, this.state.imageBounds, this.state.image);

        if (this.rectExists()) {
            if (Math.abs(imageCoords.x - rect.x) <= handlerPadding) {
                if (Math.abs(imageCoords.y - rect.y) <= handlerPadding) {
                    return "TL";
                } else if (Math.abs(imageCoords.y - (rect.y + rect.h)) <= handlerPadding) {
                    return "BL";
                }
            }

            if (Math.abs(imageCoords.x - (rect.x + rect.w)) <= handlerPadding) {
                if (Math.abs(imageCoords.y - rect.y) <= handlerPadding) {
                    return "TR";
                } else if (Math.abs(imageCoords.y - (rect.y + rect.h)) <= handlerPadding) {
                    return "BR";
                }
            }

            if (isTouchInBounds(imageCoords, rect)) {
                return "drag";
            }
        }

        return "draw";
    }

    public handleStart(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;
        this.handlerInUse = "";
        this.normalizeRect();
        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (this.handlerInUse === "") {
                this.handlerInUse = this.getTouchOnHandler(touch);
            }
            if (isTouchInBounds(touch, this.state.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.state.imageBounds, this.state.image);
                this.prevTouchImageCoords = imageCoords;
                if (this.handlerInUse === "draw") {
                    this.setState({ rect: { x: imageCoords.x, y: imageCoords.y, w: 0, h: 0 } });
                }
            }
        }
    }

    public handleMove(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;

        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (touch.id >= 0 && isTouchInBounds(touch, this.state.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.state.imageBounds, this.state.image);
                this.handlers[this.handlerInUse](imageCoords);
                this.prevTouchImageCoords = imageCoords;
                this.draw();
            } else {
                console.log("can't figure out which touch to continue " + touch.id);
            }
        }
    }

    public handleEnd(evt: any) {
        if (this.handlerInUse !== "") {
            this.setState({ hasInput: true });
        }
    }

    public draw() {
        if (this.ctx === null) {
            return;
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (this.state.image) {
            const bounds = this.state.imageBounds;
            this.ctx.drawImage(this.state.image, bounds.x, bounds.y, bounds.w, bounds.h);
        }

        const rect = rectToCanvasCoords(this.state.rect, this.state.imageBounds, this.state.image);
        if (rect.w !== 0 || rect.h !== 0) {
            this.ctx.beginPath();
            this.ctx.rect(rect.x, rect.y, rect.w, rect.h);
            this.ctx.strokeStyle = "#00FF00";
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.closePath();

            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.setLineDash([]);
            this.ctx.lineWidth = 4;

            // TL
            this.drawHandle(rect.x, rect.y);
            // TR
            this.drawHandle(rect.x + rect.w, rect.y);
            // BR
            this.drawHandle(rect.x + rect.w, rect.y + rect.h);
            // BL
            this.drawHandle(rect.x, rect.y + rect.h);
        }
    }

    public drawHandle(x: number, y: number) {
        if (this.ctx === null) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    public render() {
        // Calculate canvas height given the elements on the page.
        let canvasHeight = 0;
        let canvasWidth = 0;
        if (this.view !== null && this.activityInstruction !== null && this.activityAction !== null) {
            const parentDims = this.view.getBoundingClientRect();
            if (window.innerHeight < 600) {
                canvasHeight = parentDims.height;
                canvasWidth = parentDims.width / 2;
            } else {
                const instructionDims = this.activityInstruction.getBoundingClientRect();
                const actionDims = this.activityAction.getBoundingClientRect();
                canvasHeight = parentDims.height - instructionDims.height - actionDims.height;
                canvasHeight = canvasHeight > 0 ? canvasHeight : 0;
                canvasWidth = parentDims.width;
            }
        }

        const doneButtonHeight = 70;
        return <div style={{ height: "100%", width: "100%" }}>
            <div
                style={{ height: `calc(100% - ${10 + 20}px)`, width: "100%" }}
                ref={(divElement) => this.view = divElement}
                id="view">
                <div
                    ref={(divElement) => this.activityInstruction = divElement}
                    id="activityInstruction"
                    className="activityInstruction">
                    <div className="question">
                        Please draw a <b>box</b> around the <b>{this.props.activityConfig.category}</b>
                    </div>
                    <div className="help">?</div>
                    <div style={{ clear: "both" }}></div>
                </div>
                <canvas
                    className="tagbullCanvas"
                    id="boundingBoxCanvas"
                    width={canvasWidth}
                    height={canvasHeight}>
                    Your browser does not support canvas element.
                </canvas>
                <ActivityAction
                    ref={(divElement: any) => this.activityAction = divElement}>
                    <div className="resetButtonContainer">
                        <button className="resetButton" onClick={this.resetInput}> Reset </button>
                        <div style={{ height: "5em" }}></div>
                    </div>
                    <DoneButtonComponent
                        height={doneButtonHeight}
                        enabled={this.state.hasInput && !this.props.disabled}
                        onClick={this.doneButtonClicked}>
                    </DoneButtonComponent>
                </ActivityAction>
                <div style={{ clear: "both" }}></div>
            </div>
        </div>;
    }
}

export default BoundingBox;
