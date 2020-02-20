import React, { Component } from "react";
import ResizeDetector from "react-resize-detector";
import { BoundingBoxCanvas } from "../Canvases";
import { ActivityAction, ActivityInstruction, BigButtonComponent, HelpButtonComponent, MultipleOptionsComponent } from "../UIElements";

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
        this.props.notifyActivityComplete({
            // TODO georgeutsin: update this after backend is figured out
        });
    }

    public onLabelChaged(label: string) {
        this.setState({ selectedLabel: label, finishedInput: true });
    }

    public labelNameComponents(category1: string, category2: string) {
        const instruction =
            <div className="question runSlideIn">
                Is this a <b>{category1}</b> or a <b>{category2}</b>?
                <HelpButtonComponent>
                    Determine if the object located inside the box is a
                    <b>{category1}</b> or a <b>{category2}</b>
                </HelpButtonComponent>
            </div>;
        const action =
            <MultipleOptionsComponent
                options={[category1, category2, "neither"]}
                onLabelChange={this.onLabelChaged}
            >
            </MultipleOptionsComponent>;
        return [instruction, action];
    }

    public isOccluded(category: string) {
        const instruction =
            <div className="question runSlideIn">
                Is any part of the {category} covered by another object?
                <HelpButtonComponent>
                    If any part of the object is covered by any other object, answer yes. <br/>
                    If the whole object is not visible in the image due to another object, answer no.
                </HelpButtonComponent>
            </div>;
        const action =
            <MultipleOptionsComponent
                options={["yes", "no"]}
                onLabelChange={this.onLabelChaged}
            >
            </MultipleOptionsComponent>;
        return [instruction, action];
    }

    public isTruncated(category: string) {
        const instruction =
            <div className="question runSlideIn">
                Is any part of the {category} outside the edges of the image?
                <HelpButtonComponent>
                    If any part of the object goes outside the borders of the image, answer yes.
                </HelpButtonComponent>
            </div>;
        const action =
            <MultipleOptionsComponent
                options={["yes", "no"]}
                onLabelChange={this.onLabelChaged}
            >
            </MultipleOptionsComponent>;
        return [instruction, action];
    }

    public isDepiction(category: string) {
        const instruction =
            <div className="question runSlideIn">
                Is this a real {category} (i.e: not a drawing)?
                <HelpButtonComponent>
                    If the image looks like a photo or is photorealistic enough that you can't tell, answer yes.
                    Otherwise, if its a drawing, rendering, cartoon, or any other depiction, answer no.
                </HelpButtonComponent>
            </div>;
        const action =
            <MultipleOptionsComponent
                options={["yes", "no"]}
                onLabelChange={this.onLabelChaged}
            >
            </MultipleOptionsComponent>;
        return [instruction, action];
    }

    public isInside(category: string) {
        const instruction =
            <div className="question runSlideIn">
                Is this picture taken from within the {category}?
                <HelpButtonComponent>
                    If the picture is from inside the {category}, answer yes.
                    An example of this would be a picture from inside a train.
                </HelpButtonComponent>
            </div>;
        const action =
            <MultipleOptionsComponent
                options={["yes", "no"]}
                onLabelChange={this.onLabelChaged}
            >
            </MultipleOptionsComponent>;
        return [instruction, action];
    }

    public render() {
        let currentInstruction = null;
        let currentAction = null;
        switch (this.props.activity.config.classification) {
            case "LabelName":
                const category1 = this.props.activity.config.first_category.toLowerCase();
                const category2 = this.props.activity.config.second_category.toLowerCase();
                [currentInstruction, currentAction] = this.labelNameComponents(category1, category2);
                break;
            case "IsOccluded":
                let category = this.props.activity.config.category.toLowerCase();
                [currentInstruction, currentAction] = this.isOccluded(category);
                break;
            case "IsTruncated":
                category = this.props.activity.config.category.toLowerCase();
                [currentInstruction, currentAction] = this.isTruncated(category);
                break;
            case "IsDepiction":
                category = this.props.activity.config.category.toLowerCase();
                [currentInstruction, currentAction] = this.isDepiction(category);
                break;
            case "IsInside":
                category = this.props.activity.config.category.toLowerCase();
                [currentInstruction, currentAction] = this.isInside(category);
                break;
            default: break;
        }

        const doneButtonHeight = 70;

        return <div
            style={{ height: "100%", width: "100%" }}
            ref={(divElement) => this.view = divElement}
            id="view">
            <ActivityInstruction
                ref={(divElement: any) => this.activityInstruction = divElement}>
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

export default DiscreteAttribute;
