import React, { Component } from "react";

import portalStyles from "../../styles/portal.module.scss";
import styles from "./BigButton.module.scss";

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
                className={styles.bigButton + (!this.props.enabled ? ` ${portalStyles.disabledButton}` : "")}
                disabled={!this.props.enabled}
                onClick={this.doneClicked}>
                <span style={{ fontSize: 50 }}>{this.props.label}</span>
            </button>
        </div>;
    }
}

export default BigButton;
