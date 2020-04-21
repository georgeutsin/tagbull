import React, { Component } from "react";

interface IBigButtonProps {
    height?: number;
    enabled: boolean;
    onClick: any;
    label: string;
}

class BigButton extends Component<IBigButtonProps, any> {
    constructor(props: IBigButtonProps) {
        super(props);
        this.doneClicked = this.doneClicked.bind(this);
    }

    public doneClicked() {
        this.props.onClick();
    }

    public render() {
        return <div style={{ height: this.props.height || 70, paddingTop: "10px" }}>
            <button
                className={"doneButton" + (!this.props.enabled ? " disabledButton" : "")}
                disabled={!this.props.enabled}
                onClick={this.doneClicked}>
                <span style={{ fontSize: 50 }}>{this.props.label}</span>
            </button>
        </div>;
    }
}

export default BigButton;
