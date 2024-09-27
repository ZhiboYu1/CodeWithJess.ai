import { LessonPlan } from "../../types/ExercisePlan";
import { Exercise } from "../../types/Exercise";
import {generateExercise} from "../../Routines/LessonPlan/generateExercise";

export interface ExerciseConversation {
    // TODO: Define the structure of a conversation
    id: string;
    messages: Array<{ role: 'user' | 'assistant', content: string }>;
    // Add other necessary fields
}

export interface ExercisePlanAssociatedData {
    generatedExercise: Exercise | null;
    isCompleted: boolean;
    lastSolutionFailedReason: string | null;
    userCode: string | null;
    allUserConversations: ExerciseConversation[];
    currentCodeActiveConversation: ExerciseConversation | null;
    currentQuestionActiveConversation: ExerciseConversation | null;
    timeSpent: number;
}

class EditorPersistentState {
    private static instance: EditorPersistentState | null = null;

    private _lessonPlan: LessonPlan;
    private _indexOfCurrentExercise: number;
    private _memory: string[];
    private _exercisePlanAssociatedData: Map<string, ExercisePlanAssociatedData>;

    private constructor(lessonPlan: LessonPlan, indexOfCurrentExercise: number, memory: string[], exercisePlanAssociatedData: Map<string, ExercisePlanAssociatedData>) {
        this._lessonPlan = lessonPlan;
        this._indexOfCurrentExercise = indexOfCurrentExercise;
        this._memory = memory;
        this._exercisePlanAssociatedData = exercisePlanAssociatedData;
    }

    public static initialize(lessonPlan: LessonPlan, indexOfCurrentExercise: number, assistantMemory: string[], exercisePlanAssociatedData: Map<string, ExercisePlanAssociatedData>) {
        if (EditorPersistentState.instance !== null) {
            throw new Error("EditorPersistentState has already been initialized.");
        }

        EditorPersistentState.instance = new EditorPersistentState(lessonPlan, indexOfCurrentExercise, assistantMemory, exercisePlanAssociatedData);
    }

    public static getInstance(): EditorPersistentState {
        if (EditorPersistentState.instance === null) {
            throw new Error("EditorPersistentState has not been initialized yet.");
        }

        return EditorPersistentState.instance;
    }

    public static isInitialized(): boolean {
        return EditorPersistentState.instance !== null;
    }

    // Getters and setters for private properties
    get lessonPlan(): LessonPlan {
        return this._lessonPlan;
    }

    set lessonPlan(value: LessonPlan) {
        this._lessonPlan = value;
        this.appStateUpdated();
    }

    get indexOfCurrentExercise(): number {
        return this._indexOfCurrentExercise;
    }

    set indexOfCurrentExercise(value: number) {
        this._indexOfCurrentExercise = value;
        this.appStateUpdated();
    }

    get memory(): string[] {
        return this._memory;
    }

    set memory(value: string[]) {
        this._memory = value;
        this.appStateUpdated();
    }

    get exercisePlanAssociatedData(): Map<string, ExercisePlanAssociatedData> {
        return this._exercisePlanAssociatedData;
    }


    private lastPersistTime: number = 0;

    public appStateUpdated() {
        const currentTime = Date.now();
        const timeSinceLastPersist = currentTime - this.lastPersistTime;

        if (timeSinceLastPersist >= 5000) { // 5000 milliseconds = 5 seconds
            this.persistToDisk();
            this.lastPersistTime = currentTime;
        }
    }

    set userCode(code: string | null) {
        const exerciseData = this.getCurrentExerciseData();
        exerciseData!.userCode = code;
        this.appStateUpdated();
    }

    get userCode(): string | null {
        const exerciseData = this.getCurrentExerciseData();
        return exerciseData!.userCode;
    }

    private persistToDisk() {
        const stateJson = JSON.stringify({
            lessonPlan: this._lessonPlan,
            indexOfCurrentExercise: this._indexOfCurrentExercise,
            assistantMemory: this._memory,
            exercisePlanAssociatedData: Array.from(this._exercisePlanAssociatedData.entries())
        });

        localStorage.setItem('appState', stateJson);
    }

    public static loadFromDisk(): EditorPersistentState {
        const stateJson = localStorage.getItem('appState');

        if (stateJson === null) {
            throw new Error("No state found in local storage.");
        }

        const stateObject = JSON.parse(stateJson);

        return new EditorPersistentState(
            stateObject.lessonPlan,
            stateObject.indexOfCurrentExercise,
            stateObject.assistantMemory,
            new Map(stateObject.exercisePlanAssociatedData)
        );
    }

    public getCurrentExerciseData(): ExercisePlanAssociatedData | null {
        if (this._indexOfCurrentExercise >= this._lessonPlan.length) {
            return null;
        }
        const currentExerciseId = this._lessonPlan[this._indexOfCurrentExercise].id;
        return this._exercisePlanAssociatedData.get(currentExerciseId) || null;
    }

    public getCurrentExercise(): Exercise | null {
        const currentExerciseData = this.getCurrentExerciseData();
        return currentExerciseData?.generatedExercise || null;
    }

    public async moveToNextExercise(): Promise<boolean> {
        if (this._indexOfCurrentExercise < this._lessonPlan.length - 1) {
            // Mark the current exercise as completed
            const currentExerciseId = this._lessonPlan[this._indexOfCurrentExercise].id;
            this.updateExercisePlanAssociatedData(currentExerciseId, { isCompleted: true });

            // Move to the next exercise
            this._indexOfCurrentExercise++;

            // Initialize or reset the data for the new current exercise if it doesn't exist
            const nextExerciseId = this._lessonPlan[this._indexOfCurrentExercise].id;
            if (!this._exercisePlanAssociatedData.has(nextExerciseId)) {
                const nextExercise = await generateExercise(this._memory, this._lessonPlan[this._indexOfCurrentExercise]);
                this._exercisePlanAssociatedData.set(nextExerciseId, {
                    generatedExercise: nextExercise,
                    isCompleted: false,
                    lastSolutionFailedReason: null,
                    userCode: null,
                    allUserConversations: [],
                    currentCodeActiveConversation: null,
                    currentQuestionActiveConversation: null,
                    timeSpent: 0
                });
            }

            this.appStateUpdated();
            return true;
        }
        return false;
    }

    public updateExercisePlanAssociatedData(exerciseId: string, data: Partial<ExercisePlanAssociatedData>) {
        const currentData = this._exercisePlanAssociatedData.get(exerciseId) || {} as ExercisePlanAssociatedData;
        this._exercisePlanAssociatedData.set(exerciseId, { ...currentData, ...data });
        this.appStateUpdated();
    }
}

export default EditorPersistentState;