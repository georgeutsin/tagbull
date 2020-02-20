import React, { Component } from "react";
import { FooterComponent, NavBar } from "../UIElements";

class CareersView extends Component<any, any> {
    public render() {
        return <div>
            <NavBar>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>

            <div style={{ minHeight: "100vh", overflow: "hidden" }}>
                <header>
                    <div className="header-bg purpleGradient"></div>
                    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                        <div style={{ height: "100px" }}></div>
                        <h1 className="textShadow" style={{ fontSize: "5em" }}>Careers</h1>
                        <div style={{ height: "50px" }}></div>
                        <span style={{ color: "white", position: "relative", fontSize: "1.5em", padding: "10px" }}>
                            Help us empower people to build the next generation of machine learning tech.
                        </span>
                    </div>
                </header>

                <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                    <div style={{ height: "100px" }}></div>
                    <h1>Open Positions</h1>
                    <div style={{ height: "50px" }}></div>
                    <div style={{ color: "#666", backgroundColor: "white", padding: "40px", borderBottom: "1px solid #eee" }}>
                        <a href="https://recruit.zohopublic.com/recruit/PortalDetail.na?iframe=true&digest=HucHsBzQ..bFKCiMfHPnB3GAUnkE7bVo.a85bxdBEmQ-&jobid=540607000000266884&widgetid=540607000000072311&embedsource="
                            style={{ textDecorationColor: "#6100ff" }}>
                            <div style={{ color: "#6600ff", fontSize: "2em", paddingBottom: "30px", fontFamily: "Heebo" }}>
                                Sales Lead - USA
                            </div>
                        </a>
                        Full Time - Flexible Location
                        </div>
                    <div style={{ height: "20px" }}></div>
                    <div style={{ color: "#666", backgroundColor: "white", padding: "40px", borderBottom: "1px solid #eee" }}>
                        <a href="https://recruit.zohopublic.com/recruit/PortalDetail.na?iframe=true&digest=HucHsBzQ..bFKCiMfHPnB3GAUnkE7bVo.a85bxdBEmQ-&jobid=540607000000269166&widgetid=540607000000072311&embedsource=CareerSite"
                            style={{ textDecorationColor: "#6100ff" }}>
                            <div style={{ color: "#6600ff", fontSize: "2em", paddingBottom: "30px", fontFamily: "Heebo" }}>
                                Full Stack Engineer
                            </div>
                        </a>
                        Full Time - Flexible Location
                        </div>
                    <div style={{ height: "100px" }}></div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div>;
    }
}

export default CareersView;
