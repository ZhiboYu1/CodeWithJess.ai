import {Exercise} from "../../types/Exercise";

class EditorJessState {
    private static instance: EditorJessState | null = null;

    public editorCode: string;
    public editorLanguage: string;
    public editorSelection: string; // if nothing is selected, just provide the line the keyboard caret is on
    public currentExercise: Exercise;
    public currentTestWindowContents: string[];

    // placeholder so the code compiles; do with this what you will.
    private constructor(editorCode: string, editorLanguage: string, editorSelection: string, currentExercise: Exercise, currentTestWindowContents: string[]) {
        this.editorCode = editorCode;
        this.editorLanguage = editorLanguage;
        this.editorSelection = editorSelection;
        this.currentExercise = currentExercise;
        this.currentTestWindowContents = currentTestWindowContents;
    }
    public static getInstance() : EditorJessState{
        if (EditorJessState.instance == null){
            throw new Error("EditorJessState is not initialized");
        }
        return EditorJessState.instance;

    }

    public static initialize(editorCode : string, editorLanguage : string, editorSelection: string, currentExercise: Exercise, currentTestWindowContents: string[]){
        if (EditorJessState.instance != null){
            throw new Error("EditorJessState is already initialized.");
        }
        EditorJessState.instance = new EditorJessState(editorCode, editorLanguage, editorSelection, currentExercise, currentTestWindowContents);
    }

    public getCode(): string{
        return this.editorCode;
    }
    public setCode(newCode: string): void{
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
        return this.currentTestWindowContents;
    }

    public setTestWindowContents(newContents: string[]): void {
        this.currentTestWindowContents = newContents;
    }

    // Exercise Getters and Setters
    public getCurrentExercise(): Exercise {
        return this.currentExercise;
    }

    public setCurrentExercise(newExercise: Exercise): void {
        this.currentExercise = newExercise;
    }
}
export default EditorJessState