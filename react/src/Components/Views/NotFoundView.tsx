import React from "react";
import { NavBar } from "../UIElements";
function NotFoundView() {
    return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="spaceAfter"></div>
            <div className="bodyWrapper" style={{ textAlign: "center" }}>
                <h1>404</h1>
                Sorry, we couldn't find the page you're looking for
            </div>
        </div>;
}

export default NotFoundView;
