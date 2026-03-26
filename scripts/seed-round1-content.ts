import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

import {
  buildRound1QuestionBankForSqlite,
  getConnectionQuestionBank,
  getEasyMcqBank,
  getHardMcqBank,
  getScenarioBank,
  getSnippetCodingQuestionBank,
} from '../lib/round1-question-bank';

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'data');
const dbPath = path.join(dataDir, 'iot-event.db');
const markdownPath = path.join(projectRoot, 'ROUND1_QUESTION_BANK_REFERENCE.md');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS round1_question_bank (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_type TEXT NOT NULL,
  title TEXT NOT NULL,
  scenario TEXT NOT NULL,
  section TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  score INTEGER NOT NULL,
  time_limit INTEGER NOT NULL,
  options_json TEXT,
  correct_answer_json TEXT,
  scenario_group TEXT,
  code_snippet TEXT,
  source_nodes_json TEXT,
  target_nodes_json TEXT,
  expected_connections_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS round1_generation_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  generated_at TEXT NOT NULL,
  easy_mcq_count INTEGER NOT NULL,
  hard_mcq_count INTEGER NOT NULL,
  scenario_count INTEGER NOT NULL,
  scenario_question_count INTEGER NOT NULL,
  connection_question_count INTEGER NOT NULL,
  snippet_question_count INTEGER NOT NULL,
  total_bank_count INTEGER NOT NULL
);
`);

const metadataColumns = db.prepare(`PRAGMA table_info(round1_generation_metadata)`).all() as Array<{ name: string }>;
const hasSnippetColumn = metadataColumns.some((column) => column.name === 'snippet_question_count');
if (!hasSnippetColumn) {
  db.exec(`ALTER TABLE round1_generation_metadata ADD COLUMN snippet_question_count INTEGER NOT NULL DEFAULT 0`);
}

const deleteBank = db.prepare('DELETE FROM round1_question_bank');
const deleteMeta = db.prepare('DELETE FROM round1_generation_metadata');

deleteBank.run();
deleteMeta.run();

const bank = buildRound1QuestionBankForSqlite();
const insertStmt = db.prepare(`
INSERT INTO round1_question_bank (
  question_type,
  title,
  scenario,
  section,
  difficulty,
  score,
  time_limit,
  options_json,
  correct_answer_json,
  scenario_group,
  code_snippet,
  source_nodes_json,
  target_nodes_json,
  expected_connections_json
) VALUES (
  @question_type,
  @title,
  @scenario,
  @section,
  @difficulty,
  @score,
  @time_limit,
  @options_json,
  @correct_answer_json,
  @scenario_group,
  @code_snippet,
  @source_nodes_json,
  @target_nodes_json,
  @expected_connections_json
)
`);

const insertMany = db.transaction((questions: typeof bank) => {
  for (const q of questions) {
    insertStmt.run({
      question_type: q.type,
      title: q.title,
      scenario: q.scenario,
      section: q.section,
      difficulty: q.difficulty,
      score: q.score,
      time_limit: q.timeLimit,
      options_json: q.options ? JSON.stringify(q.options) : null,
      correct_answer_json: q.correctAnswer ? JSON.stringify(q.correctAnswer) : null,
      scenario_group: q.scenario_group || null,
      code_snippet: q.codeSnippet || null,
      source_nodes_json: q.sourceNodes ? JSON.stringify(q.sourceNodes) : null,
      target_nodes_json: q.targetNodes ? JSON.stringify(q.targetNodes) : null,
      expected_connections_json: q.expectedConnections ? JSON.stringify(q.expectedConnections) : null,
    });
  }
});

insertMany(bank);

const easyCount = getEasyMcqBank().length;
const hardCount = getHardMcqBank().length;
const scenarios = getScenarioBank();
const scenarioQuestionCount = scenarios.reduce((sum, scenario) => sum + scenario.questions.length, 0);
const connectionCount = getConnectionQuestionBank().length;
const snippetCount = getSnippetCodingQuestionBank().length;

const insertMeta = db.prepare(`
INSERT INTO round1_generation_metadata (
  generated_at,
  easy_mcq_count,
  hard_mcq_count,
  scenario_count,
  scenario_question_count,
  connection_question_count,
  snippet_question_count,
  total_bank_count
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertMeta.run(
  new Date().toISOString(),
  easyCount,
  hardCount,
  scenarios.length,
  scenarioQuestionCount,
  connectionCount,
  snippetCount,
  bank.length
);

const lines: string[] = [];

lines.push('# Round 1 Question Bank Reference');
lines.push('');
lines.push('This file is generated from the curated bank and is used as the event reference source.');
lines.push('');
lines.push('## Structure');
lines.push('');
lines.push('- MCQ pool: 50 Easy + 50 Hard');
lines.push('- Scenario pool: 10 scenarios x 5 questions each');
lines.push('- Connection-evaluation: 10 offline-evaluated questions');
lines.push('- Basic snippet coding: 10 reverse-connection coding questions');
lines.push('- Assignment per participant: 10 Easy MCQ + 10 Hard MCQ + 2 random scenarios (10 Q) + 2 connection questions + 2 snippet coding questions');
lines.push('');
lines.push('## Easy MCQ (50)');
lines.push('');

getEasyMcqBank().forEach((q, index) => {
  lines.push(`### E${index + 1}. ${q.title}`);
  lines.push(`- Question: ${q.stem}`);
  lines.push(`- A. ${q.options[0]}`);
  lines.push(`- B. ${q.options[1]}`);
  lines.push(`- C. ${q.options[2]}`);
  lines.push(`- D. ${q.options[3]}`);
  lines.push(`- Correct: ${['A', 'B', 'C', 'D'][q.correctIndex]}`);
  lines.push('');
});

lines.push('## Hard MCQ (50)');
lines.push('');

getHardMcqBank().forEach((q, index) => {
  lines.push(`### H${index + 1}. ${q.title}`);
  lines.push(`- Question: ${q.stem}`);
  lines.push(`- A. ${q.options[0]}`);
  lines.push(`- B. ${q.options[1]}`);
  lines.push(`- C. ${q.options[2]}`);
  lines.push(`- D. ${q.options[3]}`);
  lines.push(`- Correct: ${['A', 'B', 'C', 'D'][q.correctIndex]}`);
  lines.push('');
});

lines.push('## Scenario Bank (10 x 5)');
lines.push('');

scenarios.forEach((scenario, sIndex) => {
  lines.push(`### Scenario ${sIndex + 1}: ${scenario.title}`);
  lines.push(`- Prompt: ${scenario.prompt}`);
  lines.push('');
  scenario.questions.forEach((q, qIndex) => {
    lines.push(`#### S${sIndex + 1}Q${qIndex + 1}`);
    lines.push(`- Question: ${q.stem}`);
    lines.push(`- A. ${q.options[0]}`);
    lines.push(`- B. ${q.options[1]}`);
    lines.push(`- C. ${q.options[2]}`);
    lines.push(`- D. ${q.options[3]}`);
    lines.push(`- Correct: ${['A', 'B', 'C', 'D'][q.correctIndex]}`);
    lines.push('');
  });
});

const connectionBank = getConnectionQuestionBank();
const snippetBank = getSnippetCodingQuestionBank();
lines.push('## Connection Evaluation (10)');
lines.push('');
connectionBank.forEach((connection, index) => {
  lines.push(`### C${index + 1}. ${connection.title}`);
  lines.push(`- Question: ${connection.stem}`);
  lines.push('- Code:');
  lines.push('```cpp');
  lines.push(connection.codeSnippet);
  lines.push('```');
  lines.push('');
  lines.push('- Source nodes:');
  connection.sourceNodes.forEach((node) => lines.push(`  - ${node}`));
  lines.push('- Target nodes:');
  connection.targetNodes.forEach((node) => lines.push(`  - ${node}`));
  lines.push('- Expected connections:');
  connection.expectedConnections.forEach((edge) => lines.push(`  - ${edge.from} -> ${edge.to}`));
  lines.push('');
});

lines.push('## Basic Snippet Coding (10)');
lines.push('');
snippetBank.forEach((snippet, index) => {
  lines.push(`### D${index + 1}. ${snippet.title}`);
  lines.push(`- Question: ${snippet.stem}`);
  lines.push('- Reference connections:');
  snippet.referenceConnections.forEach((edge) => lines.push(`  - ${edge.from} -> ${edge.to}`));
  lines.push('- Evaluation keywords (basic):');
  snippet.requiredKeywords.forEach((keyword) => lines.push(`  - ${keyword}`));
  lines.push('');
});

fs.writeFileSync(markdownPath, `${lines.join('\n')}\n`, 'utf-8');

db.close();

console.log('Round 1 content generated successfully.');
console.log(`SQLite path: ${dbPath}`);
console.log(`Markdown path: ${markdownPath}`);
console.log(`Total bank questions: ${bank.length}`);
