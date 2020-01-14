import React, { Component } from "react";

interface IDoneButtonProps {
    height?: number;
    enabled: boolean;
    onClick: any;
}

class DoneButtonComponent extends Component<IDoneButtonProps, any> {
    constructor(props: IDoneButtonProps) {
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
                <span style={{ fontSize: 50 }}>Done</span>
            </button>
        </div>;
    }
}

export default DoneButtonComponent;
