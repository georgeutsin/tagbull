import React, { Component } from "react";
import ResizeDetector from "react-resize-detector";
import aid_da_depiction from "../../images/visuals/aid_da_depiction.svg";
import aid_da_inside from "../../images/visuals/aid_da_inside.svg";
import aid_da_label from "../../images/visuals/aid_da_label.svg";
import aid_da_occluded from "../../images/visuals/aid_da_occluded.svg";
import aid_da_outside from "../../images/visuals/aid_da_outside.svg";
import { BoundingBoxCanvas } from "../canvases";
import {
    ActivityAction,
    ActivityInstruction,
    BigButton,
    ButtonSelector,
    HelpButton,
} from "../elements";

import activityStyles from "../../styles/activity.module.scss";

interface IDiscreteAttributeState {
    selectedLabel: string;
    finishedInput: boolean;
}

interface IDiscreteAttributeProps {
    activity: any;
    notifyActivityComplete: any;
    disabled: boolean;
}

class DiscreteAttribute extends Component<IDiscreteAttributeProps, IDiscreteAttributeState> {
    private view: HTMLDivElement | null;
    private activityInstruction: HTMLDivElement | null;
    private activityAction: HTMLDivElement | null;

    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            finishedInput: false,
            selectedLabel: "",
        };

        this.view = null;
        this.activityInstruction = null;
        this.activityAction = null;

        // Bindings.
        this.doneButtonClicked = this.doneButtonClicked.bind(this);
        this.onLabelChaged = this.onLabelChaged.bind(this);
    }

    public doneButtonClicked() {
        let label = this.state.selectedLabel;
        if (this.props.activity.config.attribute_type === "IsDepiction") {
            label = label === "yes" ? "no" : "yes";
        }
        this.props.notifyActivityComplete({
            option: label,
        });
    }

    public onLabelChaged(label: string) {
        this.setState({ selectedLabel: label, finishedInput: true });
    }

    public actionsComponent(options: string[]) {
        return <ButtonSelector
            options={options}
            onLabelChange={this.onLabelChaged}>
        </ButtonSelector>;
    }

    public labelNameComponents(category: string, options: string[]) {
        const instruction =
            <div className={`${activityStyles.question} runSlideIn`}>
                Is this {category} a <b>{options[0]}</b> or a <b>{options[1]}</b>?
            </div>;
        const helpButton =
            <HelpButton>
                Determine if the object located inside the box is a
                    <b>{options[0]}</b> or a <b>{options[1]}</b>
            </HelpButton>;

        return [instruction, this.actionsComponent(options), helpButton, aid_da_label];
    }

    public isOccluded(category: string, options: string[]) {
        const instruction =
            <div className={`${activityStyles.question} runSlideIn`}>
                Is any part of the <b>{category}</b> obstructed from view by anything?
            </div>;
        const helpButton =
            <HelpButton>
                If any part of the object is covered by any other object, answer yes. <br />
                If the whole object is not visible in the image due to another object, answer no.
            </HelpButton>;

        return [instruction, this.actionsComponent(options), helpButton, aid_da_occluded];
    }

    public isTruncated(category: string, options: string[]) {
        const instruction =
            <div className={`${activityStyles.question} runSlideIn`}>
                Is any part of the {category} outside the edges of the image?
            </div>;
        const helpButton =
            <HelpButton>
                If any part of the object goes outside the borders of the image, answer yes.
            </HelpButton>;

        return [instruction, this.actionsComponent(options), helpButton, aid_da_outside];
    }

    public isDepiction(category: string, options: string[]) {
        const instruction =
            <div className={`${activityStyles.question} runSlideIn`}>
                Is this an image of a real {category} (taken by a camera)?
            </div>;
        const helpButton =
            <HelpButton>
                If the image looks like a photo or is photorealistic enough that you can't tell, answer yes.
                Otherwise, if its a drawing, rendering, cartoon, or any other depiction, answer no.
            </HelpButton>;

        return [instruction, this.actionsComponent(options), helpButton, aid_da_depiction];
    }

    public isInside(category: string, options: string[]) {
        const instruction =
            <div className={`${activityStyles.question} runSlideIn`}>
                Is this picture taken from within the {category}?
            </div>;
        const helpButton =
            <HelpButton>
                If the picture is from inside the {category}, answer yes.
                An example of this would be a picture from inside a train.
            </HelpButton>;

        return [instruction, this.actionsComponent(options), helpButton, aid_da_inside];
    }

    public render() {
        let currentInstruction = null;
        let currentAction = null;
        let helpButton = null;
        let visual = null;
        const category = this.props.activity.config.category.toLowerCase();
        const options = this.props.activity.config.options;
        switch (this.props.activity.config.attribute_type) {
            case "LabelName":
                [currentInstruction, currentAction, helpButton, visual] = this.labelNameComponents(category, options);
                break;
            case "IsOccluded":
                [currentInstruction, currentAction, helpButton, visual] = this.isOccluded(category, options);
                break;
            case "IsTruncated":
                [currentInstruction, currentAction, helpButton, visual] = this.isTruncated(category, options);
                break;
            case "IsDepiction":
                [currentInstruction, currentAction, helpButton, visual] = this.isDepiction(category, options);
                break;
            case "IsInside":
                [currentInstruction, currentAction, helpButton, visual] = this.isInside(category, options);
                break;
            default: break;
        }

        const doneButtonHeight = 70;

        return <div
            style={{ height: "100%", width: "100%" }}
            ref={(divElement) => this.view = divElement}
            id="view">
            <ActivityInstruction
                ref={(divElement: any) => this.activityInstruction = divElement}
                helpButton={helpButton}
                visual={visual}>
                {currentInstruction}
            </ActivityInstruction>
            <BoundingBoxCanvas
                instructionDims={this.instructionDims()}
                actionDims={this.actionDims()}
                viewDims={this.viewDims()}
                media_url={this.props.activity.config.media_url}
                boundingBox={this.props.activity.config.bounding_box}
            ></BoundingBoxCanvas>
            <ActivityAction
                ref={(divElement: any) => this.activityAction = divElement}>
                {currentAction}
                <BigButton
                    height={doneButtonHeight}
                    enabled={this.state.finishedInput && !this.props.disabled}
                    onClick={this.doneButtonClicked}
                    label={"Done"}>
                </BigButton>
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

export default DiscreteAttribute;
