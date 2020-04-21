import React, { Component } from "react";
import { LoginFormComponent } from "../elements";

class LoginView extends Component {
    public render() {
        return <div>
            <div className="pageWrapper menuBar">
                <a href="/"><span style={{ width: "170px", height: "100%", float: "left" }}></span></a>
            </div>
            <div style={{ height: "100vh", textAlign: "center", background: "#fbfbfb" }}>
                <div className="floatingPanel" style={{ display: "inline-block", width: "400px" }}>
                    <LoginFormComponent></LoginFormComponent>
                </div>
            </div>
        </div>;
    }
}

export default LoginView;
