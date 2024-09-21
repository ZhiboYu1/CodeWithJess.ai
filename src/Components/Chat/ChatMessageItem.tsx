import React from 'react';
import './ChatMessageItem.css';
import { DisplayChatItem, ChatItemRole } from "../../types/DisplayChatItem";

interface ChatMessageItemResources {
    userIcon: string;
    jessIcon: string;
    avatarIconSize: number;
    userTextImage: string;
    userTextImageHeight: number;
    userTextImageWidth: number;
    jessTextImage: string;
    jessTextImageHeight: number;
    jessTextImageWidth: number;
}

interface ChatMessageItemSizeParams {
    fullMessageItemWidth: number;
    avatarToTextSpacing: number;
    senderTextToContentSpacing: number;
    messageTextFontSize: number;
    messageTextWidth: number;
    messageTextColor: string;
    messageTextFontWeight: number;
    messageTextLineHeight: number;
    messageTextParagraphSpacing: number;
}

interface ChatMessageItemProps {
    chatItem: DisplayChatItem;
    resources: ChatMessageItemResources;
    sizeParams: ChatMessageItemSizeParams;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
    chatItem,
    resources,
    sizeParams
}) => {
    const {
        userIcon,
        jessIcon,
        avatarIconSize,
        userTextImage,
        userTextImageHeight,
        userTextImageWidth,
        jessTextImage,
        jessTextImageHeight,
        jessTextImageWidth,
    } = resources;

    const {
        fullMessageItemWidth,
        avatarToTextSpacing,
        senderTextToContentSpacing,
        messageTextFontSize,
        messageTextWidth,
        messageTextColor,
        messageTextFontWeight,
        messageTextLineHeight,
        messageTextParagraphSpacing,
    } = sizeParams;

    const isUserMessage = chatItem.role === ChatItemRole.USER;
    const icon = isUserMessage ? userIcon : jessIcon;
    const senderTextImage = isUserMessage ? userTextImage : jessTextImage;
    const senderTextImageHeight = isUserMessage ? userTextImageHeight : jessTextImageHeight;
    const senderTextImageWidth = isUserMessage ? userTextImageWidth : jessTextImageWidth;

    return (
        <div
            className={`chat-message-item ${isUserMessage ? 'user-message' : ''}`}
            style={{
                width: fullMessageItemWidth,
            }}
        >
            <img
                src={icon}
                alt="Avatar"
                className="avatar"
                style={{
                    width: avatarIconSize,
                    height: avatarIconSize,
                }}
            />
            <div
                className="message-content"
                style={{
                    marginLeft: (isUserMessage ? 0 :avatarToTextSpacing),
                    marginRight: (isUserMessage ? avatarToTextSpacing : 0),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: (isUserMessage ? 'flex-end' : 'flex-start'),
                }}
            >
                <div
                    className="sender"
                    style={{
                        marginBottom: senderTextToContentSpacing,
                    }}
                >
                    <img
                        src={senderTextImage}
                        alt="Sender"
                        style={{ width: senderTextImageWidth, height: senderTextImageHeight }}
                    />
                </div>
                <div
                    className="message-text"
                    style={{
                        fontSize: messageTextFontSize,
                        width: messageTextWidth,
                        color: messageTextColor,
                        fontWeight: messageTextFontWeight,
                        lineHeight: messageTextLineHeight,
                        marginBottom: messageTextParagraphSpacing,
                        textAlign: (isUserMessage ? 'right' : 'left'),
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {chatItem.message}
                </div>
            </div>
        </div>
    );
};

export type { ChatMessageItemResources, ChatMessageItemSizeParams };
export { ChatMessageItem };