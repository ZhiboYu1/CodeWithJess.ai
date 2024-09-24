import React, { useState, useRef, useEffect, useCallback } from 'react';

export const useResizeLogic = () => {
    const [editorWidth, setEditorWidth] = useState(50); // % width of the editor
    const [problemHeight, setProblemHeight] = useState(75); // % height of the problem section
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [isResizingVertical, setIsResizingVertical] = useState(false);
    const [initialMouseX, setInitialMouseX] = useState(0);
    const [initialMouseY, setInitialMouseY] = useState(0);
    const [initialWidth, setInitialWidth] = useState(50);
    const [initialHeight, setInitialHeight] = useState(75);

    const editorOuterRef = useRef<HTMLDivElement>(null);
    const problemRef = useRef<HTMLDivElement>(null);

    // Function to handle vertical resizing
    const handleMouseDownVertical = (e: React.MouseEvent) => {
        setIsResizingVertical(true);
        setInitialMouseY(e.clientY);
        setInitialHeight(problemHeight);
        document.body.style.userSelect = 'none'; // Prevent text selection during resize
    };

    // Function to handle horizontal resizing
    const handleMouseDownHorizontal = (e: React.MouseEvent) => {
        setIsResizingHorizontal(true);
        setInitialMouseX(e.clientX);
        setInitialWidth(editorWidth);
        document.body.style.userSelect = 'none';
    };

    // Function to handle mouse move for vertical resizing
    const handleMouseMoveVertical = useCallback(
        (e: MouseEvent) => {
            if (!isResizingVertical) return;
            const containerHeight = problemRef.current?.parentElement?.offsetHeight || 0;
            const deltaY = e.clientY - initialMouseY;
            const newHeight = initialHeight + (deltaY / containerHeight) * 100;
            // Clamp values to prevent container overlap
            if (newHeight > 10 && newHeight < 90) {
                setProblemHeight(newHeight);
            }
        },
        [initialMouseY, initialHeight, isResizingVertical]
    );

    // Function to handle mouse move for horizontal resizing
    const handleMouseMoveHorizontal = useCallback(
        (e: MouseEvent) => {
            if (!isResizingHorizontal) return;
            const containerWidth = editorOuterRef.current?.parentElement?.offsetWidth || 0;
            const deltaX = e.clientX - initialMouseX;
            const newWidth = initialWidth + (deltaX / containerWidth) * 100;
            if (newWidth > 10 && newWidth < 90) {
                setEditorWidth(newWidth);
            }
        },
        [initialMouseX, initialWidth, isResizingHorizontal]
    );

    // Handle mouse up event for both resizing actions
    const handleMouseUp = useCallback(() => {
        setIsResizingHorizontal(false);
        setIsResizingVertical(false);
        document.body.style.userSelect = ''; // Re-enable text selection
    }, []);

    // Add and clean up event listeners for resizing
    useEffect(() => {
        if (isResizingHorizontal) {
            window.addEventListener('mousemove', handleMouseMoveHorizontal);
        }
        if (isResizingVertical) {
            window.addEventListener('mousemove', handleMouseMoveVertical);
        }
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseleave', handleMouseUp);
        window.addEventListener('blur', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveHorizontal);
            window.removeEventListener('mousemove', handleMouseMoveVertical);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseleave', handleMouseUp);
            window.removeEventListener('blur', handleMouseUp);
        };
    }, [
        isResizingHorizontal,
        isResizingVertical,
        handleMouseMoveHorizontal,
        handleMouseMoveVertical,
        handleMouseUp,
    ]);

    return {
        editorWidth,
        problemHeight,
        editorOuterRef,
        problemRef,
        handleMouseDownHorizontal,
        handleMouseDownVertical,
    };
};
