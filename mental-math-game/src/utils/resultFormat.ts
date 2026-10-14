import { GameMode, GameQuestion } from '../types';

export function formatUserAnswer(
  question: GameQuestion,
  gameMode: GameMode
): string {
  const { userAnswer } = question;

  if (userAnswer === undefined) {
    return 'Sin respuesta';
  }

  if (gameMode === 'truefalse') {
    return userAnswer === true ? 'Verdadero' : 'Falso';
  }

  if (typeof userAnswer === 'number' && userAnswer < 0) {
    return 'Sin respuesta';
  }

  return String(userAnswer);
}

export function formatCorrectAnswer(
  question: GameQuestion,
  gameMode: GameMode
): string {
  if (gameMode === 'truefalse') {
    return question.operation.correctAnswer !== -1 ? 'Verdadero' : 'Falso';
  }

  return String(question.operation.correctAnswer);
}
