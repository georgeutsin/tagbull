import React, { Component } from "react";
import "./ActivityActionButton.css";

interface IActionButtonProps {
    enabled: boolean;
    onClick: any;
    label: string;
    width: any;
}

class ActivityActionButtonComponent extends Component<IActionButtonProps, any> {
    constructor(props: IActionButtonProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick() {
        this.props.onClick();
    }

    public render() {
        let className = "activityActionButton";
        if (!this.props.enabled) {
            className += " disabled";
        }
        return <div className={className} style={{ width: this.props.width || "99%" }}>
            <button
                disabled={!this.props.enabled}
                onClick={this.handleClick}>
                {this.props.label}
            </button>
        </div>;
    }
}

export default ActivityActionButtonComponent;
