import React from "react";

import portalStyles from "../../../styles/portal.module.scss";


function ActorDetails(props: any) {
    let created_at = props.actor.created_at ? props.actor.created_at : "";
    created_at = new Date(created_at.replace(" ", "T"));
    created_at = created_at.toLocaleString("en-us", { month: "long" })
        + " " + created_at.getDate() + ", " + created_at.getFullYear();
    return <div className={portalStyles.projectSection}>
        <h2>Details</h2>
        <div className={portalStyles.detailsSection}>
            <div className="thirds">
                <h5>Created At</h5> {created_at}
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