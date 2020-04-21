import React, { Component } from "react";

class LoginFormComponent extends Component {
    public render() {
        return <div>
            <div className="loginOption selected ">
                SIGN IN
                    </div>
            <div className="loginOption">
                REGISTER
                    </div>
            <div className="login">
                <form>
                    <input type="text" placeholder="email" name="email" />
                    <input type="password" placeholder="password" name="password" />
                    <div style={{ textAlign: "left", color: "#aaa", fontSize: "0.8em", marginTop: "0.5em" }}>
                        &nbsp;<a style={{ color: "inherit" }} href="/">Forgot Password?</a>
                    </div>
                </form>
                <a href="/projects"><button style={{ marginTop: "70px" }}>Sign In</button></a>
            </div>
        </div>;
    }
}

export default LoginFormComponent;
