// Componente para mostrar pregunta con respuesta directa

import React, { useState, useEffect } from 'react';
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

interface ClassicModeProps {
  operation: MathOperation;
  timeRemaining: number;
  onSubmit: (answer: number) => void;
  onTimeUp: () => void;
  isAnswered: boolean;
}

export const ClassicMode: React.FC<ClassicModeProps> = ({
  operation,
  timeRemaining,
  onSubmit,
  onTimeUp,
  isAnswered,
}) => {
  const [answer, setAnswer] = useState('');
  const inputRef = useAnswerInputFocus(operation, isAnswered);

  useEffect(() => {
    if (timeRemaining <= 0 && !isAnswered) {
      onTimeUp();
    }
  }, [timeRemaining, isAnswered]);

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

  const getTimeColor = () => {
    if (timeRemaining > 5000) return '#4CAF50';
    if (timeRemaining > 2000) return '#FFC107';
    return '#F44336';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.timerContainer}>
        <Text style={[styles.timer, { color: getTimeColor() }]}>
          {(timeRemaining / 1000).toFixed(1)}s
        </Text>
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
        <Text style={styles.buttonText}>Enviar</Text>
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
