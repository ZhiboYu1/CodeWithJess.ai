import { LessonPlan } from "./types/ExercisePlan";
import { Exercise } from "./types/Exercise";

interface ExerciseConversation {
    // TODO
}

interface ExercisePlanAssociatedData {
    generatedExercise: Exercise | null;
    isCompleted: boolean;
    lastSolutionFailedReason: string | null;
    userSolution: string | null;
    userConversations: ExerciseConversation[];
}

class AppState {
    private static instance: AppState;
    // public lessonPlan: LessonPlan
    // public indexOfCurrentExercise: number;
    // public assistantMemory: string[];


    private constructor() {
        // this.someProperty = "Initial Value";
    }

    public static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }

        return AppState.instance;
    }

    public setSomeProperty(value: string) {
        // this.someProperty = value;
    }
}

export default AppState;