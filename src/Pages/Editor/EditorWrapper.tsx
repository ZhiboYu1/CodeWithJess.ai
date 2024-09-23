import React from 'react';
import Editor from './Editor';
import EditorPersistentState from './EditorPersistentState';

const EditorWrapper = () => {
    if (!EditorPersistentState.isInitialized()) {
        EditorPersistentState.initialize([{
            id: '1',
            description: 'Hello, world!'
        }], 0, ['Name is Jess'], new Map([
            ['1', {
                generatedExercise: {
                    id: '1',
                    title: 'Hello, world!',
                    description: 'Write a function that returns the string "Hello, world!"',
                    examples: [
                        {
                            input: '',
                            output: 'Hello, world!',
                            explanation: 'The function should return the string "Hello, world!"'
                        }
                    ],
                    constraints: 'No constraints.',
                    initialCode: 'def hello_world():\n    return "Hello, world!"',
                    testCases: [
                        {
                            replInput: 'hello_world()',
                            replOutput: 'Hello, world!'
                        }
                    ],
                    additionalNotesToSelf: null
                },
                isCompleted: false,
                lastSolutionFailedReason: null,
                userCode: null,
                allUserConversations: [],
                currentCodeActiveConversation: null,
                currentQuestionActiveConversation: null,
                timeSpent: 0
            }
        ], ['2', {
                generatedExercise: {
                    id: '2',
                    title: 'Goodbye, world!',
                    description: 'Write a function that returns the string "Goodbye, world!"',
                    examples: [
                        {
                            input: '',
                            output: 'Hello, world!',
                            explanation: 'The function should return the string "Hello, world!"'
                        }
                    ],
                    constraints: 'No constraints.',
                    initialCode: 'def goodbye_world():\n    return "Goodbye, world!"',
                    testCases: [
                        {
                            replInput: 'goodbye_world()',
                            replOutput: 'Goodbye, world!'
                        }
                    ],
                    additionalNotesToSelf: null
                },
                isCompleted: false,
                lastSolutionFailedReason: null,
                userCode: null,
                allUserConversations: [],
                currentCodeActiveConversation: null,
                currentQuestionActiveConversation: null,
                timeSpent: 0
            }
            ]]));
    }

    const appState = EditorPersistentState.getInstance();
    return <Editor editorPersistentState={appState} />;
};

export default EditorWrapper;