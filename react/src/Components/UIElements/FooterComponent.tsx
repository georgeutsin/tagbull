import React, { Component } from "react";
import logo from "../../tagbull-white.svg";

class FooterComponent extends Component {
    public render() {
        return <div className="footerParent">
            <div className="bodyWrapper">
                <div style={{ padding: "10px" }}>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ width: "50%", display: "inline-block", verticalAlign: "top" }}>
                        <a href="/"><img src={logo} alt="Logo" height="50px" /></a>
                        <br></br>
                        Copyright 2019
                </div>
                    <div style={{
                        width: "25%", minWidth: "175px", display: "inline-block",
                        verticalAlign: "top", fontSize: "1.2em", lineHeight: "1.5em",
                    }}>
                        <a href="/about" style={{ textDecoration: "none", color: "#888" }}>About Us</a>
                        <br />
                        <a href="/careers" style={{ textDecoration: "none", color: "#888" }}>Careers</a>
                        <br />
                        <a href="mailto:hello@tagbull.com" style={{ textDecoration: "none", color: "#888" }}>
                            Contact
                        </a>: hello@tagbull.com
                        <br />
                    </div>
                    <div style={{
                        width: "25%", minWidth: "175px", display: "inline-block",
                        verticalAlign: "top", fontSize: "1.2em", lineHeight: "1.5em",
                    }}>
                        <a href="/privacy" style={{ textDecoration: "none", color: "#888" }}>Privacy Policy</a>
                        <br />
                        <a href="/terms" style={{ textDecoration: "none", color: "#888" }}>Terms of Service</a>
                        <br />
                    </div>
                    <div style={{ height: "50px" }}></div>
                </div>
            </div>
        </div>;
    }
}

export default FooterComponent;
