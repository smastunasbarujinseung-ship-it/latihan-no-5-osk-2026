export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

export interface NumericParseResult {
  valid: boolean;
  value: number | null;
  normalizedDisplay: string;
}

/**
 * Normalizes student numeric input accepting either comma (',') or dot ('.')
 * as decimal separator, ignoring whitespace.
 */
export function parseIndonesianNumber(raw: string): NumericParseResult {
  const trimmed = raw.trim().replace(/\s+/g, '');
  if (!trimmed) {
    return { valid: false, value: null, normalizedDisplay: '' };
  }
  const normalized = trimmed.replace(/,/g, '.');
  // Must be a valid finite decimal number (optional leading +/-, digits, optional single dot)
  if (!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(normalized)) {
    return { valid: false, value: null, normalizedDisplay: '' };
  }
  const num = Number(normalized);
  if (!Number.isFinite(num)) {
    return { valid: false, value: null, normalizedDisplay: '' };
  }
  return {
    valid: true,
    value: num,
    normalizedDisplay: formatOneDecimalComma(num),
  };
}

/**
 * Standard mathematical rounding half-away-from-zero to 1 decimal place.
 * E.g. 4.25 -> 4.3, -4.25 -> -4.3, 12.04 -> 12.0.
 */
export function roundToOneDecimal(val: number): number {
  const sign = val < 0 ? -1 : 1;
  const absScaled = Math.abs(val) * 10;
  // Tiny epsilon avoids binary float representation issues like 4.25 * 10 = 42.49999999999999
  const rounded = Math.floor(absScaled + 0.5 + 1e-9) / 10;
  const result = sign * rounded;
  return Object.is(result, -0) ? 0 : result;
}

/**
 * Formats a number to exact 1 decimal place with comma separator (e.g. 12,5 or -3,4).
 */
export function formatOneDecimalComma(val: number): string {
  const rounded = roundToOneDecimal(val);
  return rounded.toFixed(1).replace('.', ',');
}

/**
 * Compares a student's raw numeric input against the exact numeric answer.
 * Normalizes both to 1 decimal place after checking standard rounding equivalence,
 * and also allows tight tolerance (<= 0.05 before rounding if rounded value matches).
 */
export function isAnswerCorrect(rawInput: string, exactAnswer: number): boolean {
  const parsed = parseIndonesianNumber(rawInput);
  if (!parsed.valid || parsed.value === null) {
    return false;
  }
  const expectedRounded = roundToOneDecimal(exactAnswer);
  const studentRounded = roundToOneDecimal(parsed.value);
  return Math.abs(studentRounded - expectedRounded) < 1e-6;
}

// ============================================================================
// INDEPENDENT PHYSICS ENGINE FOR SOAL NOMOR 5 & ALL 15 VARIATIONS
// ============================================================================

export interface ProblemPhysicsCheck {
  id: number;
  exactValue: number;
  roundedDisplay: string;
  tensionN?: number;
  normal1N?: number;
  normal2N?: number;
  validPhysics: boolean;
}

export function solveSourceQuestion5(): {
  rhsValue: number;
  betaDeg: number;
  tensionPerMg: number;
} {
  const sinAlpha = 3 / 5;
  const cosAlpha = 4 / 5;
  const aOverG = 1.1;
  // 10 sin(beta) - 11 cos(beta) = 11 cos(alpha) - 10 sin(alpha)
  const rhsValue = 11 * cosAlpha - 10 * sinAlpha; // 2.8
  // Solve 10 sin(beta) - 11 cos(beta) = rhsValue for beta in (0, 90 deg)
  const R = Math.hypot(10, 11);
  const phi = Math.atan2(11, 10);
  const betaRad = Math.asin(rhsValue / R) + phi;
  const betaDeg = (betaRad * 180) / Math.PI;
  const tensionPerMg = aOverG * cosAlpha - sinAlpha; // 0.28
  return { rhsValue, betaDeg, tensionPerMg };
}

export function computeAllProblemAnswers(): Record<number, ProblemPhysicsCheck> {
  const results: Record<number, ProblemPhysicsCheck> = {};

  // Soal 1: Single block on left slope (sin a = 3/5), g = 10 m/s^2, find a_min for equilibrium
  {
    const g = 10;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const a = g * (sinA / cosA); // 7.5
    const N1 = 1 * (g * cosA + a * sinA); // per kg
    results[1] = {
      id: 1,
      exactValue: a,
      roundedDisplay: formatOneDecimalComma(a),
      normal1N: N1,
      validPhysics: N1 > 0,
    };
  }

  // Soal 2: Normal force N1 on m1 = 2.0 kg, sin a = 3/5, a = g tan a, g = 10 m/s^2
  {
    const g = 10;
    const m1 = 2.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const a = g * (sinA / cosA); // 7.5
    const N1 = m1 * (g * cosA + a * sinA); // 25.0
    results[2] = {
      id: 2,
      exactValue: N1,
      roundedDisplay: formatOneDecimalComma(N1),
      normal1N: N1,
      validPhysics: N1 > 0 && Math.abs(N1 - (m1 * g) / cosA) < 1e-9,
    };
  }

  // Soal 3: Double wedge sin a = 3/5, sin b = 4/5, m1 = m2 = 2.0 kg, a = 1.0g, g = 10 m/s^2 -> T
  {
    const g = 10;
    const m1 = 2.0;
    const m2 = 2.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const a = 1.0 * g;
    const T1 = m1 * (a * cosA - g * sinA);
    const T2 = m2 * (g * sinB - a * cosB);
    const N1 = m1 * (g * cosA + a * sinA);
    const N2 = m2 * (g * cosB + a * sinB);
    results[3] = {
      id: 3,
      exactValue: T1,
      roundedDisplay: formatOneDecimalComma(T1),
      tensionN: T1,
      normal1N: N1,
      normal2N: N2,
      validPhysics: Math.abs(T1 - T2) < 1e-9 && T1 > 0 && N1 > 0 && N2 > 0,
    };
  }

  // Soal 4: Direct Soal 5 variant: sin a = 3/5, a = 1.4g, m1/m2 = 1 -> 10 sin b - 14 cos b
  {
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const expr = 14 * cosA - 10 * sinA; // 11.2 - 6.0 = 5.2
    const R = Math.hypot(10, 14);
    const betaRad = Math.asin(expr / R) + Math.atan2(14, 10);
    const betaValid = betaRad > 0 && betaRad < Math.PI / 2;
    const ToverMg = 1.4 * cosA - sinA; // 0.52 > 0
    results[4] = {
      id: 4,
      exactValue: expr,
      roundedDisplay: formatOneDecimalComma(expr),
      tensionN: ToverMg,
      validPhysics: betaValid && ToverMg > 0,
    };
  }

  // Soal 5: Unequal masses m1 = 2.0 kg, m2 = 4.0 kg, sin a = 3/5, sin b = 4/5, g = 9.8 -> a (m/s^2)
  {
    const g = 9.8;
    const m1 = 2.0;
    const m2 = 4.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const a = (g * (m1 * sinA + m2 * sinB)) / (m1 * cosA + m2 * cosB); // 1.1 * 9.8 = 10.78 -> 10.8
    const T1 = m1 * (a * cosA - g * sinA);
    const T2 = m2 * (g * sinB - a * cosB);
    results[5] = {
      id: 5,
      exactValue: a,
      roundedDisplay: formatOneDecimalComma(a),
      tensionN: T1,
      validPhysics: Math.abs(T1 - T2) < 1e-9 && T1 > 0,
    };
  }

  // Soal 6: Cart mass M = 12.0 kg, m1 = 2.0 kg (sin a = 3/5), m2 = 2.0 kg (sin b = 4/5), g = 9.8 -> F (N)
  {
    const g = 9.8;
    const M = 12.0;
    const m1 = 2.0;
    const m2 = 2.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const a = (g * (m1 * sinA + m2 * sinB)) / (m1 * cosA + m2 * cosB); // 9.8
    const F = (M + m1 + m2) * a; // 16 * 9.8 = 156.8
    results[6] = {
      id: 6,
      exactValue: F,
      roundedDisplay: formatOneDecimalComma(F),
      validPhysics: Math.abs(a - g) < 1e-9,
    };
  }

  // Soal 7: Ratio (N1 + N2) / (m1 g + m2 g) for Soal 5 at a = 1.0g, sin a = 3/5, sin b = 4/5, m1 = m2
  {
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const aOverG = 1.0;
    const n1OverMg = cosA + aOverG * sinA; // 1.4
    const n2OverMg = cosB + aOverG * sinB; // 1.4
    const ratio = (n1OverMg + n2OverMg) / 2; // 1.4
    results[7] = {
      id: 7,
      exactValue: ratio,
      roundedDisplay: formatOneDecimalComma(ratio),
      normal1N: n1OverMg,
      normal2N: n2OverMg,
      validPhysics: n1OverMg > 0 && n2OverMg > 0,
    };
  }

  // Soal 8: Relative acceleration a_rel when a = 1.5g, g = 10, m1 = m2 = 2.0 kg, sin a = 3/5, sin b = 4/5
  {
    const g = 10;
    const m1 = 2.0;
    const m2 = 2.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const a = 1.5 * g; // 15
    const aRel =
      (m1 * (a * cosA - g * sinA) + m2 * (a * cosB - g * sinB)) / (m1 + m2); // 3.5
    const T = m1 * (a * cosA - g * sinA - aRel); // 2 * (12 - 6 - 3.5) = 5.0 > 0
    results[8] = {
      id: 8,
      exactValue: aRel,
      roundedDisplay: formatOneDecimalComma(aRel),
      tensionN: T,
      validPhysics: T > 0 && aRel > 0,
    };
  }

  // Soal 9: Leftward acceleration limit before liftoff (N = 0). tan a = 3/4, tan b = 5/4 -> max a_left/g
  {
    const cotA = 4 / 3;
    const cotB = 4 / 5; // 0.8
    const maxALeftOverG = Math.min(cotA, cotB); // 0.8
    results[9] = {
      id: 9,
      exactValue: maxALeftOverG,
      roundedDisplay: formatOneDecimalComma(maxALeftOverG),
      validPhysics: maxALeftOverG > 0,
    };
  }

  // Soal 10: Static friction mu_s = 0.25 on left slope, right slope smooth, m1 = m2 = 1.0 kg, g = 10 -> a_max
  {
    const g = 10;
    const m1 = 1.0;
    const m2 = 1.0;
    const muS = 0.25;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    // m1*(a*cosA - g*sinA - muS*(g*cosA + a*sinA)) = m2*(g*sinB - a*cosB)
    const lhsCoeffA = m1 * (cosA - muS * sinA) + m2 * cosB;
    const rhsConstG = m2 * sinB + m1 * (sinA + muS * cosA);
    const aMax = (rhsConstG / lhsCoeffA) * g; // 1.6 / 1.25 * 10 = 12.8
    const T = m2 * (g * sinB - aMax * cosB); // 1 * (8 - 7.68) = 0.32 > 0
    results[10] = {
      id: 10,
      exactValue: aMax,
      roundedDisplay: formatOneDecimalComma(aMax),
      tensionN: T,
      validPhysics: T > 0,
    };
  }

  // Soal 11: Cart free to recoil on smooth floor! M = 14.5 kg, m1 = m2 = 5.0 kg, sin a = 3/5, sin b = 4/5, g = 10
  {
    const g = 10;
    const M = 14.5;
    const m1 = 5.0;
    const m2 = 5.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const C = m1 * cosA + m2 * cosB; // 7.0
    const S = m1 * sinA + m2 * sinB; // 7.0
    const Mtot = M + m1 + m2; // 24.5
    const mSum = m1 + m2; // 10.0
    const aCart = (S * C * g) / (mSum * Mtot - C * C); // 490 / 196 = 2.5
    const aRel = (Mtot / C) * aCart; // 8.75
    const T1 = m1 * (aRel - g * sinA - aCart * cosA); // 3.75
    const T2 = m2 * (g * sinB + aCart * cosB - aRel); // 3.75
    const N1 = m1 * (g * cosA - aCart * sinA); // 32.5
    const N2 = m2 * (g * cosB - aCart * sinB); // 20.0
    results[11] = {
      id: 11,
      exactValue: aCart,
      roundedDisplay: formatOneDecimalComma(aCart),
      tensionN: T1,
      normal1N: N1,
      normal2N: N2,
      validPhysics: Math.abs(T1 - T2) < 1e-9 && T1 > 0 && N1 > 0 && N2 > 0,
    };
  }

  // Soal 12: Resultant force on pulley in exact Soal 5 geometry (sin a = 3/5, a = 1.1g, m1=m2=5.0 kg, g=10)
  {
    const g = 10;
    const m = 5.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const a = 1.1 * g;
    const T = m * (a * cosA - g * sinA); // 14.0 N
    const { betaDeg } = solveSourceQuestion5();
    const alphaRad = Math.asin(sinA);
    const betaRad = (betaDeg * Math.PI) / 180;
    // T1 = T*(-cosA, +sinA), T2 = T*(+cosB, -sinB)
    const fx = T * (Math.cos(betaRad) - cosA);
    const fy = T * (sinA - Math.sin(betaRad));
    const Fpulley = Math.hypot(fx, fy); // ~5.273 -> 5.3 N
    results[12] = {
      id: 12,
      exactValue: Fpulley,
      roundedDisplay: formatOneDecimalComma(Fpulley),
      tensionN: T,
      validPhysics: T > 0 && Fpulley > 0,
    };
  }

  // Soal 13: Work-Energy in non-inertial frame after displacement d = 2.0 m, a = 1.2g, m1 = 3.0, m2 = 1.0, g = 10
  {
    const g = 10;
    const a = 1.2 * g; // 12
    const m1 = 3.0;
    const m2 = 1.0;
    const d = 2.0;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const fNet = m1 * (a * cosA - g * sinA) + m2 * (a * cosB - g * sinB); // 10.0 N
    const work = fNet * d; // 20.0 J
    const vRel = Math.sqrt((2 * work) / (m1 + m2)); // sqrt(10) ~ 3.162 -> 3.2
    const aRel = fNet / (m1 + m2); // 2.5
    const T = m1 * (a * cosA - g * sinA - aRel); // 3.3 N > 0
    results[13] = {
      id: 13,
      exactValue: vRel,
      roundedDisplay: formatOneDecimalComma(vRel),
      tensionN: T,
      validPhysics: T > 0 && vRel > 0,
    };
  }

  // Soal 14: Lab-frame speed of m1 at t = 0.5 s when cart starts from rest with a = 2.0g, m1=m2=2.0 kg, g=10
  {
    const g = 10;
    const a = 2.0 * g; // 20
    const m1 = 2.0;
    const m2 = 2.0;
    const t = 0.5;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;
    const aRel =
      (m1 * (a * cosA - g * sinA) + m2 * (a * cosB - g * sinB)) / (m1 + m2); // 7.0
    const T = m1 * (a * cosA - g * sinA - aRel); // 6.0 N > 0
    const vCartX = a * t; // 10.0
    const vRel = aRel * t; // 3.5
    const vx = vCartX - vRel * cosA; // 10.0 - 2.8 = 7.2
    const vy = vRel * sinA; // 2.1
    const vLab = Math.hypot(vx, vy); // 7.5 exact!
    results[14] = {
      id: 14,
      exactValue: vLab,
      roundedDisplay: formatOneDecimalComma(vLab),
      tensionN: T,
      validPhysics: T > 0 && Math.abs(vLab - 7.5) < 1e-9,
    };
  }

  // Soal 15: Two rough slopes (mu_s = 0.25), M = 11.0 kg, m1 = m2 = 2.0 kg, g = 10 -> F_max - F_min (N)
  {
    const g = 10;
    const M = 11.0;
    const m1 = 2.0;
    const m2 = 2.0;
    const muS = 0.25;
    const sinA = 3 / 5;
    const cosA = 4 / 5;
    const sinB = 4 / 5;
    const cosB = 3 / 5;

    // Max acceleration: both blocks tend to slide up-left (m1 away from pulley, m2 toward pulley)
    const aMax =
      (g * (m2 * (sinB + muS * cosB) + m1 * (sinA + muS * cosA))) /
      (m1 * (cosA - muS * sinA) + m2 * (cosB - muS * sinB)); // (5/3)*g
    // Min acceleration: both blocks tend to slide down-right
    const aMin =
      (g * (m2 * (sinB - muS * cosB) + m1 * (sinA - muS * cosA))) /
      (m1 * (cosA + muS * sinA) + m2 * (cosB + muS * sinB)); // (3/5)*g

    const Mtot = M + m1 + m2; // 15.0 kg
    const deltaF = Mtot * (aMax - aMin); // 160.0 N
    const TAtMax = m1 * (aMax * cosA - g * sinA - muS * (g * cosA + aMax * sinA));
    const TAtMin = m1 * (aMin * cosA - g * sinA + muS * (g * cosA + aMin * sinA));

    results[15] = {
      id: 15,
      exactValue: deltaF,
      roundedDisplay: formatOneDecimalComma(deltaF),
      tensionN: Math.min(TAtMax, TAtMin),
      validPhysics: TAtMax > 0 && TAtMin > 0 && deltaF > 0,
    };
  }

  return results;
}

export interface SubmissionRecord {
  rawInput: string;
  isCorrect: boolean;
  attempts: number;
}

export interface TierStat {
  tier: DifficultyTier;
  label: string;
  total: number;
  attempted: number;
  correct: number;
  accuracyPercent: number;
}

export interface EvaluationSummary {
  totalProblems: number;
  attemptedCount: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  scorePercent: number;
  masteryPercent: number;
  tierStats: TierStat[];
  competencyLevel: string;
  recommendations: string[];
}

const TIER_LABELS: Record<DifficultyTier, string> = {
  1: 'Fondasi Konsep (Soal 1–3)',
  2: 'Penerapan Bertahap (Soal 4–6)',
  3: 'Analisis Hubungan Besaran (Soal 7–9)',
  4: 'Problem Solving Menengah-Tinggi (Soal 10–12)',
  5: 'Tantangan OSK Kompleks (Soal 13–15)',
};

export function computeEvaluationStats(
  problemIdsByTier: Array<{ id: number; tier: DifficultyTier }>,
  submissions: Record<number, SubmissionRecord>
): EvaluationSummary {
  const totalProblems = problemIdsByTier.length;
  let attemptedCount = 0;
  let correctCount = 0;
  let wrongCount = 0;

  const tierMap = new Map<DifficultyTier, { total: number; attempted: number; correct: number }>();
  ([1, 2, 3, 4, 5] as DifficultyTier[]).forEach((t) => {
    tierMap.set(t, { total: 0, attempted: 0, correct: 0 });
  });

  for (const item of problemIdsByTier) {
    const bucket = tierMap.get(item.tier)!;
    bucket.total += 1;
    const sub = submissions[item.id];
    if (sub) {
      attemptedCount += 1;
      bucket.attempted += 1;
      if (sub.isCorrect) {
        correctCount += 1;
        bucket.correct += 1;
      } else {
        wrongCount += 1;
      }
    }
  }

  const unansweredCount = totalProblems - attemptedCount;
  const scorePercent = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 0;
  const masteryPercent = scorePercent;

  const tierStats: TierStat[] = ([1, 2, 3, 4, 5] as DifficultyTier[]).map((tier) => {
    const b = tierMap.get(tier)!;
    return {
      tier,
      label: TIER_LABELS[tier],
      total: b.total,
      attempted: b.attempted,
      correct: b.correct,
      accuracyPercent: b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0,
    };
  });

  let competencyLevel = 'Tahap Awal Pembinaan';
  if (masteryPercent >= 87) {
    competencyLevel = 'Siap Medali OSK Fisika';
  } else if (masteryPercent >= 67) {
    competencyLevel = 'Kompeten Tingkat Kota';
  } else if (masteryPercent >= 40) {
    competencyLevel = 'Berkembang Menengah';
  }

  const recommendations: string[] = [];
  if (attemptedCount === 0) {
    recommendations.push(
      'Mulailah dari menu Belajar Teori untuk memahami kerangka acuan non-inersia dan gaya fiktif sebelum mengerjakan Soal 1–3.'
    );
  } else {
    if (tierStats[0].correct < tierStats[0].total) {
      recommendations.push(
        'Perkuat pemahaman dasar proyeksi gaya berat (mg sin α) dan gaya fiktif (ma cos α) pada lereng tunggal di Bab Teori bagian 4–6.'
      );
    }
    if (tierStats[1].correct < tierStats[1].total) {
      recommendations.push(
        'Latih kembali metode kesetimbangan tegangan tali T pada kedua sisi katrol agar terampil menurunkan persamaan seperti Soal Nomor 5 OSK 2026.'
      );
    }
    if (tierStats[2].correct < tierStats[2].total) {
      recommendations.push(
        'Tinjau ulang syarat batas gaya normal N ≥ 0 dan analisis percepatan relatif saat sistem tidak setimbang (a ≠ a_eq).'
      );
    }
    if (tierStats[3].correct < tierStats[3].total) {
      recommendations.push(
        'Pelajari kasus gesekan statis dua arah, resultan vektor gaya katrol, serta hukum kekekalan momentum horizontal saat kereta bebas bergerak.'
      );
    }
    if (tierStats[4].correct < tierStats[4].total) {
      recommendations.push(
        'Fokuskan latihan pada penggabungan teorema usaha-energi dalam kerangka non-inersia serta transformasi kecepatan dari kerangka kereta ke kerangka tanah.'
      );
    }
    if (recommendations.length === 0) {
      recommendations.push(
        'Penguasaan Anda sangat solid di seluruh level! Pertahankan ketelitian pembulatan satu angka desimal dan uji variasi mandiri dengan simulasi animasi.'
      );
    }
  }

  return {
    totalProblems,
    attemptedCount,
    correctCount,
    wrongCount,
    unansweredCount,
    scorePercent,
    masteryPercent,
    tierStats,
    competencyLevel,
    recommendations,
  };
}
