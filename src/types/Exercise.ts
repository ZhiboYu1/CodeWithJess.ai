interface ExerciseExample {
    input: string;
    output: string;
    explanation: string | null;
}

interface TestCase {
    replInput: string;
    replOutput: string;
}

interface Exercise {
    id: string;  // identifier is shared with plan id
    title: string;
    description: string;
    example: ExerciseExample[];
    constraints: string;
    mainFunctionSignature: string;
    initialCode: string;
    testCases: TestCase[];
    additionalNotesToSelf: string;
}

export type { Exercise, ExerciseExample, TestCase };