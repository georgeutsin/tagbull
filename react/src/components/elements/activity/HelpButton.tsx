import React, { Component } from "react";

import styles from "./HelpButton.module.scss";

interface IHelpButtonState {
    visible: boolean;
}

class HelpButton extends Component<{}, IHelpButtonState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
        };

        // Bindings
        this.helpButton = this.helpButton.bind(this);
        this.closeButton = this.closeButton.bind(this);
    }

    public helpButton() {
        this.setState((state, props) => ({
            visible: !state.visible,
        }));
    }

    public closeButton() {
        this.setState({
            visible: false,
        });
    }

    public render() {
        let helpWindow = null;
        if (this.state.visible) {
            helpWindow = <div className="fullscreenOverlayBackground">
                <div className={`both-center ${styles.helpWindow}`} style={{fontSize: "2em"}}>
                    <div style={{ overflow: "hidden" }}>
                        <span className={styles.closeButton} onClick={this.closeButton}>
                            <b>x</b>
                        </span>
                    </div>
                    {this.props.children}
                </div>
            </div>;
        }

        return (
            <div>
                <div className={styles.help}>
                    <div className={styles.helpButton} onClick={this.helpButton}>
                        <span style={{verticalAlign: "sub"}}>HELP</span>
                    </div>
                </div>
                {helpWindow}
            </div>
        );
    }
}

export default HelpButton;
