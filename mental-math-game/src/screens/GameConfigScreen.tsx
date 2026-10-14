// Pantalla de Configuración del Juego

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScreenScrollView } from '../components';
import { GameConfig, DifficultyLevel, GameMode } from '../types';

type RootStackParamList = {
  GameConfig: undefined;
  Game: { config: GameConfig } | undefined;
};

type GameConfigScreenProps = StackScreenProps<RootStackParamList, 'GameConfig'>;

const DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];
const GAME_MODES: GameMode[] = ['classic', 'truefalse', 'multichoice', 'timed'];

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

const MODE_DESCRIPTIONS = {
  classic: 'Ingresa el resultado de la operación',
  truefalse: 'Indica si el resultado mostrado es correcto',
  multichoice: 'Selecciona el resultado entre 4 opciones',
  timed: 'Responde operaciones continuas hasta fallar',
};

export const GameConfigScreen: React.FC<GameConfigScreenProps> = ({ navigation }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [questionsPerRound, setQuestionsPerRound] = useState(10);
  const [enableDynamicDifficulty, setEnableDynamicDifficulty] = useState(false);

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'hard':
        return '#F44336';
    }
  };

  const getModeIcon = (mode: GameMode) => {
    switch (mode) {
      case 'classic':
        return '✏️';
      case 'truefalse':
        return '✓✗';
      case 'multichoice':
        return '⭕';
      case 'timed':
        return '⏱️';
    }
  };

  const handleStartGame = () => {
    const config: GameConfig = {
      difficulty: selectedDifficulty,
      gameMode: selectedMode,
      questionsPerRound,
      timePerQuestion: selectedDifficulty === 'easy' ? 15000 : selectedDifficulty === 'medium' ? 10000 : 5000,
      enableDynamicDifficulty,
    };

    navigation.navigate('Game', { config });
  };

  const incrementQuestions = () => {
    if (questionsPerRound < 50) {
      setQuestionsPerRound(questionsPerRound + 1);
    }
  };

  const decrementQuestions = () => {
    if (questionsPerRound > 1) {
      setQuestionsPerRound(questionsPerRound - 1);
    }
  };

  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Configurar Juego</Text>

      {/* Nivel de Dificultad */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nivel de Dificultad</Text>
        <View style={styles.optionsGrid}>
          {DIFFICULTIES.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.difficultyButton,
                selectedDifficulty === difficulty && styles.buttonSelected,
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  selectedDifficulty === difficulty && styles.difficultyButtonTextSelected,
                ]}
              >
                {DIFFICULTY_LABELS[difficulty]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modo de Juego */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modo de Juego</Text>
        {GAME_MODES.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeButton,
              selectedMode === mode && styles.modeButtonSelected,
            ]}
            onPress={() => setSelectedMode(mode)}
          >
            <View style={styles.modeButtonContent}>
              <Text style={styles.modeIcon}>{getModeIcon(mode)}</Text>
              <View style={styles.modeTextContainer}>
                <Text style={styles.modeName}>{MODE_LABELS[mode]}</Text>
                <Text style={styles.modeDescription}>{MODE_DESCRIPTIONS[mode]}</Text>
              </View>
              {selectedMode === mode && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cantidad de Preguntas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas por Ronda</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={decrementQuestions}
          >
            <Text style={styles.counterButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{questionsPerRound}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={incrementQuestions}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmación de Opción Avanzada */}
      {selectedMode !== 'timed' && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setEnableDynamicDifficulty(!enableDynamicDifficulty)}
          >
            <View
              style={[
                styles.checkbox,
                enableDynamicDifficulty && styles.checkboxSelected,
              ]}
            >
              {enableDynamicDifficulty && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Dificultad Dinámica (reduce tiempo por pregunta)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón Iniciar Juego */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartGame}
      >
        <Text style={styles.startButtonText}>▶ Iniciar Juego</Text>
      </TouchableOpacity>

      <View style={styles.spacing} />
    </ScreenScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  buttonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  difficultyButtonTextSelected: {
    color: '#2196F3',
    fontWeight: '700',
  },
  modeButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  modeButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  modeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  modeDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  checkmark: {
    fontSize: 22,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    minWidth: 50,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#2196F3',
  },
  checkboxCheck: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  spacing: {
    height: 20,
  },
});
