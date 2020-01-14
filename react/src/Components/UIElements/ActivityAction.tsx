import React from "react";

const ActivityAction = React.forwardRef((props: any, ref: any) => (
    <div
        ref={ref}
        className="activityAction"
        id="activityAction">
        {props.children}
    </div>
));

export default ActivityAction;
