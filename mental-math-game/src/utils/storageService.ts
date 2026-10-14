// Servicio de almacenamiento persistente

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoundResult, PlayerStats, GameMode, DifficultyLevel } from '../types';

const STORAGE_KEYS = {
  PLAYER_STATS: 'player_stats',
  GAMES_HISTORY: 'games_history',
  BEST_SCORES: 'best_scores',
};

class StorageService {
  // Inicializar estadísticas del jugador
  async initializePlayerStats(): Promise<PlayerStats> {
    try {
      const existingStats = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_STATS);

      if (existingStats) {
        return JSON.parse(existingStats);
      }

      const defaultStats: PlayerStats = {
        totalGamesPlayed: 0,
        bestScore: 0,
        totalPoints: 0,
        gamesHistory: [],
        statisticsByMode: {
          classic: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, totalPoints: 0 },
          truefalse: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, totalPoints: 0 },
          multichoice: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, totalPoints: 0 },
          timed: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, totalPoints: 0 },
        },
        statisticsByDifficulty: {
          easy: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, averageResponseTime: 0 },
          medium: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, averageResponseTime: 0 },
          hard: { gamesPlayed: 0, averageScore: 0, bestScore: 0, accuracy: 0, averageResponseTime: 0 },
        },
      };

      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(defaultStats));
      return defaultStats;
    } catch (error) {
      console.error('Error initializing player stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas del jugador
  async getPlayerStats(): Promise<PlayerStats> {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      if (stats) {
        return JSON.parse(stats);
      }
      return this.initializePlayerStats();
    } catch (error) {
      console.error('Error getting player stats:', error);
      throw error;
    }
  }

  // Guardar resultado de ronda
  async saveRoundResult(result: RoundResult): Promise<void> {
    try {
      const stats = await this.getPlayerStats();

      // Actualizar historial
      stats.gamesHistory.push(result);
      stats.totalGamesPlayed++;
      stats.totalPoints += result.totalPoints;

      // Actualizar mejor puntaje
      if (result.totalPoints > stats.bestScore) {
        stats.bestScore = result.totalPoints;
      }

      // Actualizar estadísticas por modo
      const modeStats = stats.statisticsByMode[result.gameMode];
      modeStats.gamesPlayed++;
      modeStats.bestScore = Math.max(modeStats.bestScore, result.totalPoints);
      modeStats.totalPoints += result.totalPoints;
      modeStats.averageScore = Math.round(modeStats.totalPoints / modeStats.gamesPlayed);
      modeStats.accuracy = Math.round(
        (result.accuracy + (modeStats.accuracy * (modeStats.gamesPlayed - 1))) /
          modeStats.gamesPlayed
      );

      // Actualizar estadísticas por dificultad
      const diffStats = stats.statisticsByDifficulty[result.difficulty];
      diffStats.gamesPlayed++;
      diffStats.bestScore = Math.max(diffStats.bestScore, result.totalPoints);
      diffStats.averageScore = Math.round(
        (result.totalPoints + diffStats.averageScore * (diffStats.gamesPlayed - 1)) /
          diffStats.gamesPlayed
      );
      diffStats.accuracy = Math.round(
        (result.accuracy + diffStats.accuracy * (diffStats.gamesPlayed - 1)) /
          diffStats.gamesPlayed
      );
      diffStats.averageResponseTime = Math.round(
        (result.averageResponseTime + diffStats.averageResponseTime * (diffStats.gamesPlayed - 1)) /
          diffStats.gamesPlayed
      );

      await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving round result:', error);
      throw error;
    }
  }

  // Obtener historial de juegos
  async getGamesHistory(): Promise<RoundResult[]> {
    try {
      const stats = await this.getPlayerStats();
      return stats.gamesHistory;
    } catch (error) {
      console.error('Error getting games history:', error);
      throw error;
    }
  }

  // Obtener mejores puntajes
  async getBestScores(): Promise<{ mode: GameMode; score: number }[]> {
    try {
      const stats = await this.getPlayerStats();
      const bestScores = Object.entries(stats.statisticsByMode).map(
        ([mode, modeStats]) => ({
          mode: mode as GameMode,
          score: modeStats.bestScore,
        })
      );
      return bestScores.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error getting best scores:', error);
      throw error;
    }
  }

  // Limpiar datos (reiniciar)
  async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
      await this.initializePlayerStats();
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }

  // Exportar datos
  async exportData(): Promise<string> {
    try {
      const stats = await this.getPlayerStats();
      return JSON.stringify(stats, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

export default new StorageService();
