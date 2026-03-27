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
     expect(getScenarioBank()).toHaveLength(5);
     expect(getScenarioBank().every((scenario) => scenario.questions.length === 10)).toBe(true);
  });

  it('builds participant set as 20 mcq + 20 scenario + 20 circuit + 6 challenge', () => {
    const set = buildRound1QuestionSet();

     expect(set).toHaveLength(66);

    const mcq = set.filter((q) => q.type === 'mcq');
    const scenario = set.filter((q) => q.type === 'scenario-mcq');
    const circuit = set.filter((q) => q.type === 'simulation');
    const challenge = set.filter((q) => q.section === 'D');

    expect(mcq).toHaveLength(20);
    expect(scenario).toHaveLength(20);
    expect(circuit).toHaveLength(20);
    expect(challenge).toHaveLength(6);

    expect(mcq.filter((q) => q.difficulty === 'Easy')).toHaveLength(10);
    expect(mcq.filter((q) => q.difficulty === 'Hard')).toHaveLength(10);
  });

  it('exports full sqlite bank with expected size', () => {
    const full = buildRound1QuestionBankForSqlite();

    expect(full).toHaveLength(206);
    expect(full.filter((q) => q.type === 'mcq')).toHaveLength(100);
    expect(full.filter((q) => q.type === 'scenario-mcq')).toHaveLength(50);
    expect(full.filter((q) => q.type === 'simulation')).toHaveLength(50);
    expect(full.filter((q) => q.section === 'D')).toHaveLength(6);
  });

  it('uses clean academic naming in hard section questions', () => {
    const hard = getHardMcqBank();

    expect(hard.every((q) => !q.title.startsWith('Advanced Application'))).toBe(true);
    expect(hard.every((q) => !q.stem.startsWith('Applied Question:'))).toBe(true);
    expect(hard.some((q) => q.stem.includes('Practical check:'))).toBe(false);
  });

  it('stores scenario prompt separately from question text marker', () => {
    const full = buildRound1QuestionBankForSqlite();
    const scenarioQuestions = full.filter((q) => q.type === 'scenario-mcq');

    expect(scenarioQuestions.length).toBeGreaterThan(0);
    expect(scenarioQuestions.every((q) => String(q.scenario).includes('Story and Problem Statement:'))).toBe(true);
    expect(scenarioQuestions.every((q) => String(q.scenario).includes('Question:'))).toBe(true);
  });
});
