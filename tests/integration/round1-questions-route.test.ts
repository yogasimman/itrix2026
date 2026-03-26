import { beforeEach, describe, expect, it } from 'vitest';

import { POST as generatePool, GET as getQuestions } from '@/app/api/round1/questions/route';
import { createParticipant } from '@/lib/db';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 questions route integration', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('generates curated pool and starts participant session with required structure', async () => {
    const generated = await generatePool(makeJsonRequest({ action: 'generate_curated_round1_pool' }) as never);
    expect(generated.status).toBe(201);

    createParticipant('Student', 'p-round1', 'Team A', 'round1');

    const startReq = new Request('http://localhost/api/round1/questions?participantId=p-round1&action=start');
    const startRes = await getQuestions(startReq as never);
    const body = (await startRes.json()) as { questions: Array<{ type: string; difficulty: string }> };

    expect(startRes.status).toBe(200);
    expect(body.questions).toHaveLength(34);

    const mcq = body.questions.filter((q) => q.type === 'mcq');
    const scenario = body.questions.filter((q) => q.type === 'scenario-mcq');
    const connection = body.questions.filter((q) => q.type === 'connection-evaluation');
    const snippet = body.questions.filter((q) => q.type === 'snippet-coding');

    expect(mcq).toHaveLength(20);
    expect(mcq.filter((q) => q.difficulty === 'Easy')).toHaveLength(10);
    expect(mcq.filter((q) => q.difficulty === 'Hard')).toHaveLength(10);
    expect(scenario).toHaveLength(10);
    expect(connection).toHaveLength(2);
    expect(snippet).toHaveLength(2);
  });
});
