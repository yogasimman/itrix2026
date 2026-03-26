import { describe, expect, it } from 'vitest';

import {
  buildRound1QuestionBankForSqlite,
  buildRound1QuestionSet,
  getEasyMcqBank,
  getHardMcqBank,
  getScenarioBank,
} from '@/lib/round1-question-bank';

describe('round1 question bank', () => {
  it('has required source pool counts', () => {
    expect(getEasyMcqBank()).toHaveLength(50);
    expect(getHardMcqBank()).toHaveLength(50);
    expect(getScenarioBank()).toHaveLength(10);
    expect(getScenarioBank().every((scenario) => scenario.questions.length === 5)).toBe(true);
  });

  it('builds participant set as 20 mcq + 10 scenario + 2 connection + 2 snippet', () => {
    const set = buildRound1QuestionSet();

    expect(set).toHaveLength(34);

    const mcq = set.filter((q) => q.type === 'mcq');
    const scenario = set.filter((q) => q.type === 'scenario-mcq');
    const connection = set.filter((q) => q.type === 'connection-evaluation');
    const snippet = set.filter((q) => q.type === 'snippet-coding');

    expect(mcq).toHaveLength(20);
    expect(scenario).toHaveLength(10);
    expect(connection).toHaveLength(2);
    expect(snippet).toHaveLength(2);

    expect(mcq.filter((q) => q.difficulty === 'Easy')).toHaveLength(10);
    expect(mcq.filter((q) => q.difficulty === 'Hard')).toHaveLength(10);
  });

  it('exports full sqlite bank with expected size', () => {
    const full = buildRound1QuestionBankForSqlite();

    expect(full).toHaveLength(170);
    expect(full.filter((q) => q.type === 'mcq')).toHaveLength(100);
    expect(full.filter((q) => q.type === 'scenario-mcq')).toHaveLength(50);
    expect(full.filter((q) => q.type === 'connection-evaluation')).toHaveLength(10);
    expect(full.filter((q) => q.type === 'snippet-coding')).toHaveLength(10);
  });
});
