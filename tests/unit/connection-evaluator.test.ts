import { describe, expect, it } from 'vitest';

import { evaluateConnections, mapAnswerToEdges } from '@/lib/connection-evaluator';

describe('connection evaluator', () => {
  const expected = [
    { from: 'pir.out', to: 'arduino.d2' },
    { from: 'buzzer.signal', to: 'arduino.d8' },
    { from: 'servo.signal', to: 'arduino.d9' },
  ];

  it('marks fully correct graph as correct', () => {
    const result = evaluateConnections(expected, [...expected]);
    expect(result.isCorrect).toBe(true);
    expect(result.matchedCount).toBe(3);
    expect(result.scoreRatio).toBe(1);
  });

  it('reports missing and extra edges', () => {
    const submitted = [
      { from: 'pir.out', to: 'arduino.d2' },
      { from: 'buzzer.signal', to: 'arduino.d7' },
    ];

    const result = evaluateConnections(expected, submitted);
    expect(result.isCorrect).toBe(false);
    expect(result.missingConnections.length).toBeGreaterThan(0);
    expect(result.extraConnections.length).toBeGreaterThan(0);
    expect(result.scoreRatio).toBeGreaterThan(0);
    expect(result.scoreRatio).toBeLessThan(1);
  });

  it('maps answer dictionary to edge list', () => {
    const edges = mapAnswerToEdges({
      'pir.out': 'arduino.d2',
      'servo.signal': 'arduino.d9',
    });

    expect(edges).toEqual([
      { from: 'pir.out', to: 'arduino.d2' },
      { from: 'servo.signal', to: 'arduino.d9' },
    ]);
  });
});
