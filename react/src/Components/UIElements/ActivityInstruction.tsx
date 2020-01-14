import React from "react";
import ResizeDetector from "react-resize-detector";

const ActivityInstruction = React.forwardRef((props: any, ref: any) => (
    <div
        ref={ref}
        id="activityInstruction"
        className="activityInstruction">
        {props.children}
        <div style={{ clear: "both" }}></div>
        <ResizeDetector
            handleWidth
            handleHeight
            onResize={props.onResize} />
    </div>
));

export default ActivityInstruction;
