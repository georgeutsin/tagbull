import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Backend } from "../../../utils";
import styles from "./LoginForm.module.scss";

class LoginForm extends Component<any, any> {
    constructor(props: any) {
        super(props);
        const t = localStorage.getItem("token")
        if (t && t !== "") {
            props.history.push("/projects");
        }

        this.state = {
            showSignIn: true,
            email: "",
            password: "",
        };
        this.signInViewClicked = this.signInViewClicked.bind(this);
        this.registerViewClicked = this.registerViewClicked.bind(this);
        this.signInButtonClicked = this.signInButtonClicked.bind(this);
        this.registerButtonClicked = this.registerButtonClicked.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.authCallback = this.authCallback.bind(this);
    }

    public signInViewClicked() {
        this.setState({ showSignIn: true });
    }

    public registerViewClicked() {
        this.setState({ showSignIn: false });
    }

    public handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ email: event.target.value });
    }

    public handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ password: event.target.value });
    }

    public authCallback(response: any) {
        if (response.status === 200) {
            localStorage.setItem("token", response.data.data.auth_token);
            Backend.updateToken();
            this.props.history.push("/projects");
        } else {
            // TODO handle non 200 response
        }
    }

    public signInButtonClicked(event: any) {
        event.preventDefault();
        Backend.postLogin(this.state.email, this.state.password).then(this.authCallback);
    }

    public registerButtonClicked(event: any) {
        event.preventDefault();
        Backend.postRegister(this.state.email, this.state.password).then(this.authCallback);
    }

    public render() {
        const emailInput = <input
            type="text"
            placeholder="email"
            name="email"
            value={this.state.email}
            onChange={this.handleEmailChange} />;

        const passwordInput = <input
            type="password"
            placeholder="password"
            name="password"
            value={this.state.password}
            onChange={this.handlePasswordChange} />;

        const signInView = <div className={styles.login}>
            <form onSubmit={this.signInButtonClicked}>
                {emailInput}
                {passwordInput}
                <div style={{ textAlign: "left", color: "#aaa", fontSize: "0.8em", marginTop: "0.5em" }}>
                    &nbsp;<a style={{ color: "inherit" }} href="/">Forgot Password?</a>
                </div>
                <button type="submit" style={{ marginTop: "70px" }}>Sign In</button>
            </form>
        </div>;

        const registerView = <div className={styles.login}>
            <form onSubmit={this.registerButtonClicked}>
                {emailInput}
                {passwordInput}
                <input type="password" placeholder="confirm password" name="password" />
                <button type="submit" style={{ marginTop: "70px" }}>Register</button>
            </form>
        </div>;

        return <div>
            <div className={styles.loginOption} onClick={this.signInViewClicked}>
                SIGN IN
            </div>
            <div className={styles.loginOption} onClick={this.registerViewClicked}>
                REGISTER
            </div>
            {this.state.showSignIn ? signInView : registerView}
        </div>;
    }
}

export default withRouter(LoginForm);
