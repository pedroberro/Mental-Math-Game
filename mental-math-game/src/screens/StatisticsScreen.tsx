// Pantalla de Estadísticas

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, HorizontalBarChart, PieChart, ScreenScrollView } from '../components';
import {
  PlayerStats,
  ModeStats,
  DifficultyStats,
  GameMode,
  DifficultyLevel,
} from '../types';
import storageService from '../utils/storageService';

const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Clásico',
  truefalse: 'V/F',
  multichoice: 'Múltiple',
  timed: 'Reloj',
};

const MODE_COLORS: Record<GameMode, string> = {
  classic: '#2196F3',
  truefalse: '#4CAF50',
  multichoice: '#9C27B0',
  timed: '#FF9800',
};

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: '#4CAF50',
  medium: '#FFC107',
  hard: '#F44336',
};

export const StatisticsScreen: React.FC = ({ navigation }: any) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      setLoading(true);
      const playerStats = await storageService.getPlayerStats();
      setStats(playerStats);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres reiniciar todas las estadísticas?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: async () => {
            try {
              await storageService.resetAllData();
              loadStats();
              Alert.alert('Éxito', 'Las estadísticas han sido reiniciadas');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron reiniciar las estadísticas');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#4CAF50';
    if (accuracy >= 60) return '#FFC107';
    return '#F44336';
  };

  const modeEntries = Object.entries(stats.statisticsByMode) as Array<
    [GameMode, ModeStats]
  >;
  const difficultyEntries = Object.entries(stats.statisticsByDifficulty) as Array<
    [DifficultyLevel, DifficultyStats]
  >;

  const gamesByModeData = modeEntries
    .filter(([, modeStats]) => modeStats.gamesPlayed > 0)
    .map(([mode, modeStats]) => ({
      label: MODE_LABELS[mode],
      value: modeStats.gamesPlayed,
      color: MODE_COLORS[mode],
    }));

  const accuracyByModeData = modeEntries
    .filter(([, modeStats]) => modeStats.gamesPlayed > 0)
    .map(([mode, modeStats]) => ({
      label: MODE_LABELS[mode],
      value: modeStats.accuracy,
      color: MODE_COLORS[mode],
    }));

  const accuracyByDifficultyData = difficultyEntries
    .filter(([, diffStats]) => diffStats.gamesPlayed > 0)
    .map(([difficulty, diffStats]) => ({
      label: DIFFICULTY_LABELS[difficulty],
      value: diffStats.accuracy,
      color: DIFFICULTY_COLORS[difficulty],
    }));

  const averageScoreByDifficultyData = difficultyEntries
    .filter(([, diffStats]) => diffStats.gamesPlayed > 0)
    .map(([difficulty, diffStats]) => ({
      label: DIFFICULTY_LABELS[difficulty],
      value: diffStats.averageScore,
      color: DIFFICULTY_COLORS[difficulty],
    }));

  const recentScoresData = stats.gamesHistory
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-8)
    .map((game, index) => ({
      label: `P${index + 1}`,
      value: game.totalPoints,
      color: game.accuracy >= 75 ? '#4CAF50' : game.accuracy >= 50 ? '#FFC107' : '#F44336',
    }));

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Estadísticas</Text>
      </View>

      {/* Resumen General */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Juegos Jugados</Text>
          <Text style={styles.summaryValue}>{stats.totalGamesPlayed}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Mejor Puntuación</Text>
          <Text style={styles.summaryValue}>{stats.bestScore}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Puntos Totales</Text>
          <Text style={styles.summaryValue}>{stats.totalPoints}</Text>
        </View>
      </View>

      {stats.totalGamesPlayed > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gráficos</Text>

          {gamesByModeData.length > 0 && (
            <PieChart title="Partidas jugadas por modo" data={gamesByModeData} />
          )}

          {accuracyByModeData.length > 0 && (
            <HorizontalBarChart
              title="Precisión por modo (%)"
              data={accuracyByModeData}
              valueSuffix="%"
              maxValue={100}
            />
          )}

          {accuracyByDifficultyData.length > 0 && (
            <HorizontalBarChart
              title="Precisión por dificultad (%)"
              data={accuracyByDifficultyData}
              valueSuffix="%"
              maxValue={100}
            />
          )}

          {averageScoreByDifficultyData.length > 0 && (
            <BarChart
              title="Puntuación media por dificultad"
              data={averageScoreByDifficultyData}
              height={140}
            />
          )}

          {recentScoresData.length > 0 && (
            <BarChart
              title="Puntuación de las últimas partidas"
              data={recentScoresData}
              height={150}
            />
          )}
        </View>
      )}

      {/* Estadísticas por Modo de Juego */}
      {stats.totalGamesPlayed > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle por Modo</Text>

          {(Object.entries(stats.statisticsByMode) as Array<[keyof typeof stats.statisticsByMode, ModeStats]>).map(
            ([mode, modeStats]) =>
              modeStats.gamesPlayed > 0 && (
                <View key={mode} style={styles.modeStatCard}>
                  <View style={styles.modeHeader}>
                    <Text style={styles.modeName}>{MODE_LABELS[mode]}</Text>
                    <Text style={styles.modeGames}>
                      {modeStats.gamesPlayed} juego{modeStats.gamesPlayed > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.modeStatsGrid}>
                    <View style={styles.modeStat}>
                      <Text style={styles.modeStatLabel}>Mejor</Text>
                      <Text style={styles.modeStatValue}>{modeStats.bestScore}</Text>
                    </View>
                    <View style={styles.modeStat}>
                      <Text style={styles.modeStatLabel}>Promedio</Text>
                      <Text style={styles.modeStatValue}>{modeStats.averageScore}</Text>
                    </View>
                    <View style={styles.modeStat}>
                      <Text style={styles.modeStatLabel}>Precisión</Text>
                      <Text
                        style={[
                          styles.modeStatValue,
                          { color: getAccuracyColor(modeStats.accuracy) },
                        ]}
                      >
                        {modeStats.accuracy}%
                      </Text>
                    </View>
                  </View>
                </View>
              )
          )}
        </View>
      )}

      {/* Estadísticas por Dificultad */}
      {stats.totalGamesPlayed > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle por Dificultad</Text>

          {(Object.entries(stats.statisticsByDifficulty) as Array<[keyof typeof stats.statisticsByDifficulty, DifficultyStats]>).map(
            ([difficulty, diffStats]) =>
              diffStats.gamesPlayed > 0 && (
                <View key={difficulty} style={styles.difficultyStatCard}>
                  <View style={styles.difficultyHeader}>
                    <Text style={styles.difficultyName}>
                      {DIFFICULTY_LABELS[difficulty]}
                    </Text>
                    <Text style={styles.difficultyGames}>
                      {diffStats.gamesPlayed} juego{diffStats.gamesPlayed > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.difficultyContent}>
                    <View style={styles.difficultyStatRow}>
                      <Text style={styles.difficultyStatLabel}>Mejor puntuación:</Text>
                      <Text style={styles.difficultyStatValue}>{diffStats.bestScore}</Text>
                    </View>
                    <View style={styles.difficultyStatRow}>
                      <Text style={styles.difficultyStatLabel}>Puntuación promedio:</Text>
                      <Text style={styles.difficultyStatValue}>{diffStats.averageScore}</Text>
                    </View>
                    <View style={styles.difficultyStatRow}>
                      <Text style={styles.difficultyStatLabel}>Precisión:</Text>
                      <Text
                        style={[
                          styles.difficultyStatValue,
                          { color: getAccuracyColor(diffStats.accuracy) },
                        ]}
                      >
                        {diffStats.accuracy}%
                      </Text>
                    </View>
                    <View style={styles.difficultyStatRow}>
                      <Text style={styles.difficultyStatLabel}>Tiempo de respuesta:</Text>
                      <Text style={styles.difficultyStatValue}>
                        {diffStats.averageResponseTime}ms
                      </Text>
                    </View>
                  </View>
                </View>
              )
          )}
        </View>
      )}

      {/* Mensaje si no hay juegos */}
      {stats.totalGamesPlayed === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no has jugado.</Text>
          <Text style={styles.emptySubtext}>
            ¡Juega tu primer juego para ver tus estadísticas aquí!
          </Text>
        </View>
      )}

      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          disabled={stats.totalGamesPlayed === 0}
        >
          <Text style={styles.resetButtonText}>🔄 Reiniciar Estadísticas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacing} />
    </ScreenScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  modeStatCard: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modeGames: {
    fontSize: 12,
    color: '#999',
  },
  modeStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeStat: {
    alignItems: 'center',
  },
  modeStatLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  modeStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  difficultyStatCard: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  difficultyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  difficultyGames: {
    fontSize: 12,
    color: '#999',
  },
  difficultyContent: {
    gap: 8,
  },
  difficultyStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  difficultyStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacing: {
    height: 20,
  },
});
