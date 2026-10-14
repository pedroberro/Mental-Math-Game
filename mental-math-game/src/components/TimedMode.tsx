// Componente para modo Contra Reloj

import React, { useEffect } from 'react';
import { useAnswerInputFocus } from '../hooks/useAnswerInputFocus';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { MathOperation } from '../types';
import { formatMathOperation } from '../utils/gameEngine';

interface TimedModeProps {
  operation: MathOperation;
  totalTimeRemaining: number;
  questionTimeRemaining: number;
  questionsAnswered: number;
  onSubmit: (answer: number) => void;
  onTimeUp: () => void;
  isAnswered: boolean;
}

export const TimedMode: React.FC<TimedModeProps> = ({
  operation,
  totalTimeRemaining,
  questionTimeRemaining,
  questionsAnswered,
  onSubmit,
  onTimeUp,
  isAnswered,
}) => {
  const [answer, setAnswer] = React.useState('');
  const inputRef = useAnswerInputFocus(operation, isAnswered);

  useEffect(() => {
    if (questionTimeRemaining <= 0 && !isAnswered) {
      onTimeUp();
    }
  }, [questionTimeRemaining, isAnswered]);

  useEffect(() => {
    if (totalTimeRemaining <= 0) {
      onTimeUp();
    }
  }, [totalTimeRemaining]);

  const handleSubmit = () => {
    if (isAnswered || !answer.trim()) {
      return;
    }
    onSubmit(parseInt(answer, 10));
    setAnswer('');
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSubmit();
    }
  };

  const getTotalTimeColor = () => {
    const percentage = (totalTimeRemaining / 60000) * 100; // 60s total
    if (percentage > 50) return '#4CAF50';
    if (percentage > 25) return '#FFC107';
    return '#F44336';
  };

  const getQuestionTimeColor = () => {
    if (questionTimeRemaining > 5000) return '#4CAF50';
    if (questionTimeRemaining > 2000) return '#FFC107';
    return '#F44336';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.statsLabel}>Total</Text>
          <Text style={[styles.totalTimer, { color: getTotalTimeColor() }]}>
            {(totalTimeRemaining / 1000).toFixed(1)}s
          </Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsLabel}>Pregunta #{questionsAnswered + 1}</Text>
          <Text style={[styles.questionTimer, { color: getQuestionTimeColor() }]}>
            {(questionTimeRemaining / 1000).toFixed(1)}s
          </Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{formatMathOperation(operation)}</Text>
        <Text style={styles.equalsText}>=</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Ingresa tu respuesta"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={answer}
          onChangeText={setAnswer}
          editable={!isAnswered}
          maxLength={5}
          autoFocus
          returnKeyType="done"
          blurOnSubmit={false}
          onSubmitEditing={handleSubmit}
          onKeyPress={handleKeyPress}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isAnswered && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isAnswered}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    gap: 15,
  },
  statsBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  totalTimer: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  questionTimer: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  equalsText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#666',
    marginTop: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
