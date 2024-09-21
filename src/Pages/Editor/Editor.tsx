import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ThemeManager from './ThemeEditor';
import { Editable, useEditor } from "@wysimark/react"
import "./Editor.css";
import EditorPersistentState from "./EditorPersistentState";
import EditorJessState from "./EditorJessState";

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
    const [terminalInput, setTerminalInput] = useState<string>('');

    const ProblemView = useEditor({});

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    const handleSubmit = () => {
        const placeholderOutput = "Code executed successfully\n"; // Placeholder output
        setOutput(placeholderOutput + output); // Append to terminal output
        console.log("Code submitted: ", code);
    };

    // Initialize the theme when the component mounts
    useEffect(() => {
        ThemeManager.initTheme();
        ThemeManager.applyTheme('custom-dark-photo');
    }, []);

    const handleTerminalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTerminalInput(event.target.value);
    };

    const handleTerminalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Placeholder: add terminal input to the output
        const userCommand = `> user@editor:~$ ${terminalInput}\n`;
        setOutput(output + userCommand);
        setTerminalInput(''); // Clear the input after submission
    };

    return (
        <div className={"master-container"}>
            <div className={"main-container"}>
                <div className={"editor-container"}>
                    {/* must be able to call `submit`
                     must have and mutate code
                     jess querying functionality: what needs to be done here?
                     for jess querying functionality, i don't think the rest of the app needs to know exactly
                     the conversation that is going on. but it *should* be able to update the conversations jess is
                     having to the rest of the app. callback?

                     also need to communicate important global jess context back to the app:
                     - the current code + selection
                     we can use this communication for persisting code to disk */}
                    <MonacoEditor
                        height="90vh"
                        theme="custom-dark"
                        defaultLanguage="python"
                        defaultValue={code}
                        onChange={handleEditorChange}
                    />
                    <button onClick={handleSubmit}>Run Code</button>
                </div>
                <div className={"problem-and-output-container"}>
                    <div className={"problem-container"}>
                        {/* // this is the easiest part. needs a problem.
                        // also needs jess querying functionality. i don't know
                        // how specifically this must be done, but we should be
                        // able to copy the implementation directly from the editor
                        // easy easy easy */}
                        <Editable
                            editor={ProblemView}
                            value={problemViewMarkdown}
                            readOnly={true} // Make it read-only for the client
                        />
                    </div>
                    <div className={"output-container"}>
                        {/* // needs a copy of the code.
                        // needs to sync the current state of the window back to the app as
                        // part of jess context
                        // let's not persist anything in the output container to disk */}

                    </div>
                </div>
            </div>
            <div className={"progress-container"}>

            </div>
        </div>
    );
};

export default Editor;