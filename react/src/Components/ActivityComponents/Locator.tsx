import React, { Component } from "react";
import { IPoint, IRect } from "../../Interfaces";
import {
    calculateImageDimensions,
    calculateImageLocation,
    isTouchInBounds,
    MouseAdaptor,
    TouchAdaptor,
    touchToImageCoords,
    windowTouchToCanvasCoords,
} from "../../Utils";
import { ActivityAction, ActivityInstruction, BigButtonComponent, HelpButtonComponent } from "../UIElements";

interface ILocatorState {
    windowWidth: number;
    image?: HTMLImageElement;
    imageBounds: IRect;
    markers: IPoint[];

    stepClassName: string;

    currentStage: number;
    hasInput: boolean;
}

interface ILocatorProps {
    activity: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

class Locator extends Component<ILocatorProps, ILocatorState> {
    private ctx: CanvasRenderingContext2D | null;
    private mouseAdaptor?: MouseAdaptor;
    private touchAdaptor?: TouchAdaptor;
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;
    private numberOfStages: number;
    private activityBodyWidth: number;
    private activityBodyHeight: number;
    private currentMarker: IPoint;

    constructor(props: any) {
        super(props);

        this.numberOfStages = 2;
        const image = new Image();
        image.src = this.props.activity.config.media_url;
        image.onload = () => {
            this.setState({
                image,
            }, () => {
                this.updateImageBounds();
            });
        };
        // Don't call this.setState() here!
        this.state = {
            imageBounds: { x: 0, y: 0, w: 0, h: 0 },
            markers: [],
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
        this.activityBodyHeight = 0;
        this.activityBodyWidth = 0;
        this.currentMarker = { x: -1, y: -1 };

        window.addEventListener("resize", this.windowResizeListener.bind(this));
        window.addEventListener("orientationchange", this.windowResizeListener.bind(this));

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
        this.resetButtonClicked = this.resetButtonClicked.bind(this);
    }

    public windowResizeListener() {
        this.setState({ windowWidth: window.innerWidth }, () => {
            this.updateImageBounds();
        });
    }

    public resetButtonClicked() {
        this.setState({ markers: [], currentStage: 1, hasInput: false });
    }

    public doneButtonClicked() {
        if (this.state.currentStage === this.numberOfStages) {
            this.props.notifyActivityComplete({
                // TODO(Kevin): after backend implemented
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

    public setInitialMarkerPosition(touch: any) {
        if (this.state.image) {
            const xPos = touch.x / this.state.image.width;
            const yPos = touch.y / this.state.image.height;
            const delta = 0.04;
            // if the touch is near an existing marker, remove it
            // this effectively emulates the behaviour of moving a marker
            for (const marker of this.state.markers) {
                if (Math.abs(xPos - marker.x) < delta && Math.abs(yPos - marker.y) < delta) {
                    this.setState((state) => {
                        state.markers.splice( state.markers.indexOf(marker), 1 );
                        return state;
                    });
                    break;
                }
            }
        }

        if (this.state.image) {
            const xPos = touch.x / this.state.image.width;
            const yPos = touch.y / this.state.image.height;
            this.currentMarker = { x: xPos, y: yPos };
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
                this.setInitialMarkerPosition(imageCoords);
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
                if (this.state.image) {
                    const xPos = imageCoords.x / this.state.image.width;
                    const yPos = imageCoords.y / this.state.image.height;
                    this.currentMarker = { x: xPos, y: yPos };
                }
            } else {
                console.log("can't figure out which touch to continue " + touch.id);
            }
        }
        this.draw();
    }

    public handleEnd(evt: any) {
        if (this.currentMarker.x >= 0 && this.currentMarker.x <= 1
            && this.currentMarker.y >= 0 && this.currentMarker.y <= 1) {
            this.setState((state) => {
                state.markers.push(this.currentMarker);
                return state;
            });
            this.setState({
                hasInput: true,
                currentStage: 2,
                stepClassName: "runSlideIn",
            });
        }
        this.currentMarker = { x: -1, y: -1 };

        this.draw();
    }

    public draw() {
        if (this.ctx === null) {
            return;
        }

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.state.image) {
            const bounds = this.state.imageBounds;
            this.ctx.drawImage(this.state.image, bounds.x, bounds.y, bounds.w, bounds.h);
            this.drawMarkers();
        }
    }

    public drawMarkers() {
        if (this.state.image && this.ctx) {
            // aiming for ~20px on fullscreen, ~10px on mobile.
            const radius = Math.max(this.state.imageBounds.w, this.state.imageBounds.h) / 60;
            for (const marker of this.state.markers.concat([this.currentMarker])) {
                // Draw black outer circle
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#000000";
                this.ctx.ellipse(
                    marker.x * this.state.imageBounds.w + this.state.imageBounds.x,
                    marker.y * this.state.imageBounds.h + this.state.imageBounds.y,
                    radius, radius, 0, 0, Math.PI * 2);
                this.ctx.stroke();

                // Draw white inner circle
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#FFFFFF";
                this.ctx.ellipse(
                    marker.x * this.state.imageBounds.w + this.state.imageBounds.x,
                    marker.y * this.state.imageBounds.h + this.state.imageBounds.y,
                    radius + 1, radius + 1, 0, 0, Math.PI * 2);
                this.ctx.stroke();
            }


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
        const category = <b>{this.props.activity.config.category.toLowerCase()}</b>;
        const question =
            <div className="question runSlideIn">
                Please tap all occurences of a {category}
                <HelpButtonComponent>
                    Tap the center of a {category} as accurately as possible.

                    You may tap Reset to remove all markers.
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
                <BigButtonComponent
                    height={doneButtonHeight}
                    enabled={true}
                    onClick={this.resetButtonClicked}
                    label={"Reset"}>
                </BigButtonComponent>
                <br></br>
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
                <BigButtonComponent
                    height={doneButtonHeight}
                    enabled={this.state.hasInput && !this.props.disabled}
                    onClick={this.doneButtonClicked}
                    label={"Done"}>
                </BigButtonComponent>
            </ActivityAction>
            <div style={{ clear: "both" }}></div>
        </div>;
    }
}

export default Locator;
