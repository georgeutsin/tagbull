import React, { Component } from "react";
import styles from "./ActivityActionButton.module.scss";

interface IActionButtonProps {
    enabled: boolean;
    onClick: any;
    label: string;
    width?: any;
}

class ActivityActionButton extends Component<IActionButtonProps, any> {
    constructor(props: IActionButtonProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick() {
        this.props.onClick();
    }

    public render() {
        let className = styles.activityActionButton;
        if (!this.props.enabled) {
            className += ` ${styles.disabled}`;
        }
        const style = this.props.width ? { width: this.props.width } : undefined;
        return <div className={className} style={style}>
            <button
                disabled={!this.props.enabled}
                onClick={this.handleClick}>
                {this.props.label}
            </button>
        </div>;
    }
}

export default ActivityActionButton;
