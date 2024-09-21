import React, { useState, useRef, useEffect } from 'react';
import MonacoEditorManager from './MonacoEditorManager';
import { Editable, useEditor } from "@wysimark/react"
import "./Editor.css";
import EditorPersistentState from "./EditorPersistentState";
import EditorJessState from "./EditorJessState";
import ThemeEditor from "./ThemeEditor";

interface EditorProps {
    appState: EditorPersistentState;
}

const Editor = () => {
    // IMPORTANT: the master Editor class should keep track of some 'global Jess context':
    // global Jess context is important context about what the user is doing
    // throughout the editor to provide more context to Jess. this includes:
    // - the current problem
    // - the current code
    // - the current selected bit of code
    // - what is in the output window

    const [code, setCode] = useState('// Exercise Plans Go Here');
    const [problemViewMarkdown, setProblemViewMarkdown] = useState("# Example Problem");
    const [output, setOutput] = useState<string>(''); // Placeholder for terminal output
    const [userInput, setUserInput] = useState("");
    const [problemHeight, setProblemHeight] = useState(75); // in percentage
    const [isResizing, setIsResizing] = useState(false);

    const ProblemView = useEditor({});
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const problemRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    let editorManager: MonacoEditorManager | null = null;

    useEffect(() => {
        if (editorContainerRef.current) {
            editorManager = new MonacoEditorManager(editorContainerRef.current, 'python', '# Write your code here');

            // Initialize the editor
            editorManager.initEditor();

            // Handle cleanup when component unmounts
            return () => {
                editorManager?.disposeEditor();
            };
        }
    }, []);

    const handleEditorChange = (value: string | undefined) => {
        const updatedCode = value || '';
        setCode(updatedCode);
        //Sync with Jess State
        const jessState = EditorJessState.getInstance();
        jessState.setCode(updatedCode);
        //sync with global state and persist it
    };

    // Initialize the theme when the component mounts
    const setEditorTheme = () => {
        ThemeEditor.initTheme()
        ThemeEditor.setTheme()
    }

    const handleSubmit = () => {
        // Placeholder output, simulate execution and output.
        const simulatedOutput = `Executing...\nResult: 42\n`;
        setOutput(prevOutput => `${prevOutput}\n> ${userInput}\n${simulatedOutput}`);
        setUserInput("");  // Clear the input after submission
    };

    const handleSelectionChange = (selection: string) => {
        //sync with jess state
        const jessState = EditorJessState.getInstance();
        jessState.setSelection(selection);
        console.log('Selected code: ', selection);
    }

    // Resizing window logic
    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const containerHeight = problemRef.current?.parentElement?.offsetHeight || 0;
        const newHeight = (e.clientY / containerHeight) * 100;

        if (newHeight > 10 && newHeight < 90) { // Restrict resizing to between 10% and 90%
            setProblemHeight(newHeight);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    React.useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);


    return (
        <div className={"master-container"}>
            <div className={"main-container"}>
                <div className={"editor-container"} ref={editorContainerRef}>
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
                </div>
                <div className={"problem-and-output-container"}>
                    <div
                        className="problem-container"
                        ref={problemRef}
                        style={{ height: `${problemHeight}%` }}
                    >
                        <h1>Problem</h1>
                        <p>Problem description goes here...</p>
                    </div>
                    <div
                        className="resize-divider"
                        onMouseDown={handleMouseDown}
                    ></div>
                    <div
                        className="output-container"
                        ref={outputRef}
                        style={{ height: `${100 - problemHeight}%` }}
                    >
                        <h1>Output</h1>
                        <p>Terminal output goes here...</p>
                    </div>
                </div>
            </div>
            <div className={"progress-container"}>

            </div>
        </div>
    );
};

export default Editor;