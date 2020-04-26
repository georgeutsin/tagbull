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
                <h5>Lifetime Total</h5> {props.actor.lifetime_total_samples}  samples
                <h5>Lifetime Correct</h5> {props.actor.lifetime_correct_samples} samples
            </div>
            {props.project_id && <div className="thirds">
                <h5>Project Total</h5> {props.stats.project_total_samples} samples
                <h5>Project Total</h5> {props.stats.project_correct_samples} samples
            </div>}
            <div className="thirds"></div>
        </div>
        <div style={{ height: 20 }}></div>
    </div>;
}

export {
    ActorDetails,
};
