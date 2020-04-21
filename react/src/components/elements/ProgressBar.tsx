import React, { Component } from "react";

class ProgressBar extends Component<any, any> {
    public render() {
        return <div style={{ padding: "10px" }}>
            <div
                className="progressBar"
                style={{ height: this.props.height ? (this.props.height - 20).toString() + "px" : "30px" }}>
                <div className="progressBarFill purpleGradient" style={{ width: this.props.progress + "%" }}>
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}

export default ProgressBar;
