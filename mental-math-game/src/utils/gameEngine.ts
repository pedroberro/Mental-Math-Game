// Utilidades para generar operaciones matemáticas

import {
  MathOperation,
  DifficultyLevel,
  OperationType,
  MultiChoiceOption,
} from '../types';

// Definición de dificultad y rangos
interface DifficultyConfig {
  minNum: number;
  maxNum: number;
  operators: OperationType[];
  timeLimit: number; // en ms
  timeDecrementPerQuestion: number; // ms por pregunta
}

const DIFFICULTY_CONFIG: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    minNum: 1,
    maxNum: 10,
    operators: ['+', '-'],
    timeLimit: 15000, // 15 segundos
    timeDecrementPerQuestion: 500,
  },
  medium: {
    minNum: 5,
    maxNum: 50,
    operators: ['+', '-', '*'],
    timeLimit: 10000, // 10 segundos
    timeDecrementPerQuestion: 800,
  },
  hard: {
    minNum: 10,
    maxNum: 100,
    operators: ['+', '-', '*', '/'],
    timeLimit: 5000, // 5 segundos
    timeDecrementPerQuestion: 1000,
  },
};

export function generateRandomOperation(
  difficulty: DifficultyLevel,
  id: string
): MathOperation {
  const config = DIFFICULTY_CONFIG[difficulty];

  const num1 = Math.floor(
    Math.random() * (config.maxNum - config.minNum + 1) + config.minNum
  );
  const num2 = Math.floor(
    Math.random() * (config.maxNum - config.minNum + 1) + config.minNum
  );
  const operator =
    config.operators[Math.floor(Math.random() * config.operators.length)];

  let correctAnswer = 0;
  switch (operator) {
    case '+':
      correctAnswer = num1 + num2;
      break;
    case '-':
      correctAnswer = num1 - num2;
      break;
    case '*':
      correctAnswer = num1 * num2;
      break;
    case '/':
      correctAnswer = Math.round(num1 / num2);
      break;
  }

  return {
    id,
    num1,
    num2,
    operator,
    correctAnswer,
    difficulty,
  };
}

export function generateQuestionsSet(
  count: number,
  difficulty: DifficultyLevel
): MathOperation[] {
  const operations: MathOperation[] = [];
  for (let i = 0; i < count; i++) {
    operations.push(generateRandomOperation(difficulty, `op-${Date.now()}-${i}`));
  }
  return operations;
}

export function generateMultipleChoiceOptions(
  correctAnswer: number
): MultiChoiceOption[] {
  const incorrectOptions: number[] = [];
  let attempts = 0;

  while (incorrectOptions.length < 3 && attempts < 200) {
    attempts += 1;
    const offset = Math.floor(Math.random() * 20) - 10 || 1;
    const wrongAnswer = correctAnswer + offset;

    if (
      wrongAnswer !== correctAnswer &&
      !incorrectOptions.includes(wrongAnswer) &&
      wrongAnswer >= 0
    ) {
      incorrectOptions.push(wrongAnswer);
    }
  }

  let fallback = 1;
  while (incorrectOptions.length < 3) {
    const candidate =
      fallback % 2 === 0
        ? correctAnswer + Math.ceil(fallback / 2)
        : Math.max(0, correctAnswer - Math.ceil(fallback / 2));
    fallback += 1;
    if (candidate !== correctAnswer && !incorrectOptions.includes(candidate)) {
      incorrectOptions.push(candidate);
    }
  }

  const allOptions = [correctAnswer, ...incorrectOptions];

  // Mezclar opciones
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  return allOptions.map((value, index) => ({
    id: `option-${index}`,
    value,
    isCorrect: value === correctAnswer,
  }));
}

export function formatMathOperation(operation: MathOperation): string {
  return `${operation.num1} ${operation.operator} ${operation.num2}`;
}

export function getTrueOrFalseProblem(): { answer: number; isCorrect: boolean } {
  const answer = Math.floor(Math.random() * 100) + 1;
  const isCorrect = Math.random() > 0.5;

  return {
    answer,
    isCorrect,
  };
}

export function getTimeLimit(
  difficulty: DifficultyLevel,
  questionIndex: number,
  enableDynamic: boolean
): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  if (!enableDynamic) {
    return config.timeLimit;
  }

  // Disminuir tiempo en cada pregunta
  const decrementedTime = Math.max(
    2000, // tiempo mínimo de 2 segundos
    config.timeLimit - questionIndex * config.timeDecrementPerQuestion
  );

  return decrementedTime;
}

export function calculateScore(
  isCorrect: boolean,
  responseTime: number,
  timeLimit: number
): number {
  if (!isCorrect) {
    return -30; // Respuesta incorrecta
  }

  if (responseTime > timeLimit) {
    return -50; // Sin respuesta a tiempo
  }

  // Calcular si fue rápido (menos del 75% del tiempo)
  if (responseTime < timeLimit * 0.75) {
    return 100; // Respuesta correcta rápida
  }

  return 70; // Respuesta correcta en tiempo
}

export function calculateAccuracy(
  correct: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function calculateAverageResponseTime(
  responseTimes: number[]
): number {
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((a, b) => a + b, 0);
  return Math.round(sum / responseTimes.length);
}
