import React, { Component } from "react";
import { IBoundingBox, IRect } from "../../Interfaces";
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
import { ActivityAction, ActivityInstruction, DoneButtonComponent, HelpButtonComponent } from "../UIElements";

interface IBoundingBoxTapState {
    windowWidth: number;
    image?: HTMLImageElement;
    imageBounds: IRect;

    stepClassName: string;

    currentStage: number;
    hasInput: boolean;
}

interface IBoundingBoxTapProps {
    activity: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

const INSTRUCTION = ["leftmost", "topmost", "rightmost", "bottommost"];

class BoundingBoxTap extends Component<IBoundingBoxTapProps, IBoundingBoxTapState> {
    private ctx: CanvasRenderingContext2D | null;
    private mouseAdaptor?: MouseAdaptor;
    private touchAdaptor?: TouchAdaptor;
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;
    private numberOfStages: number;
    private objBounds: IBoundingBox;
    private touchStage: number;
    private activityBodyWidth: number;
    private activityBodyHeight: number;

    constructor(props: any) {
        super(props);

        this.numberOfStages = 4;
        this.touchStage = -1;
        const image = new Image();
        image.src = this.props.activity.config.media_url;
        image.onload = () => {
            this.setState({
                image,
            }, () => {
                this.updateImageBounds();
                this.objBounds.max_x = 1;
                this.objBounds.max_y = 1;
            });
        };
        // Don't call this.setState() here!
        this.state = {
            imageBounds: { x: 0, y: 0, w: 0, h: 0 },
            windowWidth: window.innerWidth,
            hasInput: false,
            currentStage: 0,
            stepClassName: "",
        };

        this.ctx = null;
        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.onInstructionResize = this.onInstructionResize.bind(this);
        this.objBounds = { max_x: 0, max_y: 0, min_x: 0, min_y: 0 };
        this.activityBodyHeight = 0;
        this.activityBodyWidth = 0;

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
        if (this.state.currentStage === this.numberOfStages) {
            this.props.notifyActivityComplete({
                min_x: this.objBounds.min_x,
                min_y: this.objBounds.min_y,
                max_x: this.objBounds.max_x,
                max_y: this.objBounds.max_y,
            });
        }
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

    public rectFromObjBounds() {
        if (this.state.image) {
            return {
                x: this.objBounds.min_x * this.state.image.width,
                y: this.objBounds.min_y * this.state.image.height,
                w: (this.objBounds.max_x - this.objBounds.min_x) * this.state.image.width,
                h: (this.objBounds.max_y - this.objBounds.min_y) * this.state.image.height,
            };
        }

        return { x: 0, y: 0, w: 0, h: 0 };
    }

    public withinDelta(line1: number, line2: number, delta: number) {
        return Math.abs(line1 - line2) < delta;
    }

    public nextTouchStage(touch: any): number {
        if (this.state.image && this.state.currentStage >= this.numberOfStages) {
            const xPos = touch.x / this.state.image.width;
            const yPos = touch.y / this.state.image.height;
            const delta = 0.05;

            if (this.withinDelta(this.objBounds.min_x, xPos, delta)) {
                return 0;
            } else if (this.withinDelta(this.objBounds.min_y, yPos, delta)) {
                return 1;
            } else if (this.withinDelta(this.objBounds.max_x, xPos, delta)) {
                return 2;
            } else if (this.withinDelta(this.objBounds.max_y, yPos, delta)) {
                return 3;
            }
        } else {
            return this.state.currentStage;
        }
        return -1;
    }

    public normalizeObjBounds() {
        if (this.objBounds.min_x > this.objBounds.max_x) {
            [this.objBounds.min_x, this.objBounds.max_x] = [this.objBounds.max_x, this.objBounds.min_x];
        }

        if (this.objBounds.min_y > this.objBounds.max_y) {
            [this.objBounds.min_y, this.objBounds.max_y] = [this.objBounds.max_y, this.objBounds.min_y];
        }
    }

    public moveObjBounds(touch: any, touchStage: number) {
        if (this.state.image) {
            const xPos = touch.x / this.state.image.width;
            const yPos = touch.y / this.state.image.height;

            switch (touchStage) {
                case 0: // Leftmost
                    this.objBounds.min_x = xPos;
                    break;
                case 1: // Topmost
                    this.objBounds.min_y = yPos;
                    break;
                case 2: // Rightmost
                    this.objBounds.max_x = xPos;
                    break;
                case 3: // Bottommost
                    this.objBounds.max_y = yPos;
                    break;
                default:
            }
        }
    }

    public onInstructionResize(width: number, height: number) {
        this.updateActivityBodyDims();
        this.windowResizeListener();
    }

    public handleStart(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;
        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (isTouchInBounds(touch, this.state.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.state.imageBounds, this.state.image);
                this.touchStage = this.nextTouchStage(imageCoords);
                this.moveObjBounds(imageCoords, this.touchStage);
            }
        }
        this.draw();
    }

    public handleMove(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;

        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (touch.id >= 0 && isTouchInBounds(touch, this.state.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.state.imageBounds, this.state.image);
                this.moveObjBounds(imageCoords, this.touchStage);
            } else {
                console.log("can't figure out which touch to continue " + touch.id);
            }
        }
        this.draw();
    }

    public handleEnd(evt: any) {
        if (this.touchStage !== -1) {
            this.touchStage = -1;
            if (this.state.currentStage === this.numberOfStages - 1) {
                this.normalizeObjBounds();
                this.setState({ hasInput: true });
            }
            if (this.state.currentStage < this.numberOfStages) {
                this.setState({
                    currentStage: this.state.currentStage + 1,
                    stepClassName: "",
                }, () => {
                    this.setState({ stepClassName: "runSlideIn"});
                });
            }
        }

        this.draw();
    }

    public draw() {
        if (this.ctx === null) {
            return;
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const objRect = this.rectFromObjBounds();
        const rect = rectToCanvasCoords(objRect, this.state.imageBounds, this.state.image);

        if (this.state.image) {
            const bounds = this.state.imageBounds;
            this.ctx.drawImage(this.state.image, bounds.x, bounds.y, bounds.w, bounds.h);

            this.ctx.globalAlpha = 0.6;
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);

            this.ctx.globalAlpha = 1.0;
            this.ctx.drawImage(this.state.image,
                objRect.x, objRect.y,
                Math.max(1, Math.floor(objRect.w)), Math.max(1, Math.floor(objRect.h)), // Support firefox
                rect.x, rect.y,
                Math.max(1, Math.floor(rect.w)), Math.max(1, Math.floor(rect.h))); // Support firefox

            switch (this.state.currentStage) {
                case 0: // Leftmost
                    this.drawVerticalLine(rect.x);
                    break;
                case 1: // Topmost
                    this.drawHorizontalLine(rect.y);
                    break;
                case 2: // Rightmost
                    this.drawVerticalLine(rect.x + rect.w);
                    break;
                case 3: // Bottommost
                    this.drawHorizontalLine(rect.y + rect.h);
                    break;
                case 4:
                    this.drawVerticalLine(rect.x);
                    this.drawHorizontalLine(rect.y);
                    this.drawVerticalLine(rect.x + rect.w);
                    this.drawHorizontalLine(rect.y + rect.h);
                    break;
                default:
                    console.log("done");
            }
        }
    }

    public drawVerticalLine(x: number) {
        const bounds = this.state.imageBounds;
        if (this.state.image && this.ctx && x !== bounds.x && x !== bounds.x + bounds.w) {
            this.ctx.strokeStyle = "#DDDDDD";
            this.ctx.beginPath();
            this.ctx.moveTo(x, bounds.y);
            this.ctx.lineTo(x, bounds.y + bounds.h);
            this.ctx.stroke();
        }
    }

    public drawHorizontalLine(y: number) {
        const bounds = this.state.imageBounds;
        if (this.state.image && this.ctx && y !== bounds.y && y !== bounds.y + bounds.h) {
            this.ctx.strokeStyle = "#DDDDDD";
            this.ctx.beginPath();
            this.ctx.moveTo(bounds.x, y);
            this.ctx.lineTo(bounds.x + bounds.w, y);
            this.ctx.stroke();
        }
    }

    public updateActivityBodyDims() {
        this.activityBodyHeight = 0;
        this.activityBodyWidth = 0;
        if (this.view !== null && this.activityInstruction !== null && this.activityAction !== null) {
            const parentDims = this.view.getBoundingClientRect();
            if (window.innerHeight < 600) {
                this.activityBodyHeight = parentDims.height;
                this.activityBodyWidth = parentDims.width / 2;
            } else {
                const instructionDims = this.activityInstruction.getBoundingClientRect();
                const actionDims = this.activityAction.getBoundingClientRect();
                this.activityBodyHeight = parentDims.height - instructionDims.height - actionDims.height;
                this.activityBodyHeight = this.activityBodyHeight > 0 ? this.activityBodyHeight : 0;
                this.activityBodyWidth = parentDims.width;
            }
        }
    }

    public render() {
        this.updateActivityBodyDims();
        const category = <b>{this.props.activity.config.category.toLowerCase()}</b>
        const question = this.state.currentStage < this.numberOfStages ?
            <div className="question runSlideIn">
                Please tap the
                <div className={"bolded " + this.state.stepClassName}>
                &nbsp;{INSTRUCTION[this.state.currentStage]}
                </div> side
                of the {category}
                <HelpButtonComponent>
                    Tap the sides of the {category} as accurately as possible.

                    Once you have tapped all four sides of the {category}, you can modify your selection.
                </HelpButtonComponent>
            </div> :
            <div className={"question " + this.state.stepClassName}>
                Please verify that all 4 borders touch, and fix them if they don't
                <HelpButtonComponent>
                    If you are unhappy with the sides you selected, you can tap and drag to readjust them.

                    Try to form a tight box around the {category}.
                </HelpButtonComponent>
            </div>;

        const doneButtonHeight = 70;

        return <div
            style={{ height: "100%", width: "100%" }}
            ref={(divElement) => this.view = divElement}
            id="view">
            <ActivityInstruction
                ref={(divElement: any) => this.activityInstruction = divElement}
                onResize={this.onInstructionResize}>
                {question}
            </ActivityInstruction>
            <canvas
                className="tagbullCanvas"
                id="boundingBoxCanvas"
                width={this.activityBodyWidth}
                height={this.activityBodyHeight}>
                Your browser does not support canvas element.
                </canvas>
            <ActivityAction
                ref={(divElement: any) => this.activityAction = divElement}>
                <DoneButtonComponent
                    height={doneButtonHeight}
                    enabled={this.state.hasInput && !this.props.disabled}
                    onClick={this.doneButtonClicked}>
                </DoneButtonComponent>
            </ActivityAction>
            <div style={{ clear: "both" }}></div>
        </div>;
    }
}

export default BoundingBoxTap;
