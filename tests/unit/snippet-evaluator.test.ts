import { describe, expect, it } from 'vitest';

import { evaluateSnippetAnswer, parseRequiredKeywords } from '@/lib/snippet-evaluator';

describe('snippet evaluator', () => {
  it('parses keyword list from serialized correctAnswer json', () => {
    const parsed = parseRequiredKeywords(JSON.stringify(['pinMode(PIR_PIN, INPUT)', 'digitalRead(PIR_PIN)']));
    expect(parsed).toEqual(['pinmode(pir_pin,input)', 'digitalread(pir_pin)']);
  });

  it('passes when match ratio is at least 75 percent', () => {
    const required = ['a', 'b', 'c', 'd'];
    const result = evaluateSnippetAnswer('a b c', required, 0.75);
    expect(result.isCorrect).toBe(true);
    expect(result.matchedCount).toBe(3);
    expect(result.totalRequired).toBe(4);
  });

  it('fails and returns missing keywords when below threshold', () => {
    const required = ['pinmode(pir_pin,input)', 'digitalread(pir_pin)', 'tone(buzzer_pin'];
    const code = 'pinMode(PIR_PIN, INPUT);\nif(digitalRead(PIR_PIN)){}';
    const result = evaluateSnippetAnswer(code, required, 0.75);

    expect(result.isCorrect).toBe(false);
    expect(result.scoreRatio).toBeCloseTo(2 / 3, 5);
    expect(result.missingKeywords).toContain('tone(buzzer_pin');
  });
});
