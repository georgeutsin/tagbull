import React, { Component } from "react";
import { NavBar } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class ActorsListView extends Component {
    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className={portalStyles.portalWrapper} style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className={portalStyles.actionBar}>
                    <span style={{ display: "inline-block" }}><h1>Actors</h1></span>
                    <div style={{ clear: "both" }}></div>
                </div>

                <div className={portalStyles.mainCard}>
                </div>
            </div>
        </div>;
    }
}

export default ActorsListView;
