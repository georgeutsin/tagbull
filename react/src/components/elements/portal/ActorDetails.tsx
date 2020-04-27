import React from "react";

import portalStyles from "../../../styles/portal.module.scss";


function ActorDetails(props: any) {
    let createdAt = props.actor.created_at ? props.actor.created_at : "";
    createdAt = new Date(createdAt.replace(" ", "T"));
    createdAt = createdAt.toLocaleString("en-us", { month: "long" })
        + " " + createdAt.getDate() + ", " + createdAt.getFullYear();
    return <div className={portalStyles.projectSection}>
        <h2>Details</h2>
        <div className={portalStyles.detailsSection}>
            <div className="thirds">
                <h5>Created At</h5> {createdAt}
                <h5>Correct</h5> {props.actor.correct_samples} samples
                <h5>Total</h5> {props.actor.total_samples}  samples
            </div>
            <div className="thirds"></div>
        </div>
        <div style={{ height: 20 }}></div>
    </div>;
}

export {
    ActorDetails,
};
