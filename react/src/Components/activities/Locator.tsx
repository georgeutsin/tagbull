import React, { Component } from "react";
import ResizeDetector from "react-resize-detector";
import aid_locator from "../../images/visuals/aid_locator.svg";
import { IPoint } from "../../interfaces";
import { PointCreationCanvas } from "../canvases";
import {
    ActivityAction,
    ActivityActionButtonComponent,
    ActivityInstruction,
    BigButtonComponent,
    HelpButtonComponent,
} from "../elements";
import "./Locator.css";

interface ILocatorState {
    currentStage: number;
    finishedInput: boolean;
}

interface ILocatorProps {
    activity: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

class Locator extends Component<ILocatorProps, ILocatorState> {
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;
    private numberOfStages: number;
    private markers: IPoint[];

    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            finishedInput: false,
            currentStage: 1,
        };

        this.markers = [];
        this.numberOfStages = 2;
        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
        this.resetButtonClicked = this.resetButtonClicked.bind(this);
        this.noObjectsButtonClicked = this.noObjectsButtonClicked.bind(this);
        this.handleTapFinished = this.handleTapFinished.bind(this);
    }

    public noObjectsButtonClicked() {
        this.props.notifyActivityComplete({
            points: this.markers,
        });
        // TODO serve new task
    }

    public resetButtonClicked() {
        this.markers.length = 0;
        this.setState({ currentStage: 1, finishedInput: false });
    }

    public doneButtonClicked() {
        if (this.state.currentStage === this.numberOfStages) {
            this.props.notifyActivityComplete({
                points: this.markers,
            });
        }
    }

    public handleTapFinished(markers: IPoint[], tapStageFinished: number) {
        this.markers = markers;

        this.setState((state) => ({
            currentStage: tapStageFinished,
            finishedInput: state.currentStage >= this.numberOfStages - 1,
        }));
    }

    public render() {
        const category = <b>{this.props.activity.config.category.toLowerCase()}</b>;
        const helpButton =
            <HelpButtonComponent>
                Tap the center of the {category} as accurately as possible.
                You may tap Reset to remove all markers.
            </HelpButtonComponent>;
        const question =
            <div className="question runSlideIn">
                Please tap on all the {category}
            </div>;

        const doneButtonHeight = 70;
        const actionButtonLabel = this.state.finishedInput ?
            "Reset" : "No " + this.props.activity.config.category.toLowerCase().replace(" and ", " or ");
        return <div
            style={{ height: "100%", width: "100%" }}
            ref={(divElement) => this.view = divElement}
            id="view">
            <ActivityInstruction
                ref={(divElement: any) => this.activityInstruction = divElement}
                helpButton={helpButton}
                visual={aid_locator}>
                {question}
            </ActivityInstruction>
            <PointCreationCanvas
                instructionDims={this.instructionDims()}
                actionDims={this.actionDims()}
                viewDims={this.viewDims()}
                media_url={this.props.activity.config.media_url}
                notifyTapComplete={this.handleTapFinished}
            ></PointCreationCanvas>
            <ActivityAction
                ref={(divElement: any) => this.activityAction = divElement}>
                <div className="multipleActionsContainer">
                    <ActivityActionButtonComponent
                        width={undefined}
                        enabled={true}
                        onClick={this.state.finishedInput ? this.resetButtonClicked : this.noObjectsButtonClicked}
                        label={actionButtonLabel}>
                    </ActivityActionButtonComponent>
                </div>
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

export default Locator;
