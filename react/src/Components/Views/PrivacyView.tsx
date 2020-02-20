import React, { Component } from "react";
import { FooterComponent, NavBar } from "../UIElements";

class PrivacyView extends Component<any, any> {
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
                        <h1 className="textShadow" style={{ fontSize: "5em" }}>Privacy Policy</h1>
                        <div style={{ height: "50px" }}></div>
                        <span style={{ color: "white", position: "relative", fontSize: "1.5em", padding: "10px" }}>
                            Your privacy is important to us.
                        </span>
                    </div>
                </header>

                <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "5px" }}>
                    <div style={{ height: "50px" }}></div>
                    <h2>Identity &amp; Access</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    When you sign up for TagBull, we ask for your name, organization name, and email address. This is just
                    so we can personalize your new account, and send you invoices, updates, or other essential information.
                    We'll never sell your personal info to third parties, and we won't use your name or company in
                    marketing statements without your permission, either. <br/> <br/>
                    When you pay for TagBull, we ask for your credit card and zip/postal code. That's so we can charge you
                    for service and send you invoices. Your credit card is passed directly to our payment processor and
                    doesn't ever go through our servers. We don't store/log any billing information. Any time billing
                    information is required (you ask to see it, an invoice needs to be sent, etc), we retrieve it from our
                    payment processor with a user-specific token we keep encrypted. <br/> <br/>
                    When you contact TagBull with a question or to ask for help, we'll keep that correspondence, and the
                    email address, for future reference. When you browse our website, we'll track that for statistical
                    purposes (like conversion rates and to test new designs). We also store any information you volunteer,
                    like surveys, for as long as it makes sense. <br/> <br/>
                    The only times we'll ever share your info:
                    <ul>
                        <li>To provide products or services you've requested, with your permission.
                        </li>
                        <li>To investigate, prevent, or take action regarding illegal activities, suspected fraud, situations
                            involving potential threats to the physical safety of any person, violations of our Terms of
                            Service, or as otherwise required by law.</li>
                        <li>If TagBull is acquired by or merged with another company we'll notify you well before any info
                            about you is transferred and becomes subject to a different privacy policy.
                        </li>
                    </ul>
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Your rights with Respect to Your Information</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    <p>General Data Protection Regulation ("GDPR") gives people under its protection certain rights with
                respect to their personal information collected by us on the Site. Accordingly, TagBull recognizes and
                will comply with GDPR and those rights, except as limited by applicable law. The rights under GDPR
                include:</p>
            <ul>
                <li>
                    <strong>Right of Access:</strong> This includes your right to access the personal information we
                    gather about you, and your right to obtain information about the sharing, storage, security and
                    processing of that information.
                </li>
                <li><strong>Right to Correction:</strong> This is your right to request correction of your personal
                    information.
                </li>
                <li><strong>Right to Erasure:</strong> This is your right to request, subject to certain limitations
                    under applicable law, that your personal information be erased from our possession (also known as
                    the "Right to be forgotten"). However, if applicable law requires us to comply with your request to
                    delete your information, fulfillment of your request may prevent you from using TagBull services
                    and may result in closing your account.
                </li>
                <li><strong>Right to Complain:</strong> You have the right to make a complaint regarding our handling
                    of your personal information with the appropriate supervisory authority.
                </li>
                <li><strong>Right to Restrict Processing:</strong> This is your right to request restriction of how and
                    why your personal information is used or processed.
                </li>
                <li><strong>Right to Object:</strong> This is your right, in certain situations, to object to how or
                    why your personal information is processed.
                </li>
                <li><strong>Right to Portability:</strong> This is your right to receive the personal information we
                    have about you and the right to transmit it to another party.
                </li>
                <li><strong>Right to not be subject to Automated Decision-Making:</strong> This is your right to object
                    and prevent any decision that could have a legal, or similarly significant, effect on you from
                    being made solely based on automated processes. This right is limited, however, if the decision is
                    necessary for performance of any contract between you and us, is allowed by applicable European
                    law, or is based on your explicit consent.
                </li>
                </ul>
                <p>Many of these rights can be exercised by signing in and directly updating your account information. If
                    you have questions about exercising these rights or need assistance, please contact us at
                    <span>privacy@tagbull.com</span>
                </p>
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Processors We Use</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    As part of the services we provide, and only to the extent necessary, we may use certain third party
                processors to process some or all of your personal information. For identification of these processors,
                and where they are located, please see our Subprocessor listing below. We have signed appropriate data
                processing contracts that comply with GDPR with each processor.
                    </div>
                    <div style={{ height: "50px" }}></div>

                    
                    <h2>Law Enforcement</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    TagBull won't hand your data over to law enforcement unless a court order says we have to. We reject
                requests from local and federal law enforcement when they seek data without a court order. Unless we're
                legally prevented from it, we'll always inform you when such requests are made.
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Security &amp; Encryption</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    All data is encrypted via SSL/TLS when transmitted from our servers to your browser and in between our
                servers. The database backups are also encrypted. Data isn't encrypted (with the exception of passwords
                and sensitive API tokens) while it's live in our database (since it needs to be ready to send to you
                when you need it), but we go to great lengths to secure your data.
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Deleted data</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    When you cancel your account, we'll ensure that nothing is stored on our servers past 30 days. Anything
                you delete on your account while it's active will also be purged within 30 days.
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Location of Site and Data</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    This site is operated in the United States. If you are located in the European Union or elsewhere
                outside of the United States, please be aware that any information you provide to us will be
                transferred to the United States. By using our Site, participating in any of our services and/or
                providing us with your information, you consent to this transfer.
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Changes &amp; questions</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    TagBull may update this policy occasionally â€” we'll notify you about significant changes by emailing
                the account owner or by placing a prominent notice on our site. You can access, change or delete your
                personal information at any time by contacting <span>privacy@tagbull.com</span>. <br/> <br/>
                Questions about this privacy policy? Please get in touch and we'll be happy to answer them!
                    </div>
                    <div style={{ height: "50px" }}></div>

                    <h2>Subprocessors</h2>
                    <div style={{ height: "25px" }}></div>
                    <div style={{ fontSize: "1.2em", lineHeight: "1.2em" }}>
                    TagBull uses third party subprocessors, such as cloud computing providers and customer support
                software, to provide our services. We enter into GDPR-compliant data processing agreements with each
                subprocessor:
                <br/>
                <strong>Google Cloud Platform. Cloud services provider.
                </strong>
                <br/>
                <strong>Stripe. Payment processing service.
                </strong>
                <br/>
                <strong>Google Analytics. Web analytics service.
                </strong>
                <br/>
                <strong>Netlify. Cloud services provider.
                </strong>
                    </div>
                    <div style={{ height: "50px" }}></div>
                </div>
            </div>
            <FooterComponent></FooterComponent>
        </div>;
    }
}

export default PrivacyView;
