import React from 'react';

interface ModalViewProps {
    onTap: () => void;
    isVisible: boolean;
    icon: string;
    iconWidth: number;
    iconHeight: number;
    titleImageTopMargin: number;
    titleImage: string;
    titleImageWidth: number;
    titleImageHeight: number;
    messageImageTopMargin: number;
    messageImage: string;
    messageImageWidth: number;
    messageImageHeight: number;
    children: React.ReactNode;
}

const ModalView: React.FC<ModalViewProps> = ({ onTap, isVisible, icon, iconWidth, iconHeight, titleImage, titleImageWidth, titleImageHeight, titleImageTopMargin, messageImage, messageImageWidth, messageImageHeight, messageImageTopMargin, children }) => {
    return (
        <div>
            <div
                style={{
                    filter: isVisible ? 'blur(27px)' : 'none',
                }}
            >
                {children}
            </div>
            <div 
                className="modal-overlay" 
                onClick={onTap}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    background: 'rgba(17, 17, 17, 0.46)',
                    zIndex: 1000,
                    display: isVisible ? 'flex' : 'none',
                }}
            >
                <img src={icon} alt="Modal Icon" className="modal-icon" width={iconWidth} height={iconHeight} />
                <img src={titleImage} alt="Modal Title" className="modal-title" width={titleImageWidth} height={titleImageHeight} style={{ marginTop: titleImageTopMargin }} />
                <img src={messageImage} alt="Modal Message" className="modal-message" width={messageImageWidth} height={messageImageHeight} style={{ marginTop: messageImageTopMargin }} />
            </div>
        </div>
    );
};

export default ModalView;