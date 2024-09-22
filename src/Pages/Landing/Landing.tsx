import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import {generateExercise} from "../../Routines/LessonPlan/generateExercise";

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
                <Link to="/onboarding">
                    <img
                        src="/landing/start.png"
                        alt="Bottom section"
                        className="bottom-image"
                    />
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;