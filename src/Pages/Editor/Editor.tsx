import React, { useState, useRef, useEffect } from 'react';
import MonacoEditorManager from './MonacoEditorManager';
import "./Editor.css";
import EditorPersistentState from "./EditorPersistentState";
import { Exercise } from "../../types/Exercise";
import EditorToolbar from '../../Components/Editor/EditorToolbar';
import ProblemOutput from '../../Components/Editor/ProblemOutput';
import EditorAskJess from '../../Components/Editor/EditorAskJess';
import { useEditorLogic } from '../../Components/Hooks/useEditorLogic';
import { useResizeLogic } from '../../Components/Hooks/useResizeLogic';
import {deleteSession, executeCode} from "../../Components/Utils/pythonAPI";

interface EditorProps {
    editorPersistentState: EditorPersistentState;
}

const Editor: React.FC<EditorProps> = ({ editorPersistentState }) => {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const askJessRef = useRef<HTMLButtonElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const terminalOutputRef = useRef<HTMLDivElement>(null);

    const {
        currentExercise, setCurrentExercise, code, setCode, output, setOutput,
        userInput, setUserInput, highlightedTextRef,
        isEditorAskJessOpen, setIsEditorAskJessOpen,
        sessionId, handleEditorChange, handleSubmitCode,
        handleSubmitButton, handleInputChange, handleKeyPress, handleSelectionChange,
        openAskJess, finishLesson, executeSomething, getJessState, editorManagerRef, executionStart
    } = useEditorLogic(editorPersistentState);

    const {
        editorWidth, problemHeight, editorOuterRef,
        problemRef, handleMouseDownHorizontal, handleMouseDownVertical
    } = useResizeLogic();

    const [jessLocation, setJessLocation] = useState<number>(0);

    useEffect(() => {
        if (editorContainerRef.current) {
            const newEditorManager = new MonacoEditorManager(editorContainerRef.current, 'python', code);
            editorManagerRef.current = newEditorManager;
            newEditorManager.initEditor(handleEditorChange);
            console.log("Editor manager init ", newEditorManager)
            editorPersistentState.userCode = code;
            return () => {
                newEditorManager.disposeEditor();
                editorPersistentState.appStateUpdated();
            };
        }
    }, []);

    useEffect(() => {
        let thisSession: string;
        const setUpBackend = async () => {
            // Async request.
            const response = await executionStart(code);

            // Logic after async request.
            if (response) {
                thisSession = response;
                return response;
            }
        };

        setUpBackend().then();

        const waitForSessionId = async () => {
            // Wait up to 20 seconds for sessionId.
            let timeout = 20000; // 20 seconds
            const startTime = Date.now();

            // Poll every 500ms to check for sessionId.
            while (!thisSession && (Date.now() - startTime < timeout)) {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            // After waiting, call deleteSession if sessionId exists.
            if (thisSession) {
                deleteSession(thisSession).then();
            } else {
                console.log("Session ID was not set before cleanup.");
            }
        };

        return () => {
            // Call the function that waits for sessionId and handles deletion.
            waitForSessionId().then(() => console.log("Cleaned up"));
        };
    }, []); // Empty dependency array to run only once on load.


    useEffect(() => { // Follows the movement of the button
        const updatePosition = () => {
            if (askJessRef.current) {
                const rect = askJessRef.current.getBoundingClientRect();
                setJessLocation(rect.left + rect.width);
            }
        };

        // Call once to get the initial position
        updatePosition();

        // Create a ResizeObserver to detect layout and size changes
        const resizeObserver = new ResizeObserver(() => {
            console.log("Updating position");
            updatePosition();  // Update position whenever the element is resized or repositioned
        });

        if (editorOuterRef.current) {
            resizeObserver.observe(editorOuterRef.current);
        }

        // Clean up the observer when the component is unmounted
        return () => {
            if (editorOuterRef.current) {
                resizeObserver.unobserve(editorOuterRef.current);
            }
        };
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', handleSelectionChange);
        window.addEventListener('keyup', handleSelectionChange);
        return () => {
            window.removeEventListener('mouseup', handleSelectionChange);
            window.removeEventListener('keyup', handleSelectionChange);
        };
    }, []);

    return (
        <div className="master-container">
            <div className="main-container">
                <div className="editor-container" ref={editorOuterRef} style={{ width: `${editorWidth}%` }}>
                    <EditorToolbar
                        handleSubmitButton={handleSubmitButton}
                        handleSubmitCode={handleSubmitCode}
                        openAskJess={openAskJess}
                        askJessRef={askJessRef}
                    />
                    <div ref={editorContainerRef} style={{ flexGrow: 1 }}></div>
                </div>
                <div className="resize-divider-horizontal" onMouseDown={handleMouseDownHorizontal}></div>
                <ProblemOutput
                    currentExercise={currentExercise}
                    problemHeight={problemHeight}
                    problemRef={problemRef}
                    outputRef={outputRef}
                    terminalOutputRef={terminalOutputRef}
                    output={output}
                    userInput={userInput}
                    handleInputChange={handleInputChange}
                    handleKeyPress={handleKeyPress}
                    handleMouseDownVertical={handleMouseDownVertical}
                    problem_output_width={100-editorWidth}
                />
            </div>
            <EditorAskJess
                show={isEditorAskJessOpen}
                chatHeight="426px"
                getJessState={getJessState}
                toNextExercise={finishLesson}
                location={jessLocation}
            />
            <div className="progress-container"></div>
        </div>
    );
};

export default Editor;