import { useEffect, useRef } from 'react';
import { Platform, TextInput } from 'react-native';
import { MathOperation } from '../types';

export function useAnswerInputFocus(
  operation: MathOperation,
  isAnswered: boolean
) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isAnswered) {
      return;
    }

    const delay = Platform.OS === 'web' ? 120 : 0;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, delay);

    return () => clearTimeout(timer);
  }, [
    isAnswered,
    operation.num1,
    operation.num2,
    operation.operator,
    operation.correctAnswer,
  ]);

  return inputRef;
}
