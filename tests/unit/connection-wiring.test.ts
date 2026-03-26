import { describe, expect, it } from 'vitest';

import {
  connectionMapToEdges,
  decodeSourceHandleId,
  decodeTargetHandleId,
  edgesToConnectionMap,
  normalizeConnectionMap,
  parseConnectionAnswer,
  sourceHandleId,
  targetHandleId,
} from '@/lib/connection-wiring';

describe('connection wiring helpers', () => {
  it('encodes and decodes handle IDs safely', () => {
    const source = 'Soil Signal';
    const target = 'A0';

    const sourceId = sourceHandleId(source);
    const targetId = targetHandleId(target);

    expect(decodeSourceHandleId(sourceId)).toBe(source);
    expect(decodeTargetHandleId(targetId)).toBe(target);
  });

  it('normalizes connection maps against allowed nodes', () => {
    const map = {
      SIG: 'A0',
      VCC: '5V',
      JUNK: 'A1',
      GND: 'X',
    };

    const normalized = normalizeConnectionMap(map, ['SIG', 'VCC', 'GND'], ['A0', '5V', 'GND']);

    expect(normalized).toEqual({ SIG: 'A0', VCC: '5V' });
  });

  it('converts map to edges and back', () => {
    const map = { SIG: 'A0', VCC: '5V' };
    const edges = connectionMapToEdges(map);
    const rebuilt = edgesToConnectionMap(edges);

    expect(rebuilt).toEqual(map);
  });

  it('parses malformed answer safely', () => {
    expect(parseConnectionAnswer(undefined)).toEqual({});
    expect(parseConnectionAnswer('bad-json')).toEqual({});
    expect(parseConnectionAnswer('[]')).toEqual({});
    expect(parseConnectionAnswer('{"SIG":"A0"}')).toEqual({ SIG: 'A0' });
  });
});
