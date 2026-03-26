import { beforeEach, describe, expect, it } from 'vitest';

import { GET as getQuestions, POST as postQuestions } from '@/app/api/round1/questions/route';
import { PATCH as patchParticipant } from '@/app/api/participants/[id]/route';
import { createParticipant } from '@/lib/db';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 section control integration', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('supports participant section advance and admin section override', async () => {
    await postQuestions(makeJsonRequest({ action: 'generate_curated_round1_pool' }) as never);
    createParticipant('Section User', 'section-1', 'Team S', 'round1');

    const startReq = new Request('http://localhost/api/round1/questions?participantId=section-1&action=start');
    const startRes = await getQuestions(startReq as never);
    const startBody = (await startRes.json()) as { unlockedSection: number };

    expect(startRes.status).toBe(200);
    expect(startBody.unlockedSection).toBe(0);

    const advanceRes = await postQuestions(
      makeJsonRequest({ action: 'advance_section', participantId: 'section-1' }) as never
    );
    const advanceBody = (await advanceRes.json()) as { unlockedSection: number };

    expect(advanceRes.status).toBe(200);
    expect(advanceBody.unlockedSection).toBe(1);

    const overrideReq = new Request('http://localhost/api/participants/section-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'round1_override_section', sectionIndex: 0 }),
    });

    const overrideRes = await patchParticipant(overrideReq as never, {
      params: Promise.resolve({ id: 'section-1' }),
    });
    const overrideBody = (await overrideRes.json()) as { unlockedSection: number };

    expect(overrideRes.status).toBe(200);
    expect(overrideBody.unlockedSection).toBe(0);
  });
});
