import type {
  Exercise,
  FillBlankAnswerKey,
  SentenceConstructionAnswerKey,
  ReadingQuestion,
  AnswerResult,
} from '../../shared/types';

export function normalizeDanish(str: string): string {
  return str.trim().toLowerCase().normalize('NFC');
}

export function checkFillBlank(
  userAnswer: string,
  answerKey: FillBlankAnswerKey,
): AnswerResult {
  const normalized = normalizeDanish(userAnswer);
  const allAccepted = [...answerKey.correct, ...answerKey.accept_also].map(normalizeDanish);
  const correct = allAccepted.includes(normalized);

  return {
    correct,
    expected: answerKey.correct[0],
    userAnswer,
  };
}

export function checkSentenceConstruction(
  userOrder: string[],
  answerKey: SentenceConstructionAnswerKey,
): AnswerResult {
  const userNorm = userOrder.map(normalizeDanish);
  const correctNorm = answerKey.correct_order.map(normalizeDanish);

  const correct =
    userNorm.length === correctNorm.length &&
    userNorm.every((word, i) => word === correctNorm[i]);

  return {
    correct,
    expected: answerKey.correct_order.join(' '),
    userAnswer: userOrder.join(' '),
  };
}

export function checkReadingAnswer(
  userAnswer: string | number,
  question: ReadingQuestion,
): AnswerResult {
  if (question.type === 'multiple_choice') {
    const correct = userAnswer === question.correct_index;
    return {
      correct,
      expected: question.options?.[question.correct_index!] || '',
      userAnswer: typeof userAnswer === 'number' ? (question.options?.[userAnswer] || '') : userAnswer,
    };
  }

  // Free text
  const normalized = normalizeDanish(String(userAnswer));
  const accepted = (question.correct || []).map(normalizeDanish);
  const correct = accepted.includes(normalized);

  return {
    correct,
    expected: question.correct?.[0] || '',
    userAnswer: String(userAnswer),
  };
}

export function checkAnswer(
  exercise: Exercise,
  userAnswer: any,
): AnswerResult {
  switch (exercise.type) {
    case 'fill_blank':
      return checkFillBlank(userAnswer, exercise.answer_key as FillBlankAnswerKey);
    case 'sentence_construction':
      return checkSentenceConstruction(
        userAnswer,
        exercise.answer_key as SentenceConstructionAnswerKey,
      );
    case 'reading':
      // For reading, userAnswer should be { questionIndex, answer }
      return checkReadingAnswer(userAnswer.answer, userAnswer.question);
    case 'listening':
      // Same as fill_blank for transcription mode
      return checkFillBlank(userAnswer, exercise.answer_key as any);
    default:
      return { correct: false, expected: '', userAnswer: String(userAnswer) };
  }
}
