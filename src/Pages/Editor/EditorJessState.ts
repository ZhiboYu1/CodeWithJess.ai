import { Exercise } from "../../types/Exercise";

class EditorJessState {
    public currentExercise: Exercise | null;
    public editorCode: string;
    public editorLanguage: string;
    public editorSelection: string;
    public executionLog: string[];

    // Constructor to initialize properties
    constructor(
        editorCode: string = "",
        editorLanguage: string = "python", // Default language
        editorSelection: string = "",
        currentExercise: Exercise | null = null,
        executionLog: string[] = []
    ) {
        this.editorCode = editorCode;
        this.editorLanguage = editorLanguage;
        this.editorSelection = editorSelection;
        this.currentExercise = currentExercise;
        this.executionLog = executionLog;
    }

    public getCode(): string {
        return this.editorCode;
    }

    public setCode(newCode: string): void {
        this.editorCode = newCode;
    }

    public getLanguage(): string {
        return this.editorLanguage;
    }

    public setLanguage(newLanguage: string): void {
        this.editorLanguage = newLanguage;
    }

    // Selection Getters and Setters
    public getSelection(): string {
        return this.editorSelection;
    }

    public setSelection(newSelection: string): void {
        this.editorSelection = newSelection;
    }

    // Test Window Content Getters and Setters
    public getTestWindowContents(): string[] {
        return this.executionLog;
    }

    public setTestWindowContents(newContents: string[]): void {
        this.executionLog = newContents;
    }

    // Exercise Getters and Setters
    public getCurrentExercise(): Exercise | null {
        return this.currentExercise;
    }

    public setCurrentExercise(newExercise: Exercise): void {
        this.currentExercise = newExercise;
    }
}

export default EditorJessState;
