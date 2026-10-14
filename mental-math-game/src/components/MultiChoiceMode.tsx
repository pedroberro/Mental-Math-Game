// Componente para modo Opción Múltiple

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MathOperation, MultiChoiceOption } from '../types';
import { formatMathOperation } from '../utils/gameEngine';

interface MultiChoiceModeProps {
  operation: MathOperation;
  options: MultiChoiceOption[];
  timeRemaining: number;
  onSubmit: (option: MultiChoiceOption) => void;
  onTimeUp: () => void;
  isAnswered: boolean;
  selectedOptionId?: string;
}

export const MultiChoiceMode: React.FC<MultiChoiceModeProps> = ({
  operation,
  options,
  timeRemaining,
  onSubmit,
  onTimeUp,
  isAnswered,
  selectedOptionId,
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

  const getOptionStyles = (option: MultiChoiceOption) => {
    const base = [styles.optionButton];

    if (!isAnswered) {
      if (selectedOptionId === option.id) {
        base.push(styles.optionSelected);
      }
      return base;
    }

    if (option.isCorrect) {
      base.push(styles.optionCorrect);
    } else if (selectedOptionId === option.id) {
      base.push(styles.optionIncorrect);
    } else {
      base.push(styles.optionMuted);
    }

    return base;
  };

  const getOptionTextStyle = (option: MultiChoiceOption) => {
    if (!isAnswered) {
      return styles.optionNumber;
    }
    if (option.isCorrect || selectedOptionId === option.id) {
      return styles.optionNumberHighlighted;
    }
    return styles.optionNumberMuted;
  };

  const handleOptionPress = (option: MultiChoiceOption) => {
    if (!isAnswered) {
      onSubmit(option);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={[styles.timer, { color: getTimeColor() }]}>
          {(timeRemaining / 1000).toFixed(1)}s
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{formatMathOperation(operation)}</Text>
        <Text style={styles.equalsText}>= ?</Text>
        <Text style={styles.instructionText}>Elige la respuesta correcta</Text>
      </View>

      <View style={styles.optionsGrid}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCell, getOptionStyles(option)]}
            onPress={() => handleOptionPress(option)}
            disabled={isAnswered}
            activeOpacity={0.7}
          >
            <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}</Text>
            <Text style={getOptionTextStyle(option)}>{option.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    width: '100%',
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
    marginBottom: 28,
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
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionCell: {
    width: '48%',
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  optionButton: {},
  optionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  optionCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionIncorrect: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionMuted: {
    opacity: 0.55,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
  },
  optionNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
  },
  optionNumberHighlighted: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  optionNumberMuted: {
    fontSize: 32,
    fontWeight: '700',
    color: '#999',
  },
});
