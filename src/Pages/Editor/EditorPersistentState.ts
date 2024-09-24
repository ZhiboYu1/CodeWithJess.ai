import { LessonPlan } from "../../types/ExercisePlan";
import { Exercise } from "../../types/Exercise";

interface ExerciseConversation {
    // TODO
}

interface ExercisePlanAssociatedData {
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

    public lessonPlan: LessonPlan;
    public indexOfCurrentExercise: number;
    public assistantMemory: string[];
    public exercisePlanAssociatedData: Map<string, ExercisePlanAssociatedData>;

    private constructor(lessonPlan: LessonPlan, indexOfCurrentExercise: number, assistantMemory: string[], exercisePlanAssociatedData: Map<string, ExercisePlanAssociatedData>) {
        this.lessonPlan = lessonPlan;
        this.indexOfCurrentExercise = indexOfCurrentExercise;
        this.assistantMemory = assistantMemory;
        this.exercisePlanAssociatedData = exercisePlanAssociatedData;
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

    private lastPersistTime: number = 0;

    public appStateUpdated() {
        const currentTime = Date.now();
        const timeSinceLastPersist = currentTime - this.lastPersistTime;

        if (timeSinceLastPersist >= 5000) { // 5000 milliseconds = 5 seconds
            this.persistToDisk();
            this.lastPersistTime = currentTime;
        }
    }

    private persistToDisk() {
        // Get the current EditorPersistentState instance
        const appState = EditorPersistentState.getInstance();
        // Convert the current state to a JSON string
        const stateJson = JSON.stringify({
            lessonPlan: appState.lessonPlan,
            indexOfCurrentExercise: appState.indexOfCurrentExercise,
            assistantMemory: appState.assistantMemory,
            exercisePlanAssociatedData: Array.from(appState.exercisePlanAssociatedData.entries())
        });

        // Save the JSON string to local storage
        localStorage.setItem('appState', stateJson);
    }

    public static loadFromDisk(): EditorPersistentState {
        // Retrieve the JSON string from local storage
        const stateJson = localStorage.getItem('appState');

        if (stateJson === null) {
            throw new Error("No state found in local storage.");
        }

        // Parse the JSON string into an object
        const stateObject = JSON.parse(stateJson);

        // Create a new EditorPersistentState instance from the object
        return new EditorPersistentState(
            stateObject.lessonPlan,
            stateObject.indexOfCurrentExercise,
            stateObject.assistantMemory,
            new Map(stateObject.exercisePlanAssociatedData)
        );
    }

    public getCurrentExerciseData(): ExercisePlanAssociatedData | null {
        const currentExerciseId = this.lessonPlan[this.indexOfCurrentExercise].id;
        return this.exercisePlanAssociatedData.get(currentExerciseId) || null;
    }

    public getNextExerciseData(): ExercisePlanAssociatedData | null {
        if (this.indexOfCurrentExercise + 1 >= this.lessonPlan.length) {
            console.warn("No more exercises left.");
            return null; // Or handle it differently if you want to loop back or end
        }

        const nextExerciseId = this.lessonPlan[this.indexOfCurrentExercise + 1].id;
        return this.exercisePlanAssociatedData.get(nextExerciseId) || null;
    }
    
    public getCurrentExercise(): Exercise | null {
        let currentExerciseData = this.getCurrentExerciseData();

        if (currentExerciseData === null) {
            return null;
        }

        return currentExerciseData.generatedExercise;
    }

    // Transition to the next exercise
    public toNextExercise(): Exercise | null {
        const nextExerciseData = this.getNextExerciseData();

        if (!nextExerciseData) {
            return null; // No more exercises available
        }

        this.indexOfCurrentExercise += 1; // Move to the next exercise
        this.appStateUpdated(); // Persist the state after changing the current exercise

        return nextExerciseData.generatedExercise; // Return the next exercise
    }
}

export default EditorPersistentState;