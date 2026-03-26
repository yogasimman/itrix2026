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

describe('round1 connection scoring regression', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('keeps connection scoring deterministic for full-match and partial-match submissions', async () => {
    await generatePool(makeJsonRequest({ action: 'generate_curated_round1_pool' }) as never);

    createParticipant('Student', 'p-connect', 'Team C', 'round1');

    const startReq = new Request('http://localhost/api/round1/questions?participantId=p-connect&action=start');
    const startRes = await getQuestions(startReq as never);
    const startBody = (await startRes.json()) as {
      questions: Array<{
        id: number;
        type: string;
        sourceNodes?: string[];
        targetNodes?: string[];
        expectedConnections?: Array<{ from: string; to: string }>;
      }>;
    };

    const connectionQuestion = startBody.questions.find((q) => q.type === 'connection-evaluation');
    expect(connectionQuestion).toBeDefined();

    const expected = connectionQuestion!.expectedConnections!;
    const fullAnswer = expected.reduce<Record<string, string>>((acc, edge) => {
      acc[edge.from] = edge.to;
      return acc;
    }, {});

    const fullRes = await submitResponse(
      makeJsonRequest({
        participantId: 'p-connect',
        questionId: connectionQuestion!.id,
        answer: JSON.stringify(fullAnswer),
        timeTaken: 20,
      }) as never
    );

    const fullData = (await fullRes.json()) as { response: { is_correct: boolean; score_obtained: number } };
    expect(fullRes.status).toBe(201);
    expect(fullData.response.is_correct).toBe(true);

    const partialAnswer = { ...fullAnswer };
    const firstKey = Object.keys(partialAnswer)[0];
    const candidatePins = ['arduino.d2', 'arduino.d7', 'arduino.d8', 'arduino.d9'];
    const wrongPin = candidatePins.find((pin) => pin !== partialAnswer[firstKey]) || 'arduino.d2';
    partialAnswer[firstKey] = wrongPin;

    const partialRes = await submitResponse(
      makeJsonRequest({
        participantId: 'p-connect',
        questionId: connectionQuestion!.id,
        answer: JSON.stringify(partialAnswer),
        timeTaken: 20,
      }) as never
    );

    const partialData = (await partialRes.json()) as { response: { is_correct: boolean; score_obtained: number } };
    expect(partialRes.status).toBe(201);
    expect(partialData.response.is_correct).toBe(false);
    expect(partialData.response.score_obtained).toBeGreaterThanOrEqual(0);
  });
});
