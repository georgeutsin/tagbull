import confetti from "canvas-confetti";
import React, { Component } from "react";
import "./Completion.css";

const completionTexts: string[] = [
    "That's it!",
    "Done!",
    "Finished!",
    "That's all!",
    "Nice!",
];

class CompletionComponent extends Component<any, any> {
    public render() {
        confetti({
            particleCount: 100,
            spread: 80,
            angle: 225,
            colors: ["#6100ff", "#a332ff"],
            origin: { x: 1, y: -0.3 },
        });

        confetti({
            particleCount: 100,
            spread: 80,
            angle: 315,
            colors: ["#6100ff", "#a332ff"],
            origin: { x: 0, y: -0.3 },
        });
        const rand = Math.floor(Math.random() * Math.floor(completionTexts.length - 1)); ;
        return <div className="fullscreenOverlay">
            <div className="vertical-center">
                <div style={{ padding: 10 }}>
                    <h1 className="completion">
                        {completionTexts[rand]}
                    </h1>
                    <br></br>
                    <div>
                        Tap anywhere to claim your reward.
                </div>
                </div>
            </div>
        </div>;
    }
}

export default CompletionComponent;
