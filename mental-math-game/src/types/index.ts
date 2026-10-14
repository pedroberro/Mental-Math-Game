// Tipos principales de la aplicación

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'truefalse' | 'multichoice' | 'timed';
export type OperationType = '+' | '-' | '*' | '/';

export interface MathOperation {
  id: string;
  num1: number;
  num2: number;
  operator: OperationType;
  correctAnswer: number;
  difficulty: DifficultyLevel;
}

export interface MultiChoiceOption {
  id: string;
  value: number;
  isCorrect: boolean;
}

export interface GameQuestion {
  operation: MathOperation;
  question: string;
  options?: MultiChoiceOption[];
  startTime?: number;
  userAnswer?: number | boolean;
  responseTime?: number;
  isCorrect?: boolean;
  points?: number;
}

export interface RoundResult {
  id: string;
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  timestamp: number;
  questions: GameQuestion[];
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  averageResponseTime: number;
  totalTime: number;
  gameConfig?: GameConfig;
}

export interface PlayerStats {
  totalGamesPlayed: number;
  bestScore: number;
  totalPoints: number;
  gamesHistory: RoundResult[];
  statisticsByMode: {
    [key in GameMode]: ModeStats;
  };
  statisticsByDifficulty: {
    [key in DifficultyLevel]: DifficultyStats;
  };
}

export interface ModeStats {
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  accuracy: number;
  totalPoints: number;
}

export interface DifficultyStats {
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  accuracy: number;
  averageResponseTime: number;
}

export interface GameConfig {
  difficulty: DifficultyLevel;
  gameMode: GameMode;
  questionsPerRound: number;
  timePerQuestion: number;
  enableDynamicDifficulty: boolean;
}

export interface GameSessionState {
  config: GameConfig;
  currentQuestionIndex: number;
  questions: GameQuestion[];
  totalPoints: number;
  isActive: boolean;
  startTime: number;
  endTime?: number;
  timedModeTimeRemaining?: number;
}
