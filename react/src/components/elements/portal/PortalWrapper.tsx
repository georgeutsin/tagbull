import React, { Component } from "react";
import { Footer, NavBar } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class PortalWrapper extends Component<any, any> {
    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/projects">Projects</a>
                </li>
                <li>
                    <a href="/actors">Actors</a>
                </li>
            </NavBar>
            <div className={portalStyles.portalWrapper} style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className={portalStyles.actionBar}>
                    <span style={{ display: "inline-block" }}><h1>{this.props.title}</h1></span>
                    {this.props.actions}
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className={portalStyles.mainCard}>
                    {this.props.children}
                </div>
            </div>
            <div className="spacer"></div>
            <Footer></Footer>
        </div>;
    }
}

export default PortalWrapper;
