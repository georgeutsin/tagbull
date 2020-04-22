import React from "react";
import styles from "./ActivityAction.module.scss";

const ActivityAction = React.forwardRef((props: any, ref: any) => (
    <div
        ref={ref}
        className={styles.activityAction}
        id="activityAction">
        {props.children}
    </div>
));

export default ActivityAction;
