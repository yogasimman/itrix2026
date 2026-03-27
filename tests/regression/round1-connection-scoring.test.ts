import { beforeEach, describe, expect, it } from 'vitest';

import { POST as generatePool, GET as getQuestions } from '@/app/api/round1/questions/route';
import { POST as submitResponse } from '@/app/api/round1/responses/route';
import { createParticipant } from '@/lib/db';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 section3 scoring regression', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('keeps image-based Section 3 MCQ scoring deterministic for correct and incorrect submissions', async () => {
    await generatePool(makeJsonRequest({ action: 'generate_curated_round1_pool' }) as never);

    createParticipant('Student', 'p-connect', 'Team C', 'round1');

    const startReq = new Request('http://localhost/api/round1/questions?participantId=p-connect&action=start');
    const startRes = await getQuestions(startReq as never);
    const startBody = (await startRes.json()) as {
      questions: Array<{
        id: number;
        type: string;
        section: string;
        correctAnswer?: string;
      }>;
    };

    const section3Question = startBody.questions.find((q) => q.type === 'simulation' && q.section === 'C');
    expect(section3Question).toBeDefined();

    const fullRes = await submitResponse(
      makeJsonRequest({
        participantId: 'p-connect',
        questionId: section3Question!.id,
        answer: section3Question!.correctAnswer || 'A',
        timeTaken: 20,
      }) as never
    );

    const fullData = (await fullRes.json()) as { response: { is_correct: boolean; score_obtained: number } };
    expect(fullRes.status).toBe(201);
    expect(fullData.response.is_correct).toBe(true);

    const wrongAnswer = ['A', 'B', 'C', 'D'].find((opt) => opt !== (section3Question!.correctAnswer || 'A')) || 'B';

    const partialRes = await submitResponse(
      makeJsonRequest({
        participantId: 'p-connect',
        questionId: section3Question!.id,
        answer: wrongAnswer,
        timeTaken: 20,
      }) as never
    );

    const partialData = (await partialRes.json()) as { response: { is_correct: boolean; score_obtained: number } };
    expect(partialRes.status).toBe(201);
    expect(partialData.response.is_correct).toBe(false);
    expect(partialData.response.score_obtained).toBeGreaterThanOrEqual(0);
  });
});
