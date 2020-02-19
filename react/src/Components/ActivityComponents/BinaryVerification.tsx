import React, { Component } from "react";
import { IBoundingBox, IRect } from "../../Interfaces";
import {
    calculateImageDimensions,
} from "../../Utils/CanvasCalcs";
import { ActivityAction, ActivityInstruction, BigButtonComponent } from "../UIElements";
import HelpButtonComponent from "../UIElements/HelpButtonComponent";

interface IBinaryVerificationState {
    rect1: IRect;
    rect2: IRect;

    windowWidth: number;
    image?: HTMLImageElement;
    accepted_id: number;

    currentStage: number;
    hasInput: boolean;
}

interface IBinaryVerificationProps {
    activity: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

class BinaryVerification extends Component<IBinaryVerificationProps, IBinaryVerificationState> {
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;
    private numberOfStages: number;
    private activityBodyWidth: number;
    private activityBodyHeight: number;

    constructor(props: any) {
        super(props);

        this.numberOfStages = 1; // Change to 4 once we have point by point.
        const image = new Image();
        image.src = this.props.activity.media_url;
        image.onload = () => {
            this.setState({
                image,
            }, () => {
                this.updateRects(this.props);
            });
        };
        // Don't call this.setState() here!
        this.state = {
            windowWidth: window.innerWidth,
            hasInput: false,
            currentStage: 0,
            accepted_id: -1,
            rect1: { x: 0, y: 0, h: 0, w: 0 },
            rect2: { x: 0, y: 0, h: 0, w: 0 },
        };

        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;
        this.activityBodyHeight = 0;
        this.activityBodyWidth = 0;

        window.addEventListener("resize", this.windowResizeListener.bind(this));
        window.addEventListener("orientationchange", this.windowResizeListener.bind(this));

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
        this.optionClicked = this.optionClicked.bind(this);
        this.onInstructionResize = this.onInstructionResize.bind(this);

    }

    public bbToRect(bb: IBoundingBox): IRect {
        if (this.state.image) {
            return {
                x: bb.min_x * this.state.image.width,
                y: bb.min_y * this.state.image.height,
                w: (bb.max_x - bb.min_x) * this.state.image.width,
                h: (bb.max_y - bb.min_y) * this.state.image.height,
            };
        }
        return { x: 0, y: 0, w: 0, h: 0 };
    }

    public updateRects(props: IBinaryVerificationProps) {
        const bb1: IBoundingBox = props.activity.activity_config.samples[0];
        const bb2: IBoundingBox = props.activity.activity_config.samples[1];
        const rect1 = this.bbToRect(bb1);
        const rect2 = this.bbToRect(bb2);
        this.setState({ rect1, rect2 });
    }

    public windowResizeListener() {
        this.setState({ windowWidth: window.innerWidth });
    }

    public onInstructionResize(width: number, height: number) {
        this.updateActivityBodyDims();
        this.windowResizeListener();
    }

    public doneButtonClicked() {
        const bb1 = this.props.activity.activity_config.samples[0];
        const bb2 = this.props.activity.activity_config.samples[1];
        this.setState({
            hasInput: false,
            currentStage: this.state.currentStage + 1,
        }, () => {
            if (this.state.currentStage === this.numberOfStages) {
                this.props.notifyActivityComplete({
                    accepted_sample: this.state.accepted_id,
                    rejected_sample: this.state.accepted_id === bb1.id ? bb2.id : bb1.id,
                });
            }
        });
    }

    public optionClicked(id: number) {
        this.setState({
            accepted_id: id,
            hasInput: true,
        });
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.windowResizeListener);
        window.removeEventListener("orientationchange", this.windowResizeListener);
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

        let softCropDims = { height: 0, width: 0 };
        if (this.state.image) {
            const verticalSplit = { height: this.activityBodyHeight / 2, width: this.activityBodyWidth };
            const horiztonalSplit = { height: this.activityBodyHeight, width: this.activityBodyWidth / 2 };

            const v = calculateImageDimensions(verticalSplit, this.state.image);
            const h = calculateImageDimensions(horiztonalSplit, this.state.image);
            softCropDims = v.height * v.width > h.height * h.width ? verticalSplit : horiztonalSplit;
        }

        const doneButtonHeight = 70;
        const category = <b>{this.props.activity.activity_config.category.toLowerCase()}</b>
        return <div
            style={{ height: "100%", width: "100%" }}
            ref={(divElement) => this.view = divElement}
            id="view">
            <ActivityInstruction
                ref={(divElement: any) => this.activityInstruction = divElement}
                onResize={this.onInstructionResize}>
                <div className="question runSlideIn">
                    Please select the <b>better</b> box around the {category}
                    <HelpButtonComponent>
                        There are two boxes drawn around the {category}. Tap the box which more tightly contains the {category} without cutting it off.
                    </HelpButtonComponent>/>
                </div>
            </ActivityInstruction>
            <div style={{ height: this.activityBodyHeight, width: this.activityBodyWidth }}
                className="tagbullCanvas">
            </div>
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

export default BinaryVerification;
