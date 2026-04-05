export type MasteryInputs = {
  completion: number;
  quizAccuracy: number;
  retention: number;
  speed: number;
  consistency: number;
  casePerformance: number;
  frameworkReadiness: number;
  weakAreaResolution: number;
};

export function computeMasteryScore(v: MasteryInputs): number {
  const score =
    v.completion * 0.16 +
    v.quizAccuracy * 0.2 +
    v.retention * 0.16 +
    v.speed * 0.1 +
    v.consistency * 0.1 +
    v.casePerformance * 0.14 +
    v.frameworkReadiness * 0.08 +
    v.weakAreaResolution * 0.06;

  return Math.max(0, Math.min(100, Number(score.toFixed(2))));
}
