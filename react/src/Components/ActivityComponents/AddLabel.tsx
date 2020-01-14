// TODO fix this broken component lol
// NOT SUPPORTED
import React, { Component } from "react";
import { IRect } from "../../Interfaces";
import {
    calculateImageDimensions,
    calculateImageLocation,
} from "../../Utils/CanvasCalcs";
import DropdownInputComponent from "../UIElements/DropdownInputComponent";

interface IAddLabelState {
    rect: IRect;
    windowWidth: number;
    image?: HTMLImageElement;
    imageBounds: IRect;
    userLabel: string;
}

interface IAddLabelProps {
    rect: IRect;
    image?: HTMLImageElement;
    question: string;
    onLabelChange: any;
    labelsList: string[];
}

class AddLabel extends Component<IAddLabelProps, IAddLabelState> {
    private ctx: CanvasRenderingContext2D | null;
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;

    constructor(props: IAddLabelProps) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            image: this.props.image,
            rect: this.props.rect,
            imageBounds: {
                x: 0,
                y: 0,
                h: 0,
                w: 0,
            },
            windowWidth: window.innerWidth,
            userLabel: "",
        };
        this.ctx = null;
        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;

        this.onLabelChange = this.onLabelChange.bind(this);
        window.addEventListener("resize", this.windowResizeListener.bind(this));
    }

    public windowResizeListener() {
        this.setState({ windowWidth: window.innerWidth }, () => {
            this.updateImageBounds();
        });
    }

    public componentWillReceiveProps(props: IAddLabelProps) {
        this.setState({ image: props.image, rect: props.rect }, () => {
            this.updateImageBounds();
        });
    }

    public componentWillMount() {
        // Hack to redraw after proceeding from previous stage.
        // Probably fragile and timing dependent.
        // TODO: fix this, and figure out how to all updateImageBounds after the HTML renders in the second stage.
        this.props.onLabelChange("");
    }

    public componentDidMount() {
        this.setState({});
        const el: any = document.getElementById("labelCanvas");
        this.ctx = el.getContext("2d");
        this.updateImageBounds();
    }

    public componentWillUnmount() {
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
            });
        }
    }

    public rectToCanvas(rect: any) {
        if (this.state.image) {
            const scale = this.state.image.width / this.state.imageBounds.w;

            return {
                x: this.state.imageBounds.x + rect.x / scale,
                y: this.state.imageBounds.y + rect.y / scale,
                w: rect.w / scale,
                h: rect.h / scale,
            };
        }

        return { x: 0, y: 0, w: 0, h: 0 };
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

        this.ctx.beginPath();
        const rect = this.rectToCanvas(this.state.rect);
        this.ctx.rect(rect.x, rect.y, rect.w, rect.h);
        this.ctx.strokeStyle = "#00FF00";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    public onLabelChange(value: string) {
        this.setState({ userLabel: value });
        this.props.onLabelChange(value);
    }

    public render() {
        // Calculate canvas height given the elements on the page.
        let canvasHeight = 0;
        let canvasWidth = 0;
        if (this.view !== null && this.activityInstruction !== null && this.activityAction !== null) {
            const parentDims = this.view.getBoundingClientRect();
            const instructionDims = this.activityInstruction.getBoundingClientRect();
            const actionDims = this.activityAction.getBoundingClientRect();
            canvasHeight = parentDims.height - instructionDims.height - actionDims.height;
            canvasWidth = parentDims.width;
        }

        // TODO: Get options list from api
        const options = this.props.labelsList.map((label) => ({ value: label }));

        var HtmlToReactParser = require('html-to-react').Parser;
        var htmlToReactParser = new HtmlToReactParser();

        return <div ref={(divElement) => this.view = divElement} id="view"
            style={{ height: "100%", width: "100%" }}>
            <div ref={(divElement) => this.activityInstruction = divElement} id="activityInstruction">
                <div className="question">
                    {htmlToReactParser.parse(this.props.question)}
                </div>
                <div className="help">?</div>
                <div style={{ clear: "both" }}></div>
            </div>
            <canvas id="labelCanvas" width={canvasWidth} height={canvasHeight}>
                Your browser does not support canvas element.
            </canvas>
            <div ref={(divElement) => this.activityAction = divElement} id="activityAction" >
                <div className="labelInput" >
                    <DropdownInputComponent onInputChange={this.onLabelChange}
                        options={options}
                        placeHolder="Select Label..." />
                </div>
            </div>
        </div>;
    }
}

export default AddLabel;
