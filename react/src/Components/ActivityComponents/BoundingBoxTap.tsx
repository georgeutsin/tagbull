import React, { Component } from "react";
import ResizeDetector from "react-resize-detector";
import bottom_visual from "../../Images/Visuals/aid_bb_bottom.svg";
import final_visual from "../../Images/Visuals/aid_bb_final.svg";
import left_visual from "../../Images/Visuals/aid_bb_left.svg";
import right_visual from "../../Images/Visuals/aid_bb_right.svg";
import top_visual from "../../Images/Visuals/aid_bb_top.svg";
import { IBoundingBox } from "../../Interfaces";
import { BoundingBoxCreationCanvas } from "../Canvases";
import { ActivityAction, ActivityInstruction, BigButtonComponent, HelpButtonComponent } from "../UIElements";

interface IBoundingBoxTapState {
    animationClass: string;
    currentStage: number;
    finishedInput: boolean;
    canvasKey: number;
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
    private visuals: any[];
    private boxTooBigAlertDismissed: boolean;
    private boxTooSmallAlertDismissed: boolean;

    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            finishedInput: false,
            currentStage: 0,
            animationClass: "",
            canvasKey: Date.now(),
        };

        this.numberOfStages = 4;
        this.boxTooBigAlertDismissed = false;
        this.boxTooSmallAlertDismissed = false;
        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;
        this.boundingBox = { max_x: 0, max_y: 0, min_x: 0, min_y: 0 };
        this.visuals = [left_visual, top_visual, right_visual, bottom_visual, final_visual];

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
        this.handleTapFinished = this.handleTapFinished.bind(this);
    }

    public boxTooBig() {
        return this.props.activity.config.max_box.min_x > this.boundingBox.min_x &&
            this.props.activity.config.max_box.min_y > this.boundingBox.min_y &&
            this.props.activity.config.max_box.max_x < this.boundingBox.max_x &&
            this.props.activity.config.max_box.max_y < this.boundingBox.max_y;
    }

    public boxTooSmall() { // TODO: This is an approximation since it's dependent on aspect ratio
        const delta = 0.07;
        return Math.abs(this.boundingBox.max_x - this.boundingBox.min_x) < delta
            && Math.abs(this.boundingBox.max_y - this.boundingBox.min_y) < delta;
    }

    public doneButtonClicked() {
        if (this.state.currentStage === this.numberOfStages) {
            // verify that the box does not cover all locator dots
            // on the backend, we generate a maximum bounding box.
            // So verify here that it is not bigger than the max
            // bounding box.
            if (!this.boxTooBigAlertDismissed && this.boxTooBig()) {
                const category = this.props.activity.config.category.toLowerCase();
                alert(`Is the box around the single ${category} indicated by the target?`);
                this.boxTooBigAlertDismissed = true;
            } else if (!this.boxTooSmallAlertDismissed && this.boxTooSmall()) {
                const category = this.props.activity.config.category.toLowerCase();
                alert(`Is the entire ${category} inside the box?`);
                this.wipeProgress();
                this.boxTooSmallAlertDismissed = true;
            } else {
                this.props.notifyActivityComplete(this.boundingBox);
            }

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

    public wipeProgress() {
        this.boundingBox = { max_x: 0, max_y: 0, min_x: 0, min_y: 0 };
        this.setState({ canvasKey: Date.now(), finishedInput: false, currentStage: 0 });
    }
    public render() {
        const category = <b>{this.props.activity.config.category.toLowerCase()}</b>;
        const helpButton = this.state.currentStage < this.numberOfStages ?
            <HelpButtonComponent>
                Tap the sides of the {category} as accurately as possible.
                Once you have tapped all four sides of the {category}, you can modify your selection.
            </HelpButtonComponent> : <HelpButtonComponent>
                If you are unhappy with the sides you selected, you can tap and drag to readjust them.
                Try to form a tight box around the {category}.
            </HelpButtonComponent>;

        const question = this.state.currentStage < this.numberOfStages ?
            <div className="question runSlideIn">
                ({this.state.currentStage + 1}/4) Please tap the
                <div className={"bolded " + this.state.animationClass}>
                    &nbsp;{INSTRUCTION[this.state.currentStage]}
                </div> pixel
                of the one {this.props.activity.config.target_point ? "indicated " : ""}{category}
            </div> :
            <div className={"question " + this.state.animationClass}>
                Please verify that all 4 borders touch, and fix them if they don't
            </div>;

        const doneButtonHeight = 70;

        return <div
            style={{ height: "100%", width: "100%" }}
            ref={(divElement) => this.view = divElement}
            id="view">
            <ActivityInstruction
                ref={(divElement: any) => this.activityInstruction = divElement}
                helpButton={helpButton}
                visual={this.visuals[this.state.currentStage]}>
                {question}
            </ActivityInstruction>
            <BoundingBoxCreationCanvas
                key={this.state.canvasKey}
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
                onResize={(width, height) => this.setState({})} />
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
