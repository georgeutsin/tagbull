import React, { Component } from "react";

import styles from "./LoginForm.module.scss";

class LoginForm extends Component {
    public render() {
        return <div>
            <div className={styles.loginOption}>
                SIGN IN
            </div>
            <div className={styles.loginOption}>
                REGISTER
            </div>
            <div className={styles.login}>
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

export default LoginForm;
