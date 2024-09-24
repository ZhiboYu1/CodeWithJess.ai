import { useState } from 'react';
import axios from 'axios';
import EditorJessState from "../Editor/EditorJessState";
import EditorPersistentState from "../../Pages/Editor/EditorPersistentState";
import MonacoEditorManager from "../../Pages/Editor/MonacoEditorManager";
import {executeCode, createSession} from "../Utils/pythonAPI";
export const useEditorLogic = (editorPersistentState: EditorPersistentState) => {
    const [currentExercise, setCurrentExercise] = useState(editorPersistentState.getCurrentExercise());
    const [code, setCode] = useState(editorPersistentState.getCurrentExercise()?.initialCode || '');
    const [output, setOutput] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [highlightedText, setHighlightedText] = useState<string>('');
    const [isEditorAskJessOpen, setIsEditorAskJessOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [lastApiCall, setLastApiCall] = useState<number | null>(null);
    const [editorManager, setEditorManager] = useState<MonacoEditorManager | null>(null);


    const jessState = new EditorJessState(code, 'python', highlightedText, currentExercise, output);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const executeSomething = async (codeToRun: string) => {
        if (codeToRun === '') {
            return '';
        }
        // Sends some code to the execute api with the current session.
        const now = Date.now();

        // Check if we need to wait before making the next API call
        if (lastApiCall && now - lastApiCall < 100) {
            const remainingTime = 100 - (now - lastApiCall);
            await delay(remainingTime);
        }

        let thisSession;
        if (!sessionId) {
            thisSession = await createSession();
            setSessionId(thisSession);

            await delay(200); // Simulate any required delay for initializing session
        } else {
            thisSession = sessionId;
        }

        // Send user's code for execution in the session
        console.log(codeToRun, thisSession);
        const result = await executeCode(codeToRun, thisSession);
        // Display the execution output
        if (result !== "<NULL_OUT>") {
            setOutput(prev => [result, ...prev]);
        }

        // Update the last API call timestamp
        setLastApiCall(Date.now());
        return result;
    };

    const handleEditorChange = (value: string | undefined) => {
        const updatedCode = value || '';
        setCode(updatedCode);
    };

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
                setOutput(prev => [(result==="True")? "Test passed": "Test failed" , ...prev]);
            } catch (error) {
                console.error('Error during code execution:', error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmitInput();
        }
    };

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

    const handleSelectionChange = () => {
        const selection = window.getSelection();
        const selectionEditor = editorManager?.getSelected();
        if (selectionEditor && selectionEditor != '') {
            setHighlightedText(selectionEditor);
            console.log(selectionEditor)
        } else if (selection && selection.toString()) {
            console.log(selection.toString())
            setHighlightedText(selection.toString());
        }
        console.log(highlightedText);
    };

    const openAskJess = () => {
        setIsEditorAskJessOpen(!isEditorAskJessOpen);
    };

    const finishLesson = () => {
        setCurrentExercise(editorPersistentState.toNextExercise());
        setCode(currentExercise?.initialCode || '');
        setOutput([]);
    };

    const getJessState = () => {
        return jessState;
    };

    return {
        currentExercise, setCurrentExercise, code, setCode, output, setOutput,
        userInput, setUserInput, highlightedText, setHighlightedText,
        isEditorAskJessOpen, setIsEditorAskJessOpen,
        sessionId, handleEditorChange, handleSubmitCode,
        handleSubmitButton, handleInputChange, handleKeyPress, handleSelectionChange,
        openAskJess, finishLesson, executeSomething, getJessState, setEditorManager
    };
};