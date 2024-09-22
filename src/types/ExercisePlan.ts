// interface ExercisePlan {
//     id: string;
//     goal: string;
//     constructsToPractice: string;
//     exerciseTitle: string;
//     exerciseSummary: string;
//     additionalNotesToSelf: string;
// }

interface ExercisePlan {
    id: string;
    description: string;
}

type LessonPlan = ExercisePlan[];

export type { ExercisePlan, LessonPlan };