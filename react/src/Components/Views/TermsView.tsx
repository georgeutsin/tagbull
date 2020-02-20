/* tslint:disable */
import React, { Component } from "react";
import { FooterComponent, NavBar } from "../UIElements";

class TermsView extends Component<any, any> {
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
                        <h1 className="textShadow" style={{ fontSize: "5em" }}>Terms of Service</h1>
                        <div style={{ height: "50px" }}></div>
                        <span style={{ color: "white", position: "relative", fontSize: "1.5em", padding: "10px" }}>
                            By using TagBull ("Service"), you are agreeing to be bound by the following terms and conditions ("Terms of Service").
                        </span>
                    </div>
                </header>

                <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>

                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        TagBull, Inc. ("Company") reserves the right to update and change these Terms of Service without notice. Violation of any of the terms below may result in the termination of your account.
                    </div>

                    <div style={{ height: "50px" }}></div>
                    <h2>Account Terms</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        You are responsible for maintaining the security of your account and password. The Company cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
You are responsible for all content uploaded and activity that occurs under your account (even when content is uploaded by others who have their own logins under your account).
You may not use the Service for any illegal purpose or to violate any laws in your jurisdiction (including but not limited to copyright laws).
You must provide your legal full name, a valid email address, and any other information requested in order to complete the signup process.
Your login may only be used by one person â€“ a single login shared by multiple people is not permitted. You may create as many separate logins as permitted under your plan.
You must be a human. Accounts registered by "bots" or other automated methods are not permitted.
                    </div>

                    <div style={{ height: "50px" }}></div>
                    <h2>API Terms</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        Customers may access their Service data via the Application Program Interface ("API"). Any use of the API, including use of the API through a third-party product that accesses the Service, is bound by the terms of this agreement plus the following specific terms:

    You expressly understand and agree that the Company shall not be liable for any damages or losses resulting from your use of the API or third-party products that access data via the API.
    Abuse or excessively frequent requests to the Service via the API may result in the temporary or permanent suspension of your account's access to the API. The Company, in its sole discretion, will determine abuse or excessive usage of the API. The Company will make a reasonable attempt via email to warn the account owner prior to suspension.
                    </div>

                    <div style={{ height: "50px" }}></div>
                    <h2>Cancellation and Termination</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        You can cancel your account at any time by sending an email to support@tagbull.com. No questions will be asked.
    All of your content will be inaccessible from the Service immediately upon cancellation. Within 30 days, all content will be permanently deleted from backups and logs. This information can not be recovered once it has been permanently deleted.
    If you cancel the Service before the end of your current paid up month, your cancellation will take effect immediately, and you will not be charged again. But there will not be any prorating of unused time in the last billing cycle.
    The Company, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service for any reason at any time. Such termination of the Service will result in the deactivation or deletion of your Account or your access to your Account, and the forfeiture and relinquishment of all content in your account. The Company reserves the right to refuse service to anyone for any reason at any time.
                    </div>


                    <div style={{ height: "50px" }}></div>
                    <h2>Modifications to the Service and Prices</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        The Company reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, any part of the Service with or without notice.
    Prices of all Services are subject to change upon 30 days notice from us. Such notice may be provided at any time by posting the changes to the Company web site or the Service itself.
    The Company shall not be liable to you or to any third party for any modification, price change, suspension or discontinuance of the Service.
                    </div>


                    <div style={{ height: "50px" }}></div>
                    <h2>Copyright and Content Ownership</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        All content posted on the Service must comply with U.S. copyright law.
    We claim no intellectual property rights over the material you provide to the Service. All materials uploaded remain yours.
    The Company does not pre-screen content, but reserves the right (but not the obligation) in their sole discretion to refuse or remove any content that is available via the Service.
    The look and feel of the Service is copyright TagBull, Inc. All rights reserved. You may not duplicate, copy, or reuse any portion of the HTML, CSS, JavaScript, or visual design elements without express written permission from the Company.
                    </div>


                    <div style={{ height: "50px" }}></div>
                    <h2>General Conditions</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                        Your use of the Service is at your sole risk. The service is provided on an "as is" and "as available" basis.
    Technical support is only guaranteed via email, but is also offered through our live chat as well as through the Community Slack.
    You understand that the Company uses third party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.
    You must not modify, adapt or hack the Service.
    You must not modify another website so as to falsely imply that it is associated with the Service or the Company.
    You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by the Company.
    We may, but have no obligation to, remove content and accounts that we determine in our sole discretion are unlawful or violates any party's intellectual property or these Terms of Service.
    Verbal, physical, written or other abuse (including threats of abuse or retribution) of any Service customer, Company employee or officer can result in immediate account termination.
    You understand that the technical processing and transmission of the Service, including your content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
    We reserve the right to temporarily disable your account if your usage significantly exceeds the average usage of other Service customers. Of course, we'll reach out to the account owner before taking any action except in rare cases where the level of use may negatively impact the performance of the Service for other customers.
    The Company does not warrant that (i) the service will meet your specific requirements, (ii) the service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the service will be accurate or reliable, (iv) the quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations, and (v) any errors in the Service will be corrected.
    You expressly understand and agree that the Company shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the service; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the service; (iii) unauthorized access to or alteration of your transmissions or data; (iv) statements or conduct of any third party on the service; (v) or any other matter relating to the service.
    The failure of the Company to exercise or enforce any right or provision of the Terms of Service shall not constitute a waiver of such right or provision. The Terms of Service constitutes the entire agreement between you and the Company and govern your use of the Service, superseding any prior agreements between you and the Company (including, but not limited to, any prior versions of the Terms of Service).
    Questions about the Terms of Service should be sent to support@tagbull.com .
    Any new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service. Continued use of the Service after any such changes shall constitute your consent to such changes.
                    </div>

                    <div style={{ height: "50px" }}></div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div>;
    }
}

export default TermsView;
/* tslint:enable */
