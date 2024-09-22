function getAllExercisesFromResult(result: string): Array<string> {
    const exerciseRegex = /<exercise>([\s\S]*?)<\/exercise>/gs;
    const matches = result.matchAll(exerciseRegex);
    return Array.from(matches).map(match => match[1]);
}

export { getAllExercisesFromResult };