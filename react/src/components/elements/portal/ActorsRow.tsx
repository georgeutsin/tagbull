import React from "react";
import { ProgressBar } from "..";

import portalStyles from "../../../styles/portal.module.scss";
import styles from "./ActorsRow.module.scss";

function ActorsRow(props: any) {
    const actor = props.actor;
    const d = new Date(actor.created_at.replace(" ", "T"));
    const createdAt = d.toLocaleString("en-us", { month: "long" })
        + " " + d.getDate() + ", " + d.getFullYear();
    const accuracy = actor.correct_samples * 100 / actor.total_samples;
    const link = props.project_id ? `/projects/${props.project_id}/actors/${actor.id}` : `/actors/${actor.id}`;
    return <div key={actor.id}>
        <a href={link} className={portalStyles.tableLink}>
            <div className={portalStyles.tableRow}>
                <div className={`${styles.actorID} ${portalStyles.tableColumn}`}>
                    {actor.id}
                </div>
                <div className={`${styles.actorSig} ${portalStyles.tableColumn}`}>
                    {actor.actor_sig}
                </div>
                <div className={`${styles.actorAccuracy} ${portalStyles.tableColumn}`}>
                    <ProgressBar
                        progress={accuracy}
                        height={50}>
                        <div className={portalStyles.centeredProgress}>
                            <span>{actor.correct_samples} / {actor.total_samples}</span>
                        </div>
                    </ProgressBar>
                </div>
                <div className={`${styles.actorCreatedAt} ${portalStyles.tableColumn}`}>
                    {createdAt}
                </div>
            </div>
        </a>
    </div>;
}

function ActorsHeader(props: any) {
    return <div className={portalStyles.tableHeader}>
        <div className={`${styles.actorID} ${portalStyles.tableColumn}`}>ID</div>
        <div className={`${styles.actorSig} ${portalStyles.tableColumn}`}>Signature</div>
        <div className={`${styles.actorAccuracy} ${portalStyles.tableColumn}`}>Accuracy</div>
        <div className={`${styles.actorCreatedAt} ${portalStyles.tableColumn}`}>Created At</div>
    </div>;
}

export {
    ActorsRow,
    ActorsHeader,
};
