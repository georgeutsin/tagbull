import React, { Component } from "react";

import styles from "./ProgressBar.module.scss";

class ProgressBar extends Component<any, any> {
    public render() {
        const height = this.props.height ? (this.props.height - 20).toString() + "px" : "30px";
        const progress = Math.min(this.props.progress, 100);
        return <div style={{ padding: "10px" }}>
            <div
                className={styles.progressBar}
                style={{ height }}>
                <div
                    className={`${styles.progressBarFill} purpleGradient`}
                    style={{ width: progress + "%" }}>
                </div>
                <div className={styles.progressBarTextOverlay} style={{ marginTop: "-" + height }}>
                    {this.props.children}
                </div>
            </div>
        </div>;
    }
}

export default ProgressBar;
