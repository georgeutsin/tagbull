import React from "react";
import ResizeDetector from "react-resize-detector";
import styles from "./ActivityInstruction.module.scss";

const ActivityInstruction = React.forwardRef((props: any, ref: any) => (
    <div
        ref={ref}
        id="activityInstruction"
        className={styles.activityInstruction}>
        <div className={styles.visualAid}>
            <img src={props.visual} alt="Activity instruction visual" />
            {props.helpButton}
        </div>
        <div className={styles.instructionText}>
            {props.children}
        </div>
        <div style={{ clear: "both" }}></div>
        <ResizeDetector
            handleWidth
            handleHeight
            onResize={props.onResize} />
    </div>
));

export default ActivityInstruction;
