export interface SnippetEvaluationResult {
  isCorrect: boolean;
  scoreRatio: number;
  matchedCount: number;
  totalRequired: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function normalizeSnippet(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '');
}

export function parseRequiredKeywords(correctAnswer: string | string[] | undefined): string[] {
  if (!correctAnswer) return [];

  if (Array.isArray(correctAnswer)) {
    return correctAnswer.map((token) => normalizeSnippet(String(token))).filter(Boolean);
  }

  if (typeof correctAnswer === 'string') {
    try {
      const parsed = JSON.parse(correctAnswer);
      if (Array.isArray(parsed)) {
        return parsed.map((token) => normalizeSnippet(String(token))).filter(Boolean);
      }
      return [normalizeSnippet(correctAnswer)].filter(Boolean);
    } catch {
      return [normalizeSnippet(correctAnswer)].filter(Boolean);
    }
  }

  return [];
}

export function evaluateSnippetAnswer(
  answer: string,
  requiredKeywords: string[],
  passThreshold = 0.75
): SnippetEvaluationResult {
  const normalizedAnswer = normalizeSnippet(answer || '');
  const normalizedRequired = requiredKeywords.map((token) => normalizeSnippet(token)).filter(Boolean);

  if (normalizedRequired.length === 0) {
    return {
      isCorrect: false,
      scoreRatio: 0,
      matchedCount: 0,
      totalRequired: 0,
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  const matchedKeywords = normalizedRequired.filter((token) => normalizedAnswer.includes(token));
  const missingKeywords = normalizedRequired.filter((token) => !normalizedAnswer.includes(token));
  const scoreRatio = matchedKeywords.length / normalizedRequired.length;

  return {
    isCorrect: scoreRatio >= passThreshold,
    scoreRatio,
    matchedCount: matchedKeywords.length,
    totalRequired: normalizedRequired.length,
    matchedKeywords,
    missingKeywords,
  };
}