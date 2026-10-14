// Pantalla de Historial de Resultados

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenScrollView } from '../components';
import { RoundResult } from '../types';
import storageService from '../utils/storageService';

const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

const MODE_LABELS = {
  classic: 'Clásico',
  truefalse: 'Verdadero/Falso',
  multichoice: 'Opción Múltiple',
  timed: 'Contra Reloj',
};

export const HistoryScreen: React.FC = ({ navigation }: any) => {
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const games = await storageService.getGamesHistory();
      const recentGames = games
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 30);
      setHistory(recentGames);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#4CAF50';
    if (accuracy >= 60) return '#FFC107';
    return '#F44336';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoy a las ${date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ayer a las ${date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  const handleGamePress = (game: RoundResult) => {
    navigation.navigate('Results', { result: game });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial de Juegos</Text>
        <Text style={styles.headerSubtitle}>Últimas {history.length} partidas</Text>
      </View>

      {history.length > 0 ? (
        <View>
          {history.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => handleGamePress(game)}
              activeOpacity={0.7}
            >
              <View style={styles.gameCardContent}>
                <View style={styles.gameCardLeft}>
                  <Text style={styles.gameMode}>
                    {MODE_LABELS[game.gameMode as keyof typeof MODE_LABELS]}
                  </Text>
                  <Text style={styles.gameDifficulty}>
                    {DIFFICULTY_LABELS[game.difficulty as keyof typeof DIFFICULTY_LABELS]} •{' '}
                    {game.totalQuestions} preguntas
                  </Text>
                  <Text style={styles.gameDate}>{formatDate(game.timestamp)}</Text>
                </View>

                <View style={styles.gameCardRight}>
                  <Text style={styles.gameScore}>{game.totalPoints}</Text>
                  <View
                    style={[
                      styles.accuracyBadge,
                      { backgroundColor: getAccuracyColor(game.accuracy) },
                    ]}
                  >
                    <Text style={styles.accuracyText}>{game.accuracy}%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.gameCardStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Correctas</Text>
                  <Text style={styles.statValue}>
                    {game.correctAnswers}/{game.totalQuestions}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Tiempo</Text>
                  <Text style={styles.statValue}>{game.averageResponseTime}ms</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Fecha</Text>
                  <Text style={styles.statValue}>
                    {new Date(game.timestamp).toLocaleDateString('es-ES')}
                  </Text>
                </View>
              </View>

              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay juegos en el historial</Text>
          <Text style={styles.emptySubtext}>
            Juega tu primer juego para ver el historial aquí
          </Text>
        </View>
      )}

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
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
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
  gameCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    position: 'relative',
  },
  gameCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameCardLeft: {
    flex: 1,
  },
  gameMode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  gameDifficulty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  gameDate: {
    fontSize: 11,
    color: '#999',
  },
  gameCardRight: {
    alignItems: 'center',
    gap: 8,
  },
  gameScore: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
  },
  accuracyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accuracyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  gameCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  arrowContainer: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
  spacing: {
    height: 20,
  },
});
