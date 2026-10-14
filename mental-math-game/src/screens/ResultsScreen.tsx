// Pantalla de Resultados

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScreenScrollView } from '../components';
import { GameConfig, RoundResult } from '../types';
import { formatUserAnswer, formatCorrectAnswer } from '../utils/resultFormat';
import { buildGameConfigFromResult } from '../utils/gameConfigFromResult';

type RootStackParamList = {
  Results: { result: RoundResult; fromGame?: boolean };
  Home: undefined;
  Statistics: undefined;
  Game: { config: GameConfig };
};

type ResultsScreenProps = StackScreenProps<RootStackParamList, 'Results'>;

const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

const MODE_LABELS = {
  classic: 'Modo Clásico',
  truefalse: 'Verdadero/Falso',
  multichoice: 'Opción Múltiple',
  timed: 'Contra Reloj',
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ route, navigation }) => {
  const { result, fromGame = false } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: fromGame ? () => null : undefined,
      gestureEnabled: !fromGame,
    });
  }, [navigation, fromGame]);

  const handlePlayAgain = () => {
    const config = buildGameConfigFromResult(result);
    navigation.replace('Game', { config });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#4CAF50';
    if (accuracy >= 60) return '#FFC107';
    return '#F44336';
  };

  const getPerformanceMessage = () => {
    if (result.accuracy >= 90) return '¡Excelente! 🌟';
    if (result.accuracy >= 75) return '¡Muy bien! 👏';
    if (result.accuracy >= 60) return 'Buen intento 👍';
    return 'Sigue practicando 💪';
  };

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{getPerformanceMessage()}</Text>
      </View>

      {/* Puntuación Principal */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Puntuación Total</Text>
        <Text style={styles.scoreValue}>{result.totalPoints}</Text>
      </View>

      {/* Información de Juego */}
      <View style={styles.gameInfoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Modo de Juego:</Text>
          <Text style={styles.infoValue}>{MODE_LABELS[result.gameMode]}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dificultad:</Text>
          <Text style={styles.infoValue}>{DIFFICULTY_LABELS[result.difficulty]}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha:</Text>
          <Text style={styles.infoValue}>
            {new Date(result.timestamp).toLocaleDateString('es-ES')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hora:</Text>
          <Text style={styles.infoValue}>
            {new Date(result.timestamp).toLocaleTimeString('es-ES')}
          </Text>
        </View>
      </View>

      {/* Estadísticas Principales */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.statLabel}>Precisión</Text>
          <Text style={[styles.statValue, { color: getAccuracyColor(result.accuracy) }]}>
            {result.accuracy}%
          </Text>
          <Text style={styles.statSubtext}>
            {result.correctAnswers}/{result.totalQuestions} correctas
          </Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.statLabel}>Velocidad</Text>
          <Text style={styles.statValue}>{result.averageResponseTime}ms</Text>
          <Text style={styles.statSubtext}>Tiempo promedio</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#F3E5F5' }]}>
          <Text style={styles.statLabel}>Desempeño</Text>
          <Text style={styles.statValue}>
            {Math.round(result.accuracy / 10)}/10
          </Text>
          <Text style={styles.statSubtext}>Calificación</Text>
        </View>
      </View>

      {/* Detalles de Respuestas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles de Respuestas</Text>
        {result.questions.map((question, index) => (
          <View
            key={index}
            style={[
              styles.answerDetail,
              question.isCorrect
                ? styles.answerDetailCorrect
                : styles.answerDetailIncorrect,
            ]}
          >
            <View style={styles.answerIcon}>
              <Text style={styles.answerIconText}>
                {question.isCorrect ? '✓' : '✗'}
              </Text>
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerQuestion}>
                {index + 1}. {question.question}
              </Text>
              <Text style={styles.answerResponse}>
                Tu respuesta: {formatUserAnswer(question, result.gameMode)}
              </Text>
              <Text style={styles.answerResponse}>
                Correcta: {formatCorrectAnswer(question, result.gameMode)}
              </Text>
              <Text style={styles.answerTime}>
                {question.responseTime !== undefined
                  ? `${question.responseTime}ms`
                  : '—'}{' '}
                {question.points !== undefined
                  ? `(${question.points > 0 ? '+' : ''}${question.points} pts)`
                  : ''}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recomendaciones */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>Recomendación</Text>
        <Text style={styles.recommendationText}>
          {result.accuracy >= 90
            ? 'Intenta con un nivel más difícil para seguir mejorando.'
            : result.accuracy >= 75
            ? 'Vas bien, sigue practicando para aumentar tu precisión.'
            : result.accuracy >= 60
            ? 'Practica más en este nivel antes de subir de dificultad.'
            : 'Intenta con un nivel más fácil y mejora tu precisión.'}
        </Text>
      </View>

      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
          <Text style={styles.playAgainButtonText}>🔄 Volver a Jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.secondaryButtonText}>📊 Ver Estadísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.primaryButtonText}>← Volver al Menú Principal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacing} />
    </ScreenScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scoreCard: {
    backgroundColor: '#2196F3',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 54,
    fontWeight: '700',
    color: '#fff',
  },
  gameInfoCard: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  statBox: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  answerDetail: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  answerDetailCorrect: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  answerDetailIncorrect: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  answerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerIconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  answerContent: {
    flex: 1,
  },
  answerQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  answerResponse: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  answerTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  recommendationBox: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    marginBottom: 25,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  spacing: {
    height: 20,
  },
});
