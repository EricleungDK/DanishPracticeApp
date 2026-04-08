import type { Exercise, ExerciseAnswer, FillBlankAnswerKey, ReadingAnswer, SentenceConstructionAnswerKey } from '../../shared/types';
import { normalizeDanish } from './answer-checker';

export function generateExplanation(
  exercise: Exercise,
  userAnswer: ExerciseAnswer,
  correct: boolean,
): string {
  switch (userAnswer.type) {
    case 'fill_blank':
      return explainFillBlank(exercise, userAnswer.value, correct);
    case 'sentence_construction':
      return explainSentenceConstruction(exercise, userAnswer.value, correct);
    case 'reading':
      return explainReading(exercise, userAnswer.value, correct);
    case 'listening':
      return explainListening(exercise, userAnswer.value, correct);
    default:
      return '';
  }
}

function explainFillBlank(exercise: Exercise, userAnswer: string, correct: boolean): string {
  const key = exercise.answer_key as FillBlankAnswerKey;
  const meta = exercise.metadata;
  const correctWord = key.correct[0];
  const fullSentence = exercise.danish_text.replace('___', correctWord);

  const parts: string[] = [];

  if (correct) {
    parts.push(`"${correctWord}" is correct.`);
  } else {
    parts.push(`The correct answer is "${correctWord}", not "${userAnswer}".`);
  }

  parts.push(`Full sentence: "${fullSentence}"`);
  if (key.answer_en) {
    parts.push(`Translation: "${exercise.english_text.replace('___', key.answer_en)}"`);
  }

  if (meta?.grammar_point) {
    parts.push(`Grammar: ${meta.grammar_point}.`);
  }

  if (meta?.hint) {
    parts.push(`Note: ${meta.hint}.`);
  }

  if (!correct && userAnswer.trim()) {
    const userNorm = normalizeDanish(userAnswer);
    const correctNorm = normalizeDanish(correctWord);

    if (userNorm.length > 0 && correctNorm.startsWith(userNorm.slice(0, 2))) {
      parts.push(`Your answer "${userAnswer}" is close — check the ending/conjugation.`);
    }
  }

  return parts.join('\n');
}

function explainSentenceConstruction(exercise: Exercise, userOrder: string[], correct: boolean): string {
  const key = exercise.answer_key as SentenceConstructionAnswerKey;
  const meta = exercise.metadata;
  const correctSentence = key.correct_order.join(' ');
  const userSentence = userOrder.join(' ');

  const parts: string[] = [];

  if (correct) {
    parts.push('Perfect word order!');
  } else {
    parts.push(`Correct order: "${correctSentence}"`);
    parts.push(`Your order: "${userSentence}"`);

    const misplaced: string[] = [];
    const correctNorm = key.correct_order.map(normalizeDanish);
    const userNorm = userOrder.map(normalizeDanish);
    for (let i = 0; i < Math.max(correctNorm.length, userNorm.length); i++) {
      if (correctNorm[i] !== userNorm[i]) {
        const expected = key.correct_order[i] || '(missing)';
        const got = userOrder[i] || '(missing)';
        misplaced.push(`Position ${i + 1}: expected "${expected}", got "${got}"`);
      }
    }
    if (misplaced.length > 0 && misplaced.length <= 3) {
      parts.push(misplaced.join('; '));
    }
  }

  parts.push(`Translation: "${exercise.english_text}"`);

  if (meta?.grammar_point) {
    parts.push(`Grammar: ${meta.grammar_point}.`);
  }

  if (meta?.focus_word) {
    parts.push(`Key word: "${meta.focus_word}".`);
  }

  if (!correct && meta?.grammar_point) {
    const gp = meta.grammar_point.toLowerCase();
    if (gp.includes('v2') || gp.includes('word order')) {
      parts.push('Tip: In Danish main clauses, the verb must be in the second position (V2 rule). If a non-subject starts the sentence, the subject moves after the verb.');
    }
    if (gp.includes('adverb') && gp.includes('subordinate')) {
      parts.push('Tip: In subordinate clauses (after "at", "fordi", "når", etc.), adverbs like "ikke", "aldrig" come BEFORE the verb, unlike main clauses.');
    }
    if (gp.includes('adverb') && !gp.includes('subordinate')) {
      parts.push('Tip: In main clauses, adverbs like "ikke", "aldrig" come AFTER the verb.');
    }
  }

  return parts.join('\n');
}

function explainReading(exercise: Exercise, userAnswer: ReadingAnswer, correct: boolean): string {
  const parts: string[] = [];
  const question = userAnswer.question;

  if (correct) {
    parts.push('Correct!');
  } else {
    if (question.type === 'multiple_choice' && question.options) {
      parts.push(`Correct answer: "${question.options[question.correct_index!]}"`);
    } else if (question.correct) {
      parts.push(`Accepted answers: ${question.correct.join(', ')}`);
    }
  }

  parts.push(`Question: "${question.question_en}"`);

  if (exercise.metadata?.topic) {
    parts.push(`Topic: ${exercise.metadata.topic}.`);
  }

  if (!correct) {
    parts.push('Tip: Re-read the passage carefully. Look for keywords that match the question.');
  }

  return parts.join('\n');
}

function explainListening(exercise: Exercise, userAnswer: string, correct: boolean): string {
  const parts: string[] = [];
  const correctText = exercise.danish_text;

  if (correct) {
    parts.push('Perfect transcription!');
  } else {
    parts.push(`Correct text: "${correctText}"`);
    parts.push(`Your transcription: "${userAnswer}"`);

    const correctWords = correctText.toLowerCase().split(/\s+/);
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const wrong: string[] = [];
    for (let i = 0; i < Math.max(correctWords.length, userWords.length); i++) {
      if (correctWords[i] !== userWords[i]) {
        wrong.push(`"${userWords[i] || '(missing)'}" should be "${correctWords[i] || '(extra)'}"`);
      }
    }
    if (wrong.length > 0 && wrong.length <= 4) {
      parts.push('Differences: ' + wrong.join('; '));
    }
  }

  parts.push(`Translation: "${exercise.english_text}"`);

  if (exercise.metadata?.focus) {
    parts.push(`Focus: ${exercise.metadata.focus}.`);
  }

  return parts.join('\n');
}
