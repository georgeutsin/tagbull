import React, { Component } from "react";
import BigButtonComponent from "./BigButtonComponent";

interface IHelpButtonState {
    visible: boolean;
}

class WelcomeComponent extends Component<{}, IHelpButtonState> {
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
        const component = <div className="goodJobBackground">
            <div className="both-center helpWindow">
            <div className="both-center">
                <div style={{ padding: 10 }} className="runSlideIn">
                <h1 className="completion">Hey there!</h1>
                <br></br>
                This isn't a regular ad; this is a TagBull activity.
            <br></br>
            <br></br>
                Answer three (3) questions to claim your reward!
                <br></br>
                <br></br>
                <BigButtonComponent
                    enabled={true}
                    onClick={this.closeButton}
                    label={"ok"}
                ></BigButtonComponent>
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

export default WelcomeComponent;
