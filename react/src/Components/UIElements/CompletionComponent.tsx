import React, { Component } from "react";
import "./Completion.css";

const completionTexts: string[] = [
    "That's it!",
    "You're done!",
    "You're finished!",
    "Guess we're done here",
    "Guess that's all",
];

class CompletionComponent extends Component<any, any> {
    public render() {
        const rand = Math.floor(Math.random() * Math.floor(completionTexts.length - 1));;
        return <div className="fullscreenOverlay">
            <div className="vertical-center">
                <div style={{ padding: 10 }}>
                    <h1 className="completion">
                        {completionTexts[rand]}
                    </h1>
                    <div>
                        Tap anywhere to claim your reward.
                </div>
                </div>
            </div>
        </div>;
    }
}

export default CompletionComponent;
