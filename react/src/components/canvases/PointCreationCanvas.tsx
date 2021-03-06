import React, { Component } from "react";
import { BaseCanvas, drawMarker } from ".";
import { IPoint, IRect } from "../../interfaces";
import {
    isTouchInBounds,
    touchToImageCoords,
    windowTouchToCanvasCoords,
} from "../../utils";

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

class PointCreationCanvas extends Component<IBoundingBoxCreationCanvasProps, IBoundingBoxCreationCanvasState> {
    private currentMarker: IPoint;
    private image?: HTMLImageElement;
    private imageBounds: IRect;
    private markers: IPoint[];

    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            currentStage: 0,
        };

        this.markers = [];
        this.imageBounds = { x: 0, y: 0, w: 0, h: 0 };
        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.setImage = this.setImage.bind(this);
        this.draw = this.draw.bind(this);
        this.currentMarker = { x: -1, y: -1 };
    }


    public setImage(imageBounds: IRect, image?: HTMLImageElement) {
        this.image = image;
        this.imageBounds = imageBounds;
    }

    public withinDelta(line1: number, line2: number, delta: number) {
        return Math.abs(line1 - line2) < delta;
    }

    public setInitialMarkerPosition(touch: any) {
        if (this.image) {
            const xPos = touch.x / this.image.width;
            const yPos = touch.y / this.image.height;
            const delta = 0.04;
            // if the touch is near an existing marker, remove it
            // this effectively emulates the behaviour of moving a marker
            for (const marker of this.markers) {
                if (Math.abs(xPos - marker.x) < delta && Math.abs(yPos - marker.y) < delta) {
                    this.markers.splice(this.markers.indexOf(marker), 1);
                    break;
                }
            }
        }

        if (this.image) {
            const xPos = touch.x / this.image.width;
            const yPos = touch.y / this.image.height;
            this.currentMarker = { x: xPos, y: yPos };
        }
    }

    public handleStart(evt: any) {
        const el = evt.target;
        const touches = evt.changedTouches;
        for (let touch of touches) {
            touch = windowTouchToCanvasCoords(el, touch);
            if (isTouchInBounds(touch, this.imageBounds)) {
                const imageCoords = touchToImageCoords(touch, this.imageBounds, this.image);
                this.setInitialMarkerPosition(imageCoords);
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
                if (this.image) {
                    const xPos = imageCoords.x / this.image.width;
                    const yPos = imageCoords.y / this.image.height;
                    this.currentMarker = { x: xPos, y: yPos };
                }
            }
        }
    }

    public handleEnd(evt: any) {
        if (this.currentMarker.x >= 0 && this.currentMarker.x <= 1
            && this.currentMarker.y >= 0 && this.currentMarker.y <= 1) {
            this.markers.push(this.currentMarker);
            this.setState({
                currentStage: 2,
            }, () => {
                this.props.notifyTapComplete(this.markers, this.state.currentStage);
            });
        }
        this.currentMarker = { x: -1, y: -1 };
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.drawMarkers(ctx);
    }

    public drawMarkers(ctx: CanvasRenderingContext2D) {
        for (const marker of this.markers.concat([this.currentMarker])) {
            drawMarker(ctx, marker, this.imageBounds);
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
            handleLeaveCB={() => null}
            setImageCB={this.setImage}
            drawCB={this.draw}
        >
        </BaseCanvas>;
    }
}

export default PointCreationCanvas;
