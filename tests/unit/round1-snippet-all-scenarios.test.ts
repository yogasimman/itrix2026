import { describe, expect, it } from 'vitest';

import { buildRound1QuestionBankForSqlite } from '@/lib/round1-question-bank';
describe('round1 section 4 challenge coverage', () => {
  it('contains all 6 interactive challenge questions in section D', () => {
    const all = buildRound1QuestionBankForSqlite();
    const sectionD = all.filter((q) => q.section === 'D');

    expect(sectionD).toHaveLength(6);
    expect(sectionD.every((q) => q.type === 'matching' || q.type === 'component-matching')).toBe(true);
    expect(sectionD.some((q) => q.title.includes('Code Logic Sequencing'))).toBe(true);
    expect(sectionD.reduce((sum, q) => sum + q.score, 0)).toBe(42);
  });
});
