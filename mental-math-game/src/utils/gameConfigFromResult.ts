import { GameConfig, DifficultyLevel, RoundResult } from '../types';

const TIME_PER_QUESTION: Record<DifficultyLevel, number> = {
  easy: 15000,
  medium: 10000,
  hard: 5000,
};

export function buildGameConfigFromResult(result: RoundResult): GameConfig {
  if (result.gameConfig) {
    return result.gameConfig;
  }

  return {
    difficulty: result.difficulty,
    gameMode: result.gameMode,
    questionsPerRound: result.totalQuestions,
    timePerQuestion: TIME_PER_QUESTION[result.difficulty],
    enableDynamicDifficulty: false,
  };
}
