import React, { Component } from "react";
import { Footer, LoginForm, NavBar } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class LoginView extends Component {
    public render() {
        return <div>
            <NavBar>
            </NavBar>
            <div className={portalStyles.portalWrapper} style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className={portalStyles.mainCard} style={{ maxWidth: 400 }}>
                    <LoginForm></LoginForm>
                </div>
            </div>
            <div className="spacer"></div>
            <Footer></Footer>
        </div>;
    }
}

export default LoginView;
