import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Footer, NavBar } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class PortalWrapper extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.logoutClicked = this.logoutClicked.bind(this);
    }

    public logoutClicked() {
        localStorage.removeItem("token");
        this.props.history.push("/login");
    }

    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/projects">Projects</a>
                </li>
                <li>
                    <a href="/actors">Actors</a>
                </li>
                <li>
                    <div onClick={this.logoutClicked}>Logout</div>
                </li>
            </NavBar>
            <div className={portalStyles.portalWrapper} style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className={portalStyles.actionBar}>
                    <span style={{ display: "inline-block" }}><h1>{this.props.title}</h1></span>
                    {this.props.actions}
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className={portalStyles.mainCard} style={{ maxWidth: this.props.maxWidth ?? "100%" }}>
                    {this.props.children}
                </div>
            </div>
            <div className="spacer"></div>
            <Footer></Footer>
        </div>;
    }
}

export default withRouter(PortalWrapper);
