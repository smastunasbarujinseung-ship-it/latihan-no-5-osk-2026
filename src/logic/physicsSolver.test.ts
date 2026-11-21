import test from 'node:test';
import assert from 'node:assert/strict';
import { PROBLEMS } from '../data/problems';
import {
  computeAllProblemAnswers,
  computeEvaluationStats,
  formatOneDecimalComma,
  isAnswerCorrect,
  parseIndonesianNumber,
  roundToOneDecimal,
  solveSourceQuestion5,
} from './physicsSolver';

test('Source Question 5 (OSK 2026) yields exact value 2,8 and acute angle beta', () => {
  const sol = solveSourceQuestion5();
  assert.equal(formatOneDecimalComma(sol.rhsValue), '2,8');
  assert.ok(sol.betaDeg > 0 && sol.betaDeg < 90);
  assert.ok(sol.tensionPerMg > 0);
});

test('Rounding and comma formatting follow exact mathematical rounding rules', () => {
  assert.equal(roundToOneDecimal(4.25), 4.3);
  assert.equal(formatOneDecimalComma(4.25), '4,3');
  assert.equal(formatOneDecimalComma(-3.44), '-3,4');
  assert.equal(formatOneDecimalComma(-3.45), '-3,5');
  assert.equal(formatOneDecimalComma(125), '125,0');
  assert.equal(formatOneDecimalComma(0.8), '0,8');
});

test('Indonesian comma and dot inputs normalize and validate accurately', () => {
  assert.equal(parseIndonesianNumber(' 12,5 ').value, 12.5);
  assert.equal(parseIndonesianNumber('12.5').value, 12.5);
  assert.equal(parseIndonesianNumber('-3,4').value, -3.4);
  assert.equal(parseIndonesianNumber('abc').valid, false);
  assert.equal(parseIndonesianNumber('').valid, false);

  assert.equal(isAnswerCorrect('2,8', 2.8), true);
  assert.equal(isAnswerCorrect('2.8', 2.8), true);
  assert.equal(isAnswerCorrect('10,8', 10.78), true);
  assert.equal(isAnswerCorrect('10,78', 10.78), true);
  assert.equal(isAnswerCorrect('10,7', 10.78), false);
  assert.equal(isAnswerCorrect('5,3', 5.273), true);
});

test('All 15 problems pass independent physics validity and answer checks', () => {
  const all = computeAllProblemAnswers();
  assert.equal(Object.keys(all).length, 15);

  const expectedDisplays: Record<number, string> = {
    1: '7,5',
    2: '25,0',
    3: '4,0',
    4: '5,2',
    5: '10,8',
    6: '156,8',
    7: '1,4',
    8: '3,5',
    9: '0,8',
    10: '12,8',
    11: '2,5',
    12: '5,3',
    13: '3,2',
    14: '7,5',
    15: '160,0',
  };

  for (let i = 1; i <= 15; i += 1) {
    assert.ok(all[i], `Problem ${i} missing`);
    assert.equal(all[i].validPhysics, true, `Problem ${i} failed physical consistency`);
    assert.equal(
      all[i].roundedDisplay,
      expectedDisplays[i],
      `Problem ${i} expected ${expectedDisplays[i]} got ${all[i].roundedDisplay}`
    );
  }
});

test('Evaluation summary calculates mastery, tier stats, and recommendations accurately', () => {
  const tiers = Array.from({ length: 15 }, (_, idx) => ({
    id: idx + 1,
    tier: (Math.floor(idx / 3) + 1) as 1 | 2 | 3 | 4 | 5,
  }));

  const summary = computeEvaluationStats(tiers, {
    1: { rawInput: '7,5', isCorrect: true, attempts: 1 },
    2: { rawInput: '25,0', isCorrect: true, attempts: 1 },
    3: { rawInput: '4,0', isCorrect: true, attempts: 1 },
    4: { rawInput: '5,0', isCorrect: false, attempts: 2 },
  });

  assert.equal(summary.attemptedCount, 4);
  assert.equal(summary.correctCount, 3);
  assert.equal(summary.wrongCount, 1);
  assert.equal(summary.unansweredCount, 11);
  assert.equal(summary.scorePercent, 20);
  assert.equal(summary.tierStats[0].accuracyPercent, 100);
  assert.equal(summary.tierStats[1].accuracyPercent, 0);
  assert.ok(summary.recommendations.length >= 1);
});

test('PROBLEMS dataset has exactly 15 aligned problems with complete 10-stage solutions and narrations', () => {
  assert.equal(PROBLEMS.length, 15);
  const solverResults = computeAllProblemAnswers();

  for (const problem of PROBLEMS) {
    const solved = solverResults[problem.id];
    assert.ok(solved, `Missing solver check for problem ${problem.id}`);
    assert.equal(problem.answerFormatted, solved.roundedDisplay);
    assert.equal(problem.solution.tahap8HasilAkhir.nilaiFormatKoma, solved.roundedDisplay);
    assert.ok(Math.abs(problem.answerExact - solved.exactValue) < 1e-2);
    assert.ok(problem.solution.tahap1Fenomena.length > 20);
    assert.ok(problem.solution.tahap10Kesimpulan.length > 20);
    assert.ok(problem.narrator.soalDanStimulus.length > 20);
    assert.ok(problem.narrator.fbdDanKonsep.length > 20);
    assert.ok(problem.narrator.langkahPembahasan.length > 20);
    assert.ok(problem.narrator.animasiDanInterpretasi.length > 20);
  }
});
