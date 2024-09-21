interface ExercisePlan {
    id: string;
    goal: string;
    constructsToPractice: string;
    exerciseTitle: string;
    exerciseSummary: string;
    additionalNotesToSelf: string;
}

type LessonPlan = ExercisePlan[];

export type { ExercisePlan, LessonPlan };