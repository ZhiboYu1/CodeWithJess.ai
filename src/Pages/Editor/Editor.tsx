import React, { useState, useRef, useEffect } from 'react';
import MonacoEditorManager from './MonacoEditorManager';
import { marked } from 'marked';
import "./Editor.css";
import EditorPersistentState from "./EditorPersistentState";
import EditorJessState from "./EditorJessState";
import { Exercise } from "../../types/Exercise";
import axios from 'axios';

interface EditorProps {
    appState: EditorPersistentState;
}

const Editor: React.FC<EditorProps> = ({
    appState
}) => {
    // IMPORTANT: the master Editor class should keep track of some 'global Jess context':
    // global Jess context is important context about what the user is doing
    // throughout the editor to provide more context to Jess. this includes:
    // - the current problem
    // - the current code
    // - the current selected bit of code
    // - what is in the output window

    const [code, setCode] = useState('// Exercise Plans Go Here');
    const [markdown, setMarkdown] = useState<string>('');
    const [output, setOutput] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [editorWidth, setEditorWidth] = useState(50); // in percentage for horizontal resizing
    const [problemHeight, setProblemHeight] = useState(75); // in percentage for vertical resizing
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [isResizingVertical, setIsResizingVertical] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);  // Track the session ID
    const [lastApiCall, setLastApiCall] = useState<number | null>(null); // Track the last API call time
    // To store initial positions for resizing
    const [initialMouseX, setInitialMouseX] = useState(0);
    const [initialMouseY, setInitialMouseY] = useState(0);
    const [initialWidth, setInitialWidth] = useState(50);
    const [initialHeight, setInitialHeight] = useState(75);

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const problemRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    let editorManager: MonacoEditorManager | null = null;

    // print out the current editorPersistentState upon load
    console.log(appState);

    useEffect(() => {
        // Initialize EditorJessState only once when the component mounts
        // const thisPersistentState = EditorPersistentState.getInstance()
        {/*if (!EditorJessState.getInstance()) {
            // @ts-ignore
            EditorJessState.initialize(code, 'python', '', thisPersistentState.exercisePlanAssociatedData.get(thisPersistentState.lessonPlan.at(thisPersistentState.indexOfCurrentExercise).id)?.generatedExercise as Exercise, // Initial exercise object
                [] // Initial test window contents (empty array)
            );
        }*/}

        // Monaco editor setup
        if (editorContainerRef.current) {
            editorManager = new MonacoEditorManager(editorContainerRef.current, 'python', '# Write your code here');

            // Initialize the editor and sync with handleEditorChange
            editorManager.initEditor(handleEditorChange);

            if (problemRef.current) {
                problemRef.current.innerHTML = marked.parse('# Marked in browser\n\nRendered by **marked**.') as string;
            }

            return () => {
                editorManager?.disposeEditor();
            };
        }
    }, []);

    // Output terminal logic
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value); // Update the input as the user types
    };

    const handleSubmitInput = async () => {
        if (userInput.trim() === "") return; // Prevent submitting empty commands

        // Add the user's input to the output (with a prefix `>`)
        setOutput(prev => [...prev, `> ${userInput}`]);

        // Clear input field after submission
        const inputToExecute = userInput;
        setUserInput("");

        try {
            // Execute the user's input via the API
            await executeSomething(inputToExecute);
        } catch (error) {
            console.error('Error during execution:', error);
            setOutput(prev => [...prev, 'Error during execution.']);
        }
    };

    // Function to handle the Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmitInput();
        }
    };

    // Editor change logic

    const handleEditorChange = (value: string | undefined) => {
        const updatedCode = value || '';
        setCode(updatedCode);
        //Sync with Jess State
        //const jessState = EditorJessState.getInstance();
        // jessState.setCode(updatedCode);
        //sync with global state and persist it
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const executeSomething = async (executeCode: string) => {
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
            const sessionResponse = await axios.post('http://168.5.50.191:8000/create_session', {headers: {
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
        const executeResponse = await axios.post('http://168.5.50.191:8000/execute?timestamp=${new Date().getTime()}', {
                code: executeCode,
                session_id: thisSession,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }
        );
        const result = executeResponse.data.output;
        // Display the execution output
        if (result != "<NULL_OUT>") {
            setOutput(prev => [...prev, executeResponse.data.output]);
        }
        console.log(executeResponse.data.output);

        // Update the last API call timestamp
        setLastApiCall(Date.now());
    }

    const handleSubmit = async () => {
        try {
            await executeSomething(code);
        } catch (error) {
            console.error('Error during code execution:', error);
        }
    };

    const handleSelectionChange = (selection: string) => {
        //sync with jess state
        const jessState = EditorJessState.getInstance();
        jessState.setSelection(selection);
        console.log('Selected code: ', selection);
    }

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

        const containerWidth = editorContainerRef.current?.parentElement?.offsetWidth || 0;
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

    // Logic for markdown

    const updateMarkdown = (e: React.MouseEvent<HTMLButtonElement>, newRaw: string) => {
        if (problemRef.current) {
            problemRef.current.innerHTML = marked.parse(newRaw) as string;
        }
    }


    return (
        <div className={"master-container"}>
            <div className={"main-container"}>
                <div className={"editor-container"} ref={editorContainerRef} style={{ width: `${editorWidth}%` }}>
                    {/* must be able to call `submit`
                     must have and mutate code
                     jess querying functionality: what needs to be done here?
                     for jess querying functionality, i don't think the rest of the app needs to know exactly
                     the conversation that is going on. but it *should* be able to update the conversations jess is
                     having to the rest of the app. callback?

                     also need to communicate important global jess context back to the app:
                     - the current code + selection
                     we can use this communication for persisting code to disk */}
                    <button className="run-button" onClick={handleSubmit}>Run Code</button>
                    <button className="run-button" onClick={(e) => updateMarkdown(e, code)}>Make Markdown</button>
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
                    </div>
                    <div
                        className="resize-divider-vertical"
                        onMouseDown={handleMouseDownVertical}
                    ></div>
                    <div className="output-container" ref={outputRef}>
                        <div className="terminal-output">
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
            <div className={"progress-container"}>

            </div>
        </div>
    );
};

export default Editor;