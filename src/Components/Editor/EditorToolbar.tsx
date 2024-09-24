import React from 'react';

interface EditorToolbarProps {
    handleSubmitButton: () => void;
    handleSubmitCode: () => void;
    openAskJess: () => void;
    askJessRef: React.RefObject<HTMLButtonElement>;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
                                                         handleSubmitButton,
                                                         handleSubmitCode,
                                                         openAskJess,
                                                         askJessRef
                                                     }) => {
    return (
        <div className="editor-toolbar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '56px',
            marginBottom: '20px'
        }}>
            <div className="editor-toolbar-left" style={{
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
                        src='/editor/toolbar_submit.png'
                        alt="Submit"
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
                        src='/editor/toolbar_run.png'
                        alt="Run"
                        width={127}
                        height={56}
                    />
                </button>
            </div>
            <div className="editor-toolbar-right" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                <button
                    onClick={openAskJess}
                    ref={askJessRef}
                    style={{
                        padding: 0,
                        margin: 0,
                        width: '190px',
                        height: '56px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <img
                        src='/editor/toolbar_ask_jess.png'
                        alt="Ask Jess"
                        width={190}
                        height={56}
                    />
                </button>
            </div>
        </div>
    );
};

export default EditorToolbar;