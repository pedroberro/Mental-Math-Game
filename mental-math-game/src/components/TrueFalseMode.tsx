// Componente para modo Verdadero/Falso

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MathOperation } from '../types';
import { formatMathOperation } from '../utils/gameEngine';

interface TrueFalseModeProps {
  operation: MathOperation;
  showAnswer: boolean;
  timeRemaining: number;
  onSubmit: (answer: boolean) => void;
  onTimeUp: () => void;
  isAnswered: boolean;
}

export const TrueFalseMode: React.FC<TrueFalseModeProps> = ({
  operation,
  showAnswer,
  timeRemaining,
  onSubmit,
  onTimeUp,
  isAnswered,
}) => {
  useEffect(() => {
    if (timeRemaining <= 0 && !isAnswered) {
      onTimeUp();
    }
  }, [timeRemaining, isAnswered]);

  const getTimeColor = () => {
    if (timeRemaining > 5000) return '#4CAF50';
    if (timeRemaining > 2000) return '#FFC107';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={[styles.timer, { color: getTimeColor() }]}>
          {(timeRemaining / 1000).toFixed(1)}s
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.label}>¿Es correcto?</Text>
        <Text style={styles.questionText}>
          {formatMathOperation(operation)} = {showAnswer ? operation.correctAnswer : '?'}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonTrue, isAnswered && styles.buttonDisabled]}
          onPress={() => onSubmit(true)}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>Verdadero</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonFalse, isAnswered && styles.buttonDisabled]}
          onPress={() => onSubmit(false)}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>Falso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  timerContainer: {
    marginBottom: 40,
    padding: 15,
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
    borderRadius: 50,
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    color: '#666',
    marginBottom: 15,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonTrue: {
    backgroundColor: '#4CAF50',
  },
  buttonFalse: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
