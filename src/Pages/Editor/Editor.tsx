import React, { useState, useRef, useEffect } from 'react';
import MonacoEditorManager from './MonacoEditorManager';

import "./Editor.css";
import EditorPersistentState from "./EditorPersistentState";
import EditorJessState from "./EditorJessState";
import { Exercise } from "../../types/Exercise";
import axios from 'axios';
import app from "../../App";
import EditorAskJess from './EditorAskJess';
import {Problem} from "../../Components/Problem/Problem";

interface EditorProps {
    editorPersistentState: EditorPersistentState;
}

const Editor: React.FC<EditorProps> = ({
    editorPersistentState
}) => {
    // IMPORTANT: the master Editor class should keep track of some 'global Jess context':
    // global Jess context is important context about what the user is doing
    // throughout the editor to provide more context to Jess. this includes:
    // - the current problem
    // - the current code
    // - the current selected bit of code
    // - what is in the output window

    // GLOBAL JESS

    // TODO: global Jess context
    const currentExercise = editorPersistentState.getCurrentExercise();
    const [code, setCode] = useState(currentExercise?.initialCode || '');
    const [output, setOutput] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [highlightedText, setHighlightedText] = useState<string>('');

    // AskJess window status: Editor
    const [isEditorAskJessOpen, setIsEditorAskJessOpen] = useState(false);
    const [askJessPosition, setJessPosition] = useState(0);


    const [editorWidth, setEditorWidth] = useState(50); // in percentage for horizontal resizing
    const [problemHeight, setProblemHeight] = useState(75); // in percentage for vertical resizing
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [isResizingVertical, setIsResizingVertical] = useState(false);

    // To store initial positions for resizing
    const [initialMouseX, setInitialMouseX] = useState(0);
    const [initialMouseY, setInitialMouseY] = useState(0);
    const [initialWidth, setInitialWidth] = useState(50);
    const [initialHeight, setInitialHeight] = useState(75);

    const [sessionId, setSessionId] = useState<string | null>(null);  // Track the session ID
    const [lastApiCall, setLastApiCall] = useState<number | null>(null); // Track the last API call time
    const jessState = new EditorJessState(code, 'python', highlightedText, currentExercise, output) // woah its real


    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorOuterRef = useRef<HTMLDivElement>(null);
    const problemRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const terminalOutputRef = useRef<HTMLDivElement>(null);
    const askJessRef = useRef<HTMLButtonElement>(null);
    let editorManager: MonacoEditorManager | null = null;

    // Initialization parameters
    useEffect(() => {        // Monaco editor setup
        if (editorContainerRef.current) {

            editorManager = new MonacoEditorManager(editorContainerRef.current, 'python', code);

            // Initialize the editor and sync with handleEditorChange
            editorManager.initEditor(handleEditorChange);

            return () => {
                editorManager?.disposeEditor();
                editorPersistentState.appStateUpdated()
            };

        }
    }, []);

    useEffect(() => { // Creates the global jess context for the window
        executeSomething(code);
    }, []);

    const getJessState = () => {
        return jessState;
    };

    // Output terminal logic
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value); // Update the input as the user types
    };

    const updateOutput= (str: string) => {
        setOutput(prev => [str, ...prev]);
    }

    const handleSubmitInput = async () => {
        if (userInput.trim() === "") return; // Prevent submitting empty commands

        // Add the user's input to the output (with a prefix `>`)
        setOutput(prev => [`> ${userInput}`, ...prev]);

        // Clear input field after submission
        const inputToExecute = userInput;
        setUserInput("");

        try {
            // Execute the user's input via the API
            await executeSomething(inputToExecute);
        } catch (error) {
            console.error('Error during execution:', error);
            setOutput(prev => ['Error during execution.', ...prev]);
        }
    };

    // Function to handle the Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmitInput();
        }
    };

    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [output]); // Run this effect whenever the output changes

    // Editor change logic

    const handleEditorChange = (value: string | undefined) => {
        const updatedCode = value || '';
        setCode(updatedCode);
        console.log("Updated jess code")
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const executeSomething = async (executeCode: string) => {

        if (executeCode === '') {
            return '';
        }
        // Sends some code to the execute api with the current session.
        const now = Date.now();

        // Check if we need to wait before making the next API call
        if (lastApiCall && now - lastApiCall < 100) {
            const remainingTime = 100 - (now - lastApiCall);
            console.log(`Waiting for ${remainingTime}ms to rate limit API calls.`);
            await delay(remainingTime);
        }

        let thisSession;
        if (!sessionId) {
            const sessionResponse = await axios.post('http://168.5.54.22:8000/create_session', {headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            thisSession = sessionResponse.data.session_id;
            setSessionId(thisSession);

            await delay(200); // Simulate any required delay for initializing session
        } else {
            thisSession = sessionId;
        }

        // Send user's code for execution in the session
        console.log(executeCode, thisSession);
        const executeResponse = await axios.post('http://168.5.54.22:8000/execute', {
                code: executeCode,
                session_id: thisSession,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }
        );
        const result = executeResponse.data.output;
        // Display the execution output
        if (result !== "<NULL_OUT>") {
            setOutput(prev => [executeResponse.data.output, ...prev]);
        }
        console.log(executeResponse.data.output);

        // Update the last API call timestamp
        setLastApiCall(Date.now());
        return result;
    }

    const handleSubmitCode = async () => {
        try {
            await executeSomething(code);
        } catch (error) {
            console.error('Error during code execution:', error);
        }
    };

    const handleSubmitButton = async () => {
        console.log(currentExercise)
        const testCases = currentExercise?.testCases;
        if (testCases == null) {
            return;
        }
        for (const testCase of testCases) {
            try {
                console.log("trying test case ", testCase)
                const output = await executeSomething(testCase.replInput);
                console.log(output);
                const result = await executeSomething(`print(${output}==${testCase.replOutput})`);
                console.log(result);
                updateOutput((result==="True")? "Test passed": "Test failed");
            } catch (error) {
                console.error('Error during code execution:', error);
            }
        }
    };

    // Resizing window logic - Vertical
    const handleMouseDownVertical = (e: React.MouseEvent) => {
        setIsResizingVertical(true);
        setInitialMouseY(e.clientY); // Store the initial Y position
        setInitialHeight(problemHeight); // Store the initial height
    };

    const handleMouseMoveVertical = (e: MouseEvent) => {
        if (!isResizingVertical) return;

        const containerHeight = problemRef.current?.parentElement?.offsetHeight || 0;
        const deltaY = e.clientY - initialMouseY; // Calculate change in Y
        const newHeight = initialHeight + (deltaY / containerHeight) * 100; // Adjust based on the initial height

        if (newHeight > 10 && newHeight < 90) {
            setProblemHeight(newHeight);
        }
    };

    const handleMouseUpVertical = () => {
        setIsResizingVertical(false);
    };

    // Horizontal resize handlers
    const handleMouseDownHorizontal = (e: React.MouseEvent) => {
        setIsResizingHorizontal(true);
        setInitialMouseX(e.clientX); // Store the initial X position
        setInitialWidth(editorWidth); // Store the initial width
    };

    const handleMouseMoveHorizontal = (e: MouseEvent) => {
        if (!isResizingHorizontal) return;

        const containerWidth = editorOuterRef.current?.parentElement?.offsetWidth || 0;
        const deltaX = e.clientX - initialMouseX; // Calculate change in X
        const newWidth = initialWidth + (deltaX / containerWidth) * 100; // Adjust based on the initial width

        if (newWidth > 10 && newWidth < 90) {
            setEditorWidth(newWidth);
        }
    };

    const handleMouseUpHorizontal = () => {
        setIsResizingHorizontal(false);
    };

    // Initialize the listeners for the mice!
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveHorizontal);
        window.addEventListener('mouseup', handleMouseUpHorizontal);
        window.addEventListener('mousemove', handleMouseMoveVertical);
        window.addEventListener('mouseup', handleMouseUpVertical);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveHorizontal);
            window.removeEventListener('mouseup', handleMouseUpHorizontal);
            window.removeEventListener('mousemove', handleMouseMoveVertical);
            window.removeEventListener('mouseup', handleMouseUpVertical);
        };
    }, [isResizingHorizontal, isResizingVertical]);

    // Ask jeeves
    const openAskJess = () => {
        setIsEditorAskJessOpen(!isEditorAskJessOpen);
    }

    useEffect(() => { // Follows the movement of the button
        const updatePosition = () => {
            if (askJessRef.current) {
                const rect = askJessRef.current.getBoundingClientRect();
                setJessPosition(rect.left + rect.width);
            }
        };

        // Call once to get the initial position
        updatePosition();

        // Create a ResizeObserver to detect layout and size changes
        const resizeObserver = new ResizeObserver(() => {
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

    // Track highlighted text

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        const selectionEditor = editorManager?.getSelected();
        if (selectionEditor && selectionEditor != '') {
            setHighlightedText(selectionEditor);
        } else if (selection && selection.toString()) {
            setHighlightedText(selection.toString());
        }
    };

    useEffect(() => {
        // Add event listeners for mouseup and keyup
        window.addEventListener('mouseup', handleSelectionChange);
        window.addEventListener('keyup', handleSelectionChange);

        // Cleanup function to remove event listeners
        return () => {
            window.removeEventListener('mouseup', handleSelectionChange);
            window.removeEventListener('keyup', handleSelectionChange);
        };
    }, []);

    const finishLesson = () => {

    }

    return (
        <div className={"master-container"}>
            <div className={"main-container"}>
                <div className={"editor-container"} ref={editorOuterRef} style={{ width: `${editorWidth}%` }}>
                    <div className={"editor-toolbar"} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '56px',
                        marginBottom: '20px'
                    }}>
                        <div className={"editor-toolbar-left"} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <button
                                onClick={handleSubmitButton}
                                style={{
                                    padding: 0,
                                    margin: 0,
                                    width: '167px',
                                    height: '56px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={'/editor/toolbar_submit.png'}
                                    alt={"Submit"}
                                    width={167}
                                    height={56}
                                />
                            </button>
                            <button
                                onClick={handleSubmitCode}
                                style={{
                                    padding: 0,
                                    margin: 0,
                                    width: '127px',
                                    height: '56px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={'/editor/toolbar_run.png'}
                                    alt={"Run"}
                                    width={127}
                                    height={56}
                                />
                            </button>
                        </div>
                        <div className={"editor-toolbar-right"} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <button
                                onClick={openAskJess}
                                style={{
                                    padding: 0,
                                    margin: 0,
                                    width: '190px',
                                    height: '56px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                ref={askJessRef}
                            >
                                <img
                                    src={'/editor/toolbar_ask_jess.png'}
                                    alt={"Ask Jess"}
                                    width={190}
                                    height={56}
                                />
                            </button>
                        </div>
                    </div>
                    {/* must be able to call `submit`
                     must have and mutate code
                     jess querying functionality: what needs to be done here?
                     for jess querying functionality, i don't think the rest of the app needs to know exactly
                     the conversation that is going on. but it *should* be able to update the conversations jess is
                     having to the rest of the app. callback?

                     also need to communicate important global jess context back to the app:
                     - the current code + selection
                     we can use this communication for persisting code to disk */}

                    <div ref={editorContainerRef} style={{
                        flexGrow: 1
                    }}>
                    </div>
                </div>
                {/* Horizontal resize divider */}
                <div
                    className="resize-divider-horizontal"
                    onMouseDown={handleMouseDownHorizontal}
                ></div>
                <div className={"problem-and-output-container"}>
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
            </div>
            <EditorAskJess show={isEditorAskJessOpen} chatHeight={'426px'} location={askJessPosition} getJessState={getJessState} />
            <div className={"progress-container"}>

            </div>
        </div>
    );
};

export default Editor;