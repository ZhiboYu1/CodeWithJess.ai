import React, { useState, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './ChatMessageInputBox.css';

interface ChatMessageInputBoxResources {
    sendButtonImage: string;
    sendButtonImageSize: number;
}

interface ChatMessageInputBoxSizeParams {
    inputBoxFontSize: number;
    inputBoxFontWeight: number;
    inputBoxLineHeight: number;
    inputBoxBackgroundColor: string;
    inputBoxPlaceholderColor: string;
    inputBoxBorderRadius: number;
    inputFieldWidth: number;
    inputFieldLeftPadding: number;
    inputFieldRightPadding: number;
    inputFieldVerticalPadding: number;
    sendButtonBottomAndRightPadding: number;
}

interface ChatMessageInputBoxProps {
    resources: ChatMessageInputBoxResources;
    sizeParams: ChatMessageInputBoxSizeParams;
    onSend: (message: string) => void;
}

const ChatMessageInputBox: React.FC<ChatMessageInputBoxProps> = ({ resources, sizeParams, onSend }) => {
    const [message, setMessage] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };



    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
        <div className="chat-message-input-box" style={{
            backgroundColor: sizeParams.inputBoxBackgroundColor,
            borderRadius: `${sizeParams.inputBoxBorderRadius}px`,
            display: 'flex',
        }}>
            <div
                style={{
                    marginTop: `${sizeParams.inputFieldVerticalPadding - (sizeParams.inputBoxLineHeight - sizeParams.inputBoxFontSize) / 2}px`,
                    marginBottom: `${sizeParams.inputFieldVerticalPadding - (sizeParams.inputBoxLineHeight - sizeParams.inputBoxFontSize) / 2}px`,
                    marginLeft: `${sizeParams.inputFieldLeftPadding}px`,
                    marginRight: `${sizeParams.inputFieldRightPadding}px`,
                }}
            >
                <TextareaAutosize
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Message Jess..."
                    style={{
                        width: `${sizeParams.inputFieldWidth}px`,
                        fontSize: `${sizeParams.inputBoxFontSize}px`,
                        fontWeight: sizeParams.inputBoxFontWeight,
                        lineHeight: `${sizeParams.inputBoxLineHeight}px`,
                        padding: 0,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        backgroundColor: 'transparent',
                        boxSizing: 'border-box',
                        color: 'white',
                        overflow: 'hidden',
                    }}
                    minRows={1}
                    maxRows={7}
                />
            </div>

            <div
                style={{
                    marginBottom: `${sizeParams.sendButtonBottomAndRightPadding}px`,
                    marginRight: `${sizeParams.sendButtonBottomAndRightPadding}px`,
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: 0,
                        margin: 0,
                        width: `${resources.sendButtonImageSize}px`,
                        height: `${resources.sendButtonImageSize}px`,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: (message.length > 0) ? 1 : 0
                    }}
                >
                    <img
                        src={resources.sendButtonImage}
                        alt="Send"
                        width={resources.sendButtonImageSize}
                        height={resources.sendButtonImageSize}
                    />
                </button>
            </div>
        </div>
        </div>
    );
};

export { ChatMessageInputBox };
export type { ChatMessageInputBoxResources, ChatMessageInputBoxSizeParams, ChatMessageInputBoxProps };