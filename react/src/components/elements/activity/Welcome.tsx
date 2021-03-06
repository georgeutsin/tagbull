import React, { Component } from "react";
import BigButton from "../common/BigButton";

import styles from "./HelpButton.module.scss";

interface IWelcomeState {
    visible: boolean;
}

class Welcome extends Component<{}, IWelcomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            visible: true,
        };

        // Bindings
        this.closeButton = this.closeButton.bind(this);
    }

    public closeButton() {
        this.setState({
            visible: false,
        });
    }

    public render() {
        const component = <div className="fullscreenOverlayBackground">
            <div className={`both-center ${styles.helpWindow}`}>
                <div className="both-center">
                    <div style={{ padding: 10 }} className="runSlideIn">
                        <h1 className="accent">Hey there!</h1>
                        <br></br>
                        This isn't a regular ad; this is a TagBull activity.
                        <br></br>
                        <br></br>
                        Answer a few questions to claim your reward!
                        <br></br>
                        <br></br>
                        <BigButton
                            enabled={true}
                            onClick={this.closeButton}
                            label={"ok"}>
                        </BigButton>
                    </div>
                </div>
            </div>
        </div>;
        if (this.state.visible) {
            return component;
        }

        return null;
    }
}

export default Welcome;
