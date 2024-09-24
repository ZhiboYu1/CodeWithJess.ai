import React from 'react';
import { Problem } from "../../Components/Editor/Problem";
import { Exercise } from "../../types/Exercise";

interface ProblemOutputProps {
    currentExercise: Exercise | null;
    problemHeight: number;
    problemRef: React.RefObject<HTMLDivElement>;
    outputRef: React.RefObject<HTMLDivElement>;
    terminalOutputRef: React.RefObject<HTMLDivElement>;
    output: string[];
    userInput: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleMouseDownVertical: (e: React.MouseEvent) => void;
}

const ProblemOutput: React.FC<ProblemOutputProps> = ({
                                                         currentExercise,
                                                         problemHeight,
                                                         problemRef,
                                                         outputRef,
                                                         terminalOutputRef,
                                                         output,
                                                         userInput,
                                                         handleInputChange,
                                                         handleKeyPress,
                                                         handleMouseDownVertical
                                                     }) => {
    return (
        <div className="problem-and-output-container">
            <div
                className="problem-container"
                ref={problemRef}
                style={{ height: `${problemHeight}%` }}
            >
                <Problem exercise={currentExercise!} />
            </div>
            <div
                className="resize-divider-vertical"
                onMouseDown={handleMouseDownVertical}
            ></div>
            <div className="output-container" ref={outputRef}>
                <div className="terminal-output" ref={terminalOutputRef}>
                    {output.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
                <div className="terminal-input">
                    <span>&gt; </span>
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemOutput;