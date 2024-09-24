import { useState, useRef, useEffect } from 'react';

export const useResizeLogic = () => {
    const [editorWidth, setEditorWidth] = useState(50);
    const [problemHeight, setProblemHeight] = useState(75);
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [isResizingVertical, setIsResizingVertical] = useState(false);
    const [initialMouseX, setInitialMouseX] = useState(0);
    const [initialMouseY, setInitialMouseY] = useState(0);
    const [initialWidth, setInitialWidth] = useState(50);
    const [initialHeight, setInitialHeight] = useState(75);

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorOuterRef = useRef<HTMLDivElement>(null);
    const problemRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const terminalOutputRef = useRef<HTMLDivElement>(null);
    const askJessRef = useRef<HTMLButtonElement>(null);

    const handleMouseDownVertical = (e: React.MouseEvent) => {
        setIsResizingVertical(true);
        setInitialMouseY(e.clientY);
        setInitialHeight(problemHeight);
    };

    const handleMouseMoveVertical = (e: MouseEvent) => {
        if (!isResizingVertical) return;
        const containerHeight = problemRef.current?.parentElement?.offsetHeight || 0;
        const deltaY = e.clientY - initialMouseY;
        const newHeight = initialHeight + (deltaY / containerHeight) * 100;
        if (newHeight > 10 && newHeight < 90) {
            setProblemHeight(newHeight);
        }
    };

    const handleMouseUpVertical = () => {
        setIsResizingVertical(false);
    };

    const handleMouseDownHorizontal = (e: React.MouseEvent) => {
        setIsResizingHorizontal(true);
        setInitialMouseX(e.clientX);
        setInitialWidth(editorWidth);
    };

    const handleMouseMoveHorizontal = (e: MouseEvent) => {
        if (!isResizingHorizontal) return;
        const containerWidth = editorOuterRef.current?.parentElement?.offsetWidth || 0;
        const deltaX = e.clientX - initialMouseX;
        const newWidth = initialWidth + (deltaX / containerWidth) * 100;
        if (newWidth > 10 && newWidth < 90) {
            setEditorWidth(newWidth);
        }
    };

    const handleMouseUpHorizontal = () => {
        setIsResizingHorizontal(false);
    };

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
    }, [isResizingHorizontal, isResizingVertical, handleMouseMoveHorizontal, handleMouseMoveVertical]);

    return {
        editorWidth, problemHeight, editorContainerRef, editorOuterRef,
        problemRef, outputRef, terminalOutputRef, askJessRef,
        handleMouseDownHorizontal, handleMouseDownVertical
    };
};