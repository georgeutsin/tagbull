import React, { Component } from "react";
import { IBoundingBox, IPoint, IRect } from "../../Interfaces";
import {
    isPointInBounds,
    isTouchInBounds,
    normalizePointToBounds,
    rectFromBoundingBoxAndImage,
    rectToCanvasCoords,
    touchToImageCoords,
    windowTouchToCanvasCoords,
} from "../../Utils";
import {
    BaseCanvas,
    drawActiveImageOverlay,
    drawBlackOverlay,
    drawHorizontalLine,
    drawMarker,
    drawVerticalLine,
} from "../Canvases";

interface IBoundingBoxCreationCanvasState {
    currentStage: number;
}

interface IBoundingBoxCreationCanvasProps {
    media_url: string;
    instructionDims: DOMRect;
    actionDims: DOMRect;
    viewDims: DOMRect;
    notifyTapComplete: any;

    targetPoint?: IPoint;
}

class BoundingBoxCreationCanvas extends Component<IBoundingBoxCreationCanvasProps, IBoundingBoxCreationCanvasState> {
    private numberOfStages: number;
    private boundingBox: IBoundingBox;
    private lastBoundingBox: IBoundingBox;
    private touchStage: number;
    private image?: HTMLImageElement;
    private imageBounds: IRect;
    private didMove: boolean;

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
        this.handleLeave = this.handleLeave.bind(this);
        this.setImage = this.setImage.bind(this);
        this.draw = this.draw.bind(this);
        this.boundingBox = { max_x: 1, max_y: 1, min_x: 0, min_y: 0 };
        this.lastBoundingBox = this.boundingBox;
        this.didMove = false;
    }

    public handleStart(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;
        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            touch = normalizePointToBounds(touch, this.imageBounds);
            const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
            this.touchStage = this.nextTouchStage(imageCoords);
            this.lastBoundingBox = { ...this.boundingBox };
            this.didMove = false;
            this.moveObjBounds(imageCoords, this.state.currentStage); // Always assume it's a new point at first.
        }
    }

    public handleMove(evt: any) {
        this.didMove = true;
        const el = evt.target;
        const touches = evt.changedTouches;
        // If we are editing a previous stage, assume the last bounding box
        if (this.touchStage < this.state.currentStage) {
            this.boundingBox = { ...this.lastBoundingBox };
        }
        // Update the last bounding box every time
        this.lastBoundingBox = this.boundingBox;
        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (touch.id >= 0 && isTouchInBounds(touch, this.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
                this.moveObjBounds(imageCoords, this.touchStage);
                return;
            }
            if (touch.id >= 0) { // touch is out of bounds
                touch = normalizePointToBounds(touch, this.imageBounds);
                const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
                this.moveObjBounds(imageCoords, this.touchStage);
                return;
            }
        }
    }

    public handleEnd(evt: any) {
        this.normalizeObjBounds();
        if (this.touchStage !== -1) {
            const touchStage = this.touchStage;
            this.touchStage = -1;
            if (this.props.targetPoint && !isPointInBounds(this.props.targetPoint, this.boundingBox)) {
                alert(this.borderPlacementAlertMessage());
                return;
            }
            let nextStage = this.state.currentStage;
            if (this.state.currentStage < this.numberOfStages &&
                (touchStage === this.state.currentStage || !this.didMove)) {
                nextStage += 1;
            }

            this.setState({
                currentStage: nextStage,
            }, () => {
                this.props.notifyTapComplete(this.boundingBox, this.state.currentStage);
            });
        }
    }

    public handleLeave(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;

        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            touch = normalizePointToBounds(touch, this.imageBounds);
            if (touch.id >= 0) {
                const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
                this.moveObjBounds(imageCoords, this.touchStage);
                this.handleEnd({});
            }
        }
    }

    public borderPlacementAlertMessage() {
        let part = "";
        let location = "";
        switch (this.state.currentStage) {
            case 0:
                part = "left";
                location = "to the left of";
                break;
            case 1:
                part = "top";
                location = "above";
                break;
            case 2:
                part = "right";
                location = "to the right of";
                break;
            case 3:
            default:
                part = "bottom";
                location = "below";
                break;
        }
        return `The ${part}most part should be ${location} the target, thanks :)`;
    }

    public setImage(imageBounds: IRect, image?: HTMLImageElement) {
        this.image = image;
        this.imageBounds = imageBounds;
    }

    public withinDelta(line1: number, line2: number, delta: number) {
        return Math.abs(line1 - line2) < delta;
    }

    public didGrabEdge(xPos: number, yPos: number): number {
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
        return -1;
    }

    public nextTouchStage(touch: any): number {
        if (this.image) {
            const xPos = touch.x / this.image.width;
            const yPos = touch.y / this.image.height;

            const edge = this.didGrabEdge(xPos, yPos);

            // Editing an existing edge
            if (edge !== -1 && edge < this.state.currentStage) {
                return edge;
            }

            // Creating a new edge
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

    public drawHelperLines(ctx: CanvasRenderingContext2D, rect: IRect) {
        if (this.state.currentStage >= 3) { // Bottommost
            drawHorizontalLine(ctx, rect.y + rect.h, this.imageBounds);
        }
        if (this.state.currentStage >= 2) { // Rightmost
            drawVerticalLine(ctx, rect.x + rect.w, this.imageBounds);
        }
        if (this.state.currentStage >= 1) { // Topmost
            drawHorizontalLine(ctx, rect.y, this.imageBounds);
        }
        if (this.state.currentStage >= 0) { // Leftmost
            drawVerticalLine(ctx, rect.x, this.imageBounds);
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (ctx === null) {
            return;
        }
        const rect = rectFromBoundingBoxAndImage(this.boundingBox, this.image);
        const canvasRect = rectToCanvasCoords(rect, this.imageBounds, this.image);

        drawBlackOverlay(ctx, this.imageBounds);
        drawActiveImageOverlay(ctx, rect, canvasRect, this.image);
        this.drawHelperLines(ctx, canvasRect);

        if (this.props.targetPoint && this.props.targetPoint !== null && this.props.targetPoint.x !== null) {
            drawMarker(ctx, this.props.targetPoint, this.imageBounds);
        }
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
            handleLeaveCB={this.handleLeave}
            setImageCB={this.setImage}
            drawCB={this.draw}
        >
        </BaseCanvas>;
    }
}

export default BoundingBoxCreationCanvas;
