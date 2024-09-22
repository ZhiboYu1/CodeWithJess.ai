import React from 'react';
import './TestOutput.css';

interface TestOutputProps {
    testFeedback: string;
    onTestClick: () => void;
}

const TestOutput: React.FC<TestOutputProps> = ({ testFeedback, onTestClick }) => {
    return (
        <div className="test-output-container">
            <h3>Test your code!</h3>
            <p>{testFeedback}</p>
            <button className="test-button" onClick={onTestClick}>
                <span className="play-icon">▶</span> Test
            </button>
        </div>
    );
};

export default TestOutput;