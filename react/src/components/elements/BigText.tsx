import React, { Component } from "react";

class BigText extends Component {
    public render() {
        return <div className="sentence">
            tagbull is <br></br>for dataset<br></br>
            <div className="slidingVertical">
                <span className="blueGradientText">creation</span>
                <span className="blueGradientText">extension</span>
                <span className="blueGradientText">validation</span>
                <span className="blueGradientText">visualization</span>&nbsp;
            </div>
        </div>;
    }
}

export default BigText;
