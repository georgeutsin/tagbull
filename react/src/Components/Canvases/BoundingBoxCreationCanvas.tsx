import React, { Component } from "react";
import { IBoundingBox, IRect } from "../../Interfaces";
import {
    isTouchInBounds,
    rectFromBoundingBoxAndImage,
    rectToCanvasCoords,
    touchToImageCoords,
    windowTouchToCanvasCoords,
} from "../../Utils";
import { BaseCanvas } from "../Canvases";

interface IBoundingBoxCreationCanvasState {
    currentStage: number;
}

interface IBoundingBoxCreationCanvasProps {
    media_url: string;
    instructionDims: DOMRect;
    actionDims: DOMRect;
    viewDims: DOMRect;
    notifyTapComplete: any;
}

class BoundingBoxCreationCanvas extends Component<IBoundingBoxCreationCanvasProps, IBoundingBoxCreationCanvasState> {
    private numberOfStages: number;
    private boundingBox: IBoundingBox;
    private touchStage: number;
    private image?: HTMLImageElement;
    private imageBounds: IRect;

    constructor(props: any) {
        super(props);

        this.numberOfStages = 4;
        this.touchStage = -1; // touchStage may be less than or equal to the current stage (ex: editing old touches)

        // Don't call this.setState() here!
        this.state = {
            currentStage: 0,
        };

        this.imageBounds = { x: 0, y: 0, w: 0, h: 0 };
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.setImage = this.setImage.bind(this);
        this.draw = this.draw.bind(this);
        this.boundingBox = { max_x: 1, max_y: 1, min_x: 0, min_y: 0 };
    }

    public handleStart(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;
        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (isTouchInBounds(touch, this.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
                this.touchStage = this.nextTouchStage(imageCoords);
                this.moveObjBounds(imageCoords, this.touchStage);
            }
        }
    }

    public handleMove(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;

        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (touch.id >= 0 && isTouchInBounds(touch, this.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
                this.moveObjBounds(imageCoords, this.touchStage);
            }
        }
    }

    public handleEnd(evt: any) {
        this.normalizeObjBounds();
        if (this.touchStage !== -1) {
            this.touchStage = -1;
            let nextStage = this.state.currentStage;
            if (this.state.currentStage < this.numberOfStages) {
                nextStage += 1;
            }

            this.setState({
                currentStage: nextStage,
            }, () => {
                this.props.notifyTapComplete(this.boundingBox, this.state.currentStage);
            });
        }
    }

    public setImage(imageBounds: IRect, image?: HTMLImageElement) {
        this.image = image;
        this.imageBounds = imageBounds;
    }

    public withinDelta(line1: number, line2: number, delta: number) {
        return Math.abs(line1 - line2) < delta;
    }

    public nextTouchStage(touch: any): number {
        if (this.image && this.state.currentStage >= this.numberOfStages) {
            const xPos = touch.x / this.image.width;
            const yPos = touch.y / this.image.height;
            const delta = 0.05;

            if (this.withinDelta(this.boundingBox.min_x, xPos, delta)) {
                return 0;
            } else if (this.withinDelta(this.boundingBox.min_y, yPos, delta)) {
                return 1;
            } else if (this.withinDelta(this.boundingBox.max_x, xPos, delta)) {
                return 2;
            } else if (this.withinDelta(this.boundingBox.max_y, yPos, delta)) {
                return 3;
            }
        } else {
            return this.state.currentStage;
        }
        return -1;
    }

    public normalizeObjBounds() {
        if (this.boundingBox.min_x > this.boundingBox.max_x) {
            [this.boundingBox.min_x, this.boundingBox.max_x] = [this.boundingBox.max_x, this.boundingBox.min_x];
        }

        if (this.boundingBox.min_y > this.boundingBox.max_y) {
            [this.boundingBox.min_y, this.boundingBox.max_y] = [this.boundingBox.max_y, this.boundingBox.min_y];
        }
    }

    public moveObjBounds(touch: any, touchStage: number) {
        if (this.image) {
            const xPos = touch.x / this.image.width;
            const yPos = touch.y / this.image.height;

            switch (touchStage) {
                case 0: // Leftmost
                    this.boundingBox.min_x = xPos;
                    break;
                case 1: // Topmost
                    this.boundingBox.min_y = yPos;
                    break;
                case 2: // Rightmost
                    this.boundingBox.max_x = xPos;
                    break;
                case 3: // Bottommost
                    this.boundingBox.max_y = yPos;
                    break;
                default:
            }
        }
    }

    public drawBlackOverlay(bounds: IRect, ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "black";
        ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.globalAlpha = 1.0;
    }

    public drawActiveImageOverlay(ctx: CanvasRenderingContext2D, rect: IRect, canvasRect: IRect) {
        if (this.image) {
            ctx.drawImage(this.image,
                rect.x, rect.y,
                Math.max(1, Math.floor(rect.w)), Math.max(1, Math.floor(rect.h)), // Support firefox
                canvasRect.x, canvasRect.y,
                Math.max(1, Math.floor(canvasRect.w)), Math.max(1, Math.floor(canvasRect.h))); // Support firefoxs
        }
    }

    public drawVerticalLine(x: number, ctx: CanvasRenderingContext2D) {
        const bounds = this.imageBounds;
        if (ctx && x !== bounds.x && x !== bounds.x + bounds.w) {
            ctx.strokeStyle = "#DDDDDD";
            ctx.beginPath();
            ctx.moveTo(x, bounds.y);
            ctx.lineTo(x, bounds.y + bounds.h);
            ctx.stroke();
        }
    }

    public drawHorizontalLine(y: number, ctx: CanvasRenderingContext2D) {
        const bounds = this.imageBounds;
        if (ctx && y !== bounds.y && y !== bounds.y + bounds.h) {
            ctx.strokeStyle = "#DDDDDD";
            ctx.beginPath();
            ctx.moveTo(bounds.x, y);
            ctx.lineTo(bounds.x + bounds.w, y);
            ctx.stroke();
        }
    }

    public drawHelperLines(ctx: CanvasRenderingContext2D, rect: IRect) {
        switch (this.state.currentStage) {
            case 0: // Leftmost
                this.drawVerticalLine(rect.x, ctx);
                break;
            case 1: // Topmost
                this.drawHorizontalLine(rect.y, ctx);
                break;
            case 2: // Rightmost
                this.drawVerticalLine(rect.x + rect.w, ctx);
                break;
            case 3: // Bottommost
                this.drawHorizontalLine(rect.y + rect.h, ctx);
                break;
            case 4:
                this.drawVerticalLine(rect.x, ctx);
                this.drawHorizontalLine(rect.y, ctx);
                this.drawVerticalLine(rect.x + rect.w, ctx);
                this.drawHorizontalLine(rect.y + rect.h, ctx);
                break;
            default:
                break;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (ctx === null) {
            return;
        }
        const rect = rectFromBoundingBoxAndImage(this.boundingBox, this.image);
        const canvasRect = rectToCanvasCoords(rect, this.imageBounds, this.image);

        this.drawBlackOverlay(this.imageBounds, ctx);
        this.drawActiveImageOverlay(ctx, rect, canvasRect);
        this.drawHelperLines(ctx, canvasRect);
    }

    public render() {
        return <BaseCanvas
            instructionDims={this.props.instructionDims}
            actionDims={this.props.actionDims}
            viewDims={this.props.viewDims}
            media_url={this.props.media_url}
            handleStartCB={this.handleStart}
            handleMoveCB={this.handleMove}
            handleEndCB={this.handleEnd}
            setImageCB={this.setImage}
            drawCB={this.draw}
        >
        </BaseCanvas>;
    }
}

export default BoundingBoxCreationCanvas;
