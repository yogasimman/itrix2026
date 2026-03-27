import { beforeEach, describe, expect, it } from 'vitest';

import {
  addComponent,
  addScenario,
  assignScenario,
  createParticipant,
  getRound2HintSummary,
  setScenarioComponents,
  unlockSnippet,
} from '@/lib/db';

describe('round2 component access scoring (unit)', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('distributes total max penalty (30) across scenario components', () => {
    addComponent({ id: 201, name: 'A', description: 'A', pinout: 'A', category: 'Sensor', quantity: 1, code_snippet: 'A' });
    addComponent({ id: 202, name: 'B', description: 'B', pinout: 'B', category: 'Sensor', quantity: 1, code_snippet: 'B' });
    addComponent({ id: 203, name: 'C', description: 'C', pinout: 'C', category: 'Sensor', quantity: 1, code_snippet: 'C' });

    addScenario({
      id: 9001,
      title: 'Component Access Scenario',
      situation: 'Test setup',
      what_to_build: 'Build system',
      team_number: 1,
    });
    setScenarioComponents(9001, [201, 202, 203]);

    createParticipant('Unit Tester', 'u-round2-1', 'Team Unit', 'round2');
    assignScenario('u-round2-1', 9001);

    unlockSnippet('u-round2-1', 201);
    unlockSnippet('u-round2-1', 202);
    unlockSnippet('u-round2-1', 203);

    const summary = getRound2HintSummary('u-round2-1');
    expect(summary.baseScore).toBe(100);
    expect(summary.maxPenalty).toBe(30);
    expect(summary.hintsUsedCount).toBe(3);
    expect(summary.totalComponents).toBe(3);
    expect(summary.totalPenalty).toBe(30);
    expect(summary.finalScore).toBe(70);
  });

  it('keeps repeated component access idempotent', () => {
    addComponent({ id: 301, name: 'Only', description: 'Only', pinout: 'P', category: 'Sensor', quantity: 1, code_snippet: 'X' });

    addScenario({
      id: 9002,
      title: 'Idempotency Scenario',
      situation: 'Repeated component access test',
      what_to_build: 'Single',
      team_number: 2,
    });
    setScenarioComponents(9002, [301]);

    createParticipant('Hint Repeat', 'u-round2-2', 'Team Unit', 'round2');
    assignScenario('u-round2-2', 9002);

    const first = unlockSnippet('u-round2-2', 301);
    const second = unlockSnippet('u-round2-2', 301);

    expect(first.success).toBe(true);
    expect(second.success).toBe(false);

    const summary = getRound2HintSummary('u-round2-2');
    expect(summary.hintsUsedCount).toBe(1);
    expect(summary.totalPenalty).toBe(30);
  });

  it('scales per-component penalty with component count', () => {
    addComponent({ id: 401, name: 'C1', description: 'C1', pinout: 'P1', category: 'Sensor', quantity: 1, code_snippet: '1' });
    addComponent({ id: 402, name: 'C2', description: 'C2', pinout: 'P2', category: 'Sensor', quantity: 1, code_snippet: '2' });
    addComponent({ id: 403, name: 'C3', description: 'C3', pinout: 'P3', category: 'Sensor', quantity: 1, code_snippet: '3' });
    addComponent({ id: 404, name: 'C4', description: 'C4', pinout: 'P4', category: 'Sensor', quantity: 1, code_snippet: '4' });

    addScenario({
      id: 9003,
      title: 'Penalty Scale Scenario',
      situation: 'Scale test',
      what_to_build: 'Scale',
      team_number: 3,
    });
    setScenarioComponents(9003, [401, 402, 403, 404]);

    createParticipant('Penalty Cap', 'u-round2-3', 'Team Unit', 'round2');
    assignScenario('u-round2-3', 9003);

    unlockSnippet('u-round2-3', 401);
    unlockSnippet('u-round2-3', 402);

    const summary = getRound2HintSummary('u-round2-3');
    expect(summary.totalComponents).toBe(4);
    expect(summary.hintsUsedCount).toBe(2);
    expect(summary.totalPenalty).toBe(16);
    expect(summary.finalScore).toBe(84);
  });
});
