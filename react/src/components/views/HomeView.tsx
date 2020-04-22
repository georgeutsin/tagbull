import React, { Component } from "react";
import play from "../../images/play-button.svg";
import { Footer, NavBar } from "../elements";
import ActivitiesHomeView from "./ActivitiesHomeView";

import styles from "./HomeView.module.scss";

const scrollToRef = (ref: any) => window.scrollTo({ top: ref.current.offsetTop - 76, behavior: "smooth" });

class HomeView extends Component<any, any> {
    private productRef: any;
    private executeScroll: any;

    constructor(props: any) {
        super(props);
        this.state = {
            demoOpen: false,
            email: "",
        };
        this.productRef = React.createRef();
        const executeScroll = () => scrollToRef(this.productRef);

        // Bindings.
        this.openDemo = this.openDemo.bind(this);
        this.executeScroll = executeScroll.bind(this);
        this.handleChange = this.handleChange.bind(this);

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

    public handleChange(e: any) {
        this.setState({ email: e.target.value });
    }

    public render() {
        let activitiesComponent = null;
        if (this.state.demoOpen) {
            activitiesComponent = <ActivitiesHomeView></ActivitiesHomeView>;
        }
        const validateForm = () => {
            // eslint-disable-next-line
            const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
            return validEmailRegex.test(this.state.email);
        };

        const handleSubmit = (e: any) => {
            if (!validateForm()) {
                e.preventDefault();
                alert("Please enter an email");
            }
        };

        return <div>
            <NavBar isLanding>
                <li>
                    {/* eslint-disable-next-line  */}
                    <a onClick={this.executeScroll}>Product</a>
                </li>
                <li>
                    <a href="/about">About Us</a>
                </li>
                <li>
                    <span style={{ borderRadius: "2px", backgroundColor: "#6600ff", padding: "10px", color: "white" }}
                        onClick={this.openDemo}>Try Our Demo</span>
                </li>
            </NavBar>

            <div style={{ height: "100vh", width: "100%", background: "white" }}>
                <div style={{ width: "100%", maxWidth: "1080px", margin: "0 auto" }}>
                    <div className="vertical-center" style={{ width: "100%", maxWidth: "1080px" }} >
                        <div style={{ display: "inline-block", width: "50%" }}>
                            <div style={{ paddingLeft: "10px" }}>
                                <div className={styles.tagbullLogo}
                                    style={{ width: "450px", height: "150px" }}>
                                </div>
                                <div
                                    style={{ fontSize: "2em", lineHeight: "1.3em", fontWeight: 100 }}>
                                    High quality training data.<br />
                                    No sacrifices.
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "inline-block", width: "50%" }}>
                            <div style={{ paddingRight: "10px" }}>
                                <div
                                    className={styles.formWrapper}
                                    style={{ maxWidth: "350px", marginLeft: "auto", marginRight: 0 }}>
                                    <form
                                        name="contact-top"
                                        method="POST"
                                        data-netlify="true"
                                        netlify-honeypot="bot-field"
                                        ref="form-top"
                                        onSubmit={handleSubmit}>
                                        <input type="hidden" name="form-name" value="contact-top" />
                                        <input
                                            type="text"
                                            placeholder="you@email.com"
                                            name="email"
                                            onChange={this.handleChange} />
                                        <button type="submit" style={{ marginTop: "20px" }}>Get Updates</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div ref={this.productRef} style={{ minHeight: "100vh", overflow: "hidden" }}>
                <div className="spacer"></div>
                <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                    <div style={{ width: "100%", padding: "5px" }}>
                        <div>
                            <div className={styles.promoTextHeader} style={{ maxWidth: "600px" }}>
                                <span className={styles.promoInverted}>Better models</span> start
                                with <span className={styles.promoInverted}>better data</span>,
                                so we focus on two things:
                        </div>
                        </div>
                    </div>
                    <div className={styles.promoSection} style={{ marginTop: 0 }}>

                        <div className={styles.promoSection} style={{ marginTop: "0" }}>
                            <div className={styles.promoTitle}>
                                1) Crowd Consensus
                            </div>
                            <div className={`${styles.promoGraphic} ${styles.graphic1} ${styles.responsiveHalf}`}
                                style={{ height: "300px" }}>
                            </div>
                            <div className={`${styles.promoBody} ${styles.responsiveHalf}`}>
                                <div className={styles.promoTextHeader} style={{ fontSize: "1em" }}>
                                    <span className={styles.promoInverted}>Distribute trust.</span>
                                </div>
                                Instead of trusting a single labeller to be the ground source of truth,
                                we aggregate multiple opinions and apply statistical analysis to
                                generate the best label.<br /><br />
                                This means we can guarantee label quality regardless of the workforce.<br /><br />
                                <div className={styles.promoTextHeader} style={{ fontSize: "1em" }}>
                                    Prioritize <span className={styles.promoInverted}>validation</span> over
                                    measurement.
                                </div>
                                Gold standard questions waste your money and your contractors' time;
                                crowd consensus is here and it works.<br /><br />

                            </div>

                            <div style={{
                                color: "#666", backgroundColor: "white",
                                padding: "40px", marginTop: "50px", borderBottom: "1px solid #eee",
                            }}>
                                <div style={{ fontSize: "2em", paddingBottom: "30px", fontFamily: "Heebo" }}>
                                    Case Study: Open Images Extended
                            </div>
                                <div style={{ display: "inline-block", width: "33%", minWidth: "160px" }}>
                                    Number of Samples per Label
                                    <div style={{
                                        fontSize: "2.5em", fontFamily: "Heebo",
                                        paddingTop: "20px", paddingBottom: "20px",
                                    }}>
                                        5.1
                                    </div>
                                </div>
                                <div style={{ display: "inline-block", width: "33%", minWidth: "160px" }}>
                                    Percentage of Accepted Labels
                                    <div style={{
                                        fontSize: "2.5em", fontFamily: "Heebo",
                                        paddingTop: "20px", paddingBottom: "20px",
                                    }}>
                                        99.6%
                                    </div>
                                </div>
                                <div style={{ display: "inline-block", width: "33%", minWidth: "160px" }}>
                                    Average Cost per Label
                                    <div style={{
                                        fontSize: "2.5em", fontFamily: "Heebo",
                                        paddingTop: "20px", paddingBottom: "20px",
                                    }}>
                                        $0.0413
                                    </div>
                                </div>

                            </div>
                            <div style={{ clear: "both" }}></div>
                        </div>
                        <div className={styles.promoSection} style={{ marginBottom: "50px" }}>
                            <div className={styles.promoTitle}>
                                2) Beautiful Interfaces
                            </div>
                            <div className={`${styles.promoBody} ${styles.responsiveHalf}`}>
                                <div className={styles.promoTextHeader} style={{ fontSize: "1em" }}>
                                    Putting the <span className={styles.promoInverted}>labeller first</span>
                                    means better data at the source.
                            </div>

                                We design interfaces to minimize frustration by providing ergonomic tools
                                that result in accurate labels at 5x the efficiency
                                <a href="https://arxiv.org/pdf/1708.02750.pdf" style={{ color: "black" }}>
                                    <sup>[1]</sup>
                                </a>.
                                <br /><br />

                                <div className={styles.promoTextHeader} style={{ fontSize: "1em" }}>
                                    The best training is <span className={styles.promoInverted}>intuition.</span>
                                </div>
                                We break tasks down to their core to create intuitive operations, making
                                training fast and effortless. <br /><br />
                                This is made possible by applying cutting edge HCI research to optimize
                                the amount of interaction necessary in generating a label.<br /><br />

                            </div>
                            <div
                                className={styles.responsiveHalf}
                                style={{ height: "400px", textAlign: "center" }}>
                                <div className="vertical-center purpleGradient" style={
                                    {
                                        position: "relative",
                                        color: "white",
                                        padding: "50px",
                                        borderRadius: "180px",
                                        width: "180px",
                                        height: "180px",
                                        margin: "auto",
                                        marginTop: "-50px",
                                        cursor: "pointer",
                                        fontFamily: "Heebo",
                                    }}
                                    onClick={this.openDemo}>

                                    <span style={{ fontSize: "1.9em", lineHeight: "1.2em" }}>Try Our Demo
                                    <br /><img src={play} alt="Play" style={{ width: "80px" }} /></span>
                                </div>
                            </div>

                            <div style={{ clear: "both" }}></div>

                        </div>
                        <div style={{
                            backgroundColor: "#666", width: "100vw", position: "relative", left: "50%",
                            transform: "translateX(-50%)", color: "white", padding: "30px 0",
                        }}>
                            <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                                <div style={{
                                    fontSize: "1.8em", fontWeight: 100,
                                    fontStyle: "italic", width: "70%", margin: "auto",
                                }}>
                                    "That is the best bounding box interface that I have seen ever. Way better than
                                    requesters such as MLDataLabeler and the like. Kudos."<br />
                                </div>
                                <div style={{
                                    textAlign: "right", paddingRight: "15%",
                                    fontSize: "1.3em", fontWeight: 100,
                                }}>
                                    -A Real MTurk User
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.promoSection}
                        style={{ textAlign: "center", backgroundColor: "white", margin: "10px", borderBottom: "1px solid #eee" }}>
                        <div
                            style={{ fontWeight: 100, fontSize: "2.5em", padding: "40px" }}>
                            We can handle the labelling <br></br>so you can focus on your models.
                    </div>
                        <div>
                            Get the most out of your data now. Let's get in touch:
                        <div className={styles.formWrapper}
                            style={{ width: "400px", margin: "auto", paddingTop: "30px" }}>
                                <form name="contact-bottom" method="POST" data-netlify="true" netlify-honeypot="bot-field" ref="form-top" onSubmit={handleSubmit}>
                                    <input type="hidden" name="form-name" value="contact-bottom" />
                                    <input
                                        type="text"
                                        placeholder="you@email.com"
                                        name="email"
                                        onChange={this.handleChange} />

                                    <button type="submit" style={{ marginTop: "20px", backgroundColor: "#6600ff" }}>
                                        Email Me
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div style={{ clear: "both" }}></div>
                        <div className="spacer"></div>
                    </div>
                </div>
            </div>

            <Footer></Footer>
            {activitiesComponent}
        </div>;
    }
}

export default HomeView;
