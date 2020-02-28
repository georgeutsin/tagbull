import React, { Component } from "react";

interface IHelpButtonState {
    visible: boolean;
}

class HelpButtonComponent extends Component<{}, IHelpButtonState> {
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
            helpWindow = <div className="goodJobBackground">
                <div className="both-center helpWindow">
                    <div style={{ overflow: "hidden" }}>
                        <span className="closeButton" onClick={this.closeButton}>
                            <b>x</b>
                        </span>
                    </div>
                    {this.props.children}
                </div>
            </div>;
        }

        return (
            <span>
                <div className="help">
                    <button className="helpButton" onClick={this.helpButton}>
                        ?
                    </button>
                </div>
                {helpWindow}
            </span>
        );
    }
}

export default HelpButtonComponent;
