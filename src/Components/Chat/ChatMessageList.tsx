import React from 'react';
import './ChatMessageList.css';
import { ChatMessageItem, ChatMessageItemResources, ChatMessageItemSizeParams } from './ChatMessageItem';
import { DisplayChatItem } from "../../types/DisplayChatItem";

interface ChatMessageListSizeParams {
    topPadding: number;
    bottomPadding: number;
    elementSpacing: number;
}

interface ChatMessageListProps {
    chatItems: DisplayChatItem[];

    chatMessageItemResources: ChatMessageItemResources;
    chatMessageItemSizeParams: ChatMessageItemSizeParams;
    chatMessageListSizeParams: ChatMessageListSizeParams;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
    chatItems,
    chatMessageItemResources,
    chatMessageItemSizeParams,
    chatMessageListSizeParams,
}) => {
    const {
        topPadding,
        bottomPadding,
        elementSpacing,
    } = chatMessageListSizeParams;

    return (
        <div className="chat-message-list" style={{
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
        }}>
            {chatItems.map((chatItem, index) => (
                <div key={index} style={{ marginBottom: index < chatItems.length - 1 ? elementSpacing : 0 }}>
                    <ChatMessageItem
                        chatItem={chatItem}
                        resources={chatMessageItemResources}
                        sizeParams={chatMessageItemSizeParams}
                    />
                </div>
            ))}
        </div>
    );
};

export type { ChatMessageListSizeParams };
export { ChatMessageList };