import React from 'react';
import './Landing.css';

const LandingPage = () => {
    return (
        <div
            className="landing-container"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/landing/background.png)` }}
        >
            <div className="content-container">
                <img
                    src="/landing/text.png"
                    alt="Top section"
                    className="top-image"
                />
                <a href="/your-link-destination">
                    <img
                        src="/landing/start.png"
                        alt="Bottom section"
                        className="bottom-image"
                    />
                </a>
            </div>
        </div>
    );
};

export default LandingPage;