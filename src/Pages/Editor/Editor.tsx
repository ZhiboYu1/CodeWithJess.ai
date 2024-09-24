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

interface EditorProps {
    editorPersistentState: EditorPersistentState;
}

const Editor: React.FC<EditorProps> = ({ editorPersistentState }) => {
    const {
        currentExercise, setCurrentExercise, code, setCode, output, setOutput,
        userInput, setUserInput, highlightedText, setHighlightedText,
        isEditorAskJessOpen, setIsEditorAskJessOpen,
        sessionId, handleEditorChange, handleSubmitCode,
        handleSubmitButton, handleInputChange, handleKeyPress, handleSelectionChange,
        openAskJess, finishLesson, executeSomething, getJessState, setEditorManager
    } = useEditorLogic(editorPersistentState);

    const {
        editorWidth, problemHeight, editorContainerRef, editorOuterRef,
        problemRef, outputRef, terminalOutputRef, askJessRef,
        handleMouseDownHorizontal, handleMouseDownVertical
    } = useResizeLogic();

    const [jessLocation, setJessLocation] = useState<number>(0);

    useEffect(() => {
        if (editorContainerRef.current) {
            const newEditorManager = new MonacoEditorManager(editorContainerRef.current, 'python', code);
            newEditorManager.initEditor(handleEditorChange);
            setEditorManager(newEditorManager);
            return () => {
                newEditorManager.disposeEditor();
                editorPersistentState.appStateUpdated();
            };
        }
    }, []);

    useEffect(() => {
        executeSomething(code);
        return () => {
            if (sessionId) {
                // Delete session logic here
            }
        }
    }, []);

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