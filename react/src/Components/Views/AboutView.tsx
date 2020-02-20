import React, { Component } from "react";
import david from "../../Images/david.jpg";
import george from "../../Images/george.jpg";
import kevin from "../../Images/kevin.jpg";
import matt from "../../Images/matt.jpg";
import { FooterComponent, NavBar } from "../UIElements";
import ActivitiesHomeView from "./ActivitiesHomeView";

class AboutView extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            demoOpen: false,
        };
        // Bindings.
        this.openDemo = this.openDemo.bind(this);

        window.addEventListener("tagbull", (data: any) => {
            if (data.detail === "cancel") {
                this.closeDemo();
            }
        });
    }

    public openDemo() {
        this.setState({ demoOpen: true });
    }

    public closeDemo() {
        this.setState({ demoOpen: false });
    }

    public render() {
        let activitiesComponent = null;
        if (this.state.demoOpen) {
            activitiesComponent = <ActivitiesHomeView></ActivitiesHomeView>;
        }
        return <div>
            <NavBar>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/about">About Us</a>
                </li>
                <li>
                    <span style={{ borderRadius: "2px", backgroundColor: "#6600ff", padding: "10px", color: "white" }}
                        onClick={this.openDemo}>Try Our Demo</span>
                </li>
            </NavBar>

            <div style={{ minHeight: "100vh", overflow: "hidden" }}>
                <header>
                    <div className="header-bg purpleGradient"></div>
                    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                        <div style={{ height: "100px" }}></div>
                        <h1 className="textShadow" style={{ fontSize: "5em" }}>Our Company</h1>
                        <div style={{ height: "50px" }}></div>
                        <span style={{ color: "white", position: "relative", fontSize: "1.5em", padding: "10px" }}>
                            We're transforming the way people interact with data.
                        </span>
                    </div>
                </header>

                <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                    <div style={{ height: "100px" }}></div>
                    <div style={{ fontSize: "1.4em", lineHeight: "1.5em" }}>
                        We're at an exciting point in computing history. The machine learning revolution is already
                        under way, and we're proud to be a part of it. Machine learning is powered by data, and while
                        we may be generating a lot of data, it is hard to make use of it without human intervention.
                        Here at TagBull, we're committed to finding the best way of creating and delivering high quality
                        labels because we believe that's the only way forward.
                    </div>

                    <div style={{ height: "100px" }}></div>
                    <h1>Meet the Team</h1>
                    <div style={{ height: "50px" }}></div>
                    <div style={{ fontSize: "1.4em", lineHeight: "1.5em" }}>
                        With combined experience in machine learning, computer vision, game development and scalable
                        software systems at companies like Google, Apple, Facebook, Snap and Microsoft, you can rest
                        assured that your datasets are in capable hands.
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: "25%", minWidth: "150px", display: "inline-block" }}>
                            <img src={george} alt="George Utsin" style={{ width: "70%", padding: "15%", borderRadius: "100%" }} />
                            <div style={{ fontSize: "1.2em" }}>
                                George Utsin
                            </div>
                            <div style={{ fontStyle: "italic", paddingTop: "10px" }}>
                                Co-Founder
                            </div>
                        </div>
                        <div style={{ width: "25%", minWidth: "150px", display: "inline-block" }}>
                            <img src={kevin} alt="George Utsin" style={{ width: "70%", padding: "15%", borderRadius: "100%" }} />
                            <div style={{ fontSize: "1.2em" }}>
                                Kevin Peng
                            </div>
                            <div style={{ fontStyle: "italic", paddingTop: "10px" }}>
                                Co-Founder
                            </div>
                        </div>
                        <div style={{ width: "25%", minWidth: "150px", display: "inline-block" }}>
                            <img src={matt} alt="George Utsin" style={{ width: "70%", padding: "15%", borderRadius: "100%" }} />
                            <div style={{ fontSize: "1.2em" }}>
                                Matt D'Souza
                            </div>
                            <div style={{ fontStyle: "italic", paddingTop: "10px" }}>
                                ML Engineer
                            </div>
                        </div>
                        <div style={{ width: "25%", minWidth: "150px", display: "inline-block" }}>
                            <img src={david} alt="George Utsin" style={{ width: "70%", padding: "15%", borderRadius: "100%" }} />
                            <div style={{ fontSize: "1.2em" }}>
                                David Mediati
                            </div>
                            <div style={{ fontStyle: "italic", paddingTop: "10px" }}>
                                Game Developer
                            </div>
                        </div>
                    </div>

                    <div style={{ height: "100px" }}></div>

                    <h1>Investors</h1>
                    <div style={{ height: "50px" }}></div>
                    <div className="velocityLogo"></div>
                    <div style={{ height: "100px" }}></div>

                    <h1>In the News</h1>
                    <div style={{ height: "50px" }}></div>
                    <div style={{ color: "#666", backgroundColor: "white", padding: "40px", borderBottom: "1px solid #eee" }}>
                        <a href="http://velocity.uwaterloo.ca/2019/03/meet-the-winners-of-the-24th-velocity-fund-finals-5k-competition/"
                            style={{ textDecorationColor: "#6100ff" }}>
                            <div style={
                                { color: "#6600ff", fontSize: "2em", paddingBottom: "30px", fontFamily: "Heebo" }
                                }>
                                Meet the winners of the 24th Velocity Fund Finals
                            </div>
                        </a>
                        MARCH 26, 2019
                            </div>
                    <div style={{ height: "100px" }}></div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
            {activitiesComponent}
        </div>;
    }
}

export default AboutView;
