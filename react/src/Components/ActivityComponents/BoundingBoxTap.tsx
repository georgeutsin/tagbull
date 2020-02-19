import React, { Component } from "react";
import ResizeDetector from "react-resize-detector";
import { IBoundingBox } from "../../Interfaces";
import { BoundingBoxCreationCanvas } from "../Canvases";
import { ActivityAction, ActivityInstruction, BigButtonComponent, HelpButtonComponent } from "../UIElements";

interface IBoundingBoxTapState {
    animationClass: string;
    currentStage: number;
    finishedInput: boolean;
}

interface IBoundingBoxTapProps {
    activity: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

const INSTRUCTION = ["leftmost", "topmost", "rightmost", "bottommost"];

class BoundingBoxTap extends Component<IBoundingBoxTapProps, IBoundingBoxTapState> {
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;
    private numberOfStages: number;
    private boundingBox: IBoundingBox;

    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            finishedInput: false,
            currentStage: 0,
            animationClass: "",
        };

        this.numberOfStages = 4;
        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;
        this.boundingBox = { max_x: 0, max_y: 0, min_x: 0, min_y: 0 };

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
        this.handleTapFinished = this.handleTapFinished.bind(this);
    }

    public doneButtonClicked() {
        if (this.state.currentStage === this.numberOfStages) {
            this.props.notifyActivityComplete({
                min_x: this.boundingBox.min_x,
                min_y: this.boundingBox.min_y,
                max_x: this.boundingBox.max_x,
                max_y: this.boundingBox.max_y,
            });
        }
    }

    public handleTapFinished(boundingBox: IBoundingBox, tapStageFinished: number) {
        this.boundingBox = boundingBox;

        this.setState((state) => ({
            currentStage: tapStageFinished,
            finishedInput: state.currentStage >= this.numberOfStages - 1,
            animationClass: "",
        }), () => {
            this.setState({ animationClass: "runSlideIn" });
        });
    }

    public render() {
        const category = <b>{this.props.activity.config.category.toLowerCase()}</b>;
        const question = this.state.currentStage < this.numberOfStages ?
            <div className="question runSlideIn">
                Please tap the
                <div className={"bolded " + this.state.animationClass}>
                    &nbsp;{INSTRUCTION[this.state.currentStage]}
                </div> side
                of the {category}
                <HelpButtonComponent>
                    Tap the sides of the {category} as accurately as possible.

                    Once you have tapped all four sides of the {category}, you can modify your selection.
                </HelpButtonComponent>
            </div> :
            <div className={"question " + this.state.animationClass}>
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
                ref={(divElement: any) => this.activityInstruction = divElement}>
                {question}
            </ActivityInstruction>
            <BoundingBoxCreationCanvas
                instructionDims={this.instructionDims()}
                actionDims={this.actionDims()}
                viewDims={this.viewDims()}
                media_url={this.props.activity.config.media_url}
                notifyTapComplete={this.handleTapFinished}
                targetPoint={this.props.activity.config.target_point}
            ></BoundingBoxCreationCanvas>
            <ActivityAction
                ref={(divElement: any) => this.activityAction = divElement}>
                <BigButtonComponent
                    height={doneButtonHeight}
                    enabled={this.state.finishedInput && !this.props.disabled}
                    onClick={this.doneButtonClicked}
                    label={"Done"}>
                </BigButtonComponent>
            </ActivityAction>
            <div style={{ clear: "both" }}></div>
            <ResizeDetector
                handleWidth
                handleHeight
                onResize={(widht, height) => this.setState({})} />
        </div>;
    }

    private instructionDims(): DOMRect {
        return this.activityInstruction !== null ?
            this.activityInstruction.getBoundingClientRect() : new DOMRect();
    }

    private actionDims(): DOMRect {
        return this.activityAction !== null ?
            this.activityAction.getBoundingClientRect() : new DOMRect();
    }

    private viewDims(): DOMRect {
        return this.view !== null ?
            this.view.getBoundingClientRect() : new DOMRect();
    }
}

export default BoundingBoxTap;
