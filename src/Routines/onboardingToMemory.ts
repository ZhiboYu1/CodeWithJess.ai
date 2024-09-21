import { OnboardingAssistantToolInput } from "../Pages/Onboarding/OnboardingAssistantPrompts";

function onboardingToMemory(onboardingData: OnboardingAssistantToolInput): Array<string> {
    return [
        `The user's name is ${onboardingData.name}.`,
        `The user's stated goals for learning to code are: ${onboardingData.goals}.`,
        `The user's desired programming language is: ${onboardingData.programming_language}.`,
        `The user's stated constructs to learn or avoid are: ${onboardingData.constructs_to_learn_or_avoid}.`,
        `The user's prior knowledge of programming is: ${onboardingData.prior_knowledge}.`,
        `Additional notes you have kept for yourself from onboarding the user are: ${onboardingData.additional_notes}.`,
    ];
}

export {onboardingToMemory};