import {OnboardingAssistantToolInput} from "../../Pages/Onboarding/OnboardingAssistantPrompts";
import {onboardingToMemory} from "./onboardingToMemory";
import {generateLessonPlan} from "../LessonPlan/generateLessonPlan";
import {generateExercise} from "../LessonPlan/generateExercise";
import EditorPersistentState from "../../Pages/Editor/EditorPersistentState";

async function onboardingInitializeAppState(onboardingData: OnboardingAssistantToolInput) {
    let memory = onboardingToMemory(onboardingData);

    // build a lesson plan
    let lessonPlan = await generateLessonPlan(memory);

    // generate the first exercise
    let exercise = await generateExercise(memory, lessonPlan[0]);

    console.log("we have ze state: ", lessonPlan, exercise);

    EditorPersistentState.initialize(lessonPlan, 0, memory, new Map([[exercise.id, {
        generatedExercise: exercise,
        isCompleted: false,
        lastSolutionFailedReason: null,
        userCode: null,
        allUserConversations: [],
        currentCodeActiveConversation: null,
        currentQuestionActiveConversation: null,
        timeSpent: 0
    }]]));
}

export { onboardingInitializeAppState };