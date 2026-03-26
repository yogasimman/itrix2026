import { beforeEach, describe, expect, it } from 'vitest';

import {
  createParticipant,
  createRound1Question,
  createRound1Result,
  recordRound1Response,
  startOrGetRound1Session,
} from '@/lib/db';

describe('round1 bottom-up integration flow', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('wires lower-level db functions into a complete scoring result', () => {
    createParticipant('Bottom Student', 'bottom-up-1', 'Team B', 'round1');

    const question = createRound1Question({
      type: 'connection-evaluation',
      title: 'Simple Wiring',
      scenario: 'Connect SIG to A0 and VCC to 5V',
      section: 'C',
      difficulty: 'Hard',
      score: 10,
      timeLimit: 180,
      sourceNodes: ['SIG', 'VCC'],
      targetNodes: ['A0', '5V'],
      expectedConnections: [
        { from: 'SIG', to: 'A0' },
        { from: 'VCC', to: '5V' },
      ],
      correctAnswer: JSON.stringify({ SIG: 'A0', VCC: '5V' }),
      options: undefined,
      matchingPairs: undefined,
      codeSnippet: 'const int sensorPin = A0;',
    });

    const session = startOrGetRound1Session('bottom-up-1', 1);
    expect(session.question_ids).toEqual([question.id]);

    const response = recordRound1Response(
      'bottom-up-1',
      question.id,
      JSON.stringify({ SIG: 'A0', VCC: '5V' }),
      30
    );

    expect(response.is_correct).toBe(true);
    expect(response.score_obtained).toBe(10);

    const result = createRound1Result('bottom-up-1');
    expect(result.total_score).toBe(10);
    expect(result.correct_answers).toBe(1);
    expect(result.total_questions).toBe(1);
  });
});
