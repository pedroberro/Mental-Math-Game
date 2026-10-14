// Pantalla Principal del Juego

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import { webScreenContainer } from '../utils/webLayout';
import { StackScreenProps } from '@react-navigation/stack';
import {
  GameConfig,
  GameQuestion,
  RoundResult,
  MultiChoiceOption,
} from '../types';
import {
  generateQuestionsSet,
  generateMultipleChoiceOptions,
  calculateScore,
  calculateAccuracy,
  calculateAverageResponseTime,
  getTimeLimit,
  getTrueOrFalseProblem,
} from '../utils/gameEngine';
import storageService from '../utils/storageService';
import {
  ClassicMode,
  TrueFalseMode,
  MultiChoiceMode,
  TimedMode,
  ScreenScrollView,
} from '../components';

type RootStackParamList = {
  Game: { config: GameConfig };
  Results: { result: RoundResult } | undefined;
};

type GameScreenProps = StackScreenProps<RootStackParamList, 'Game'>;

export const GameScreen: React.FC<GameScreenProps> = ({ route, navigation }) => {
  const { config } = route.params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timePerQuestion);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(60000); // 60 segundos para modo timed
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout>();
  const totalTimerRef = useRef<NodeJS.Timeout>();
  const questionsRef = useRef<GameQuestion[]>([]);

  // Inicializar preguntas
  useEffect(() => {
    const initQuestions = async () => {
      let generatedQuestions: GameQuestion[] = [];

      if (config.gameMode === 'truefalse') {
        // Para modo verdadero/falso, generar operaciones y alternativas
        const operations = generateQuestionsSet(config.questionsPerRound, config.difficulty);
        generatedQuestions = operations.map((op, idx) => {
          const showAnswer = Math.random() > 0.5; // Mostrar resultado correcto o incorrecto
          const displayAnswer = showAnswer
            ? op.correctAnswer
            : op.correctAnswer + Math.floor(Math.random() * 20) - 10;

          return {
            operation: {
              ...op,
              correctAnswer: showAnswer ? op.correctAnswer : -1, // Marcar como falso
            },
            question: `${op.num1} ${op.operator} ${op.num2} = ${displayAnswer}`,
          };
        });
      } else if (config.gameMode === 'multichoice') {
        // Para opción múltiple, generar opciones
        const operations = generateQuestionsSet(config.questionsPerRound, config.difficulty);
        generatedQuestions = operations.map((op) => ({
          operation: op,
          question: `${op.num1} ${op.operator} ${op.num2} = ?`,
          options: generateMultipleChoiceOptions(op.correctAnswer),
        }));
      } else {
        // Para clásico y timed
        const operations = generateQuestionsSet(config.questionsPerRound, config.difficulty);
        generatedQuestions = operations.map((op) => ({
          operation: op,
          question: `${op.num1} ${op.operator} ${op.num2}`,
        }));
      }

      setQuestions(generatedQuestions);
      questionsRef.current = generatedQuestions;
    };

    initQuestions();
  }, [config]);

  // Timer para tiempo por pregunta
  useEffect(() => {
    const currentTimeLimit = getTimeLimit(
      config.difficulty,
      currentQuestionIndex,
      config.enableDynamicDifficulty
    );

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          if (!isAnswered) {
            handleTimeUp();
          }
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    setTimeRemaining(currentTimeLimit);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, isAnswered]);

  // Timer para modo timed (tiempo total)
  useEffect(() => {
    if (config.gameMode === 'timed' && !isAnswered) {
      totalTimerRef.current = setInterval(() => {
        setTotalTimeRemaining((prev) => {
          if (prev <= 100) {
            finishGame();
            clearInterval(totalTimerRef.current);
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      return () => {
        if (totalTimerRef.current) clearInterval(totalTimerRef.current);
      };
    }
  }, [isAnswered]);

  const handleTimeUp = () => {
    if (!isAnswered) {
      handleAnswer(-50, false, timeRemaining);
    }
  };

  const handleAnswer = (answer: number | boolean, isCorrect: boolean, responseTime: number) => {
    setIsAnswered(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);

    const currentTimeLimit = getTimeLimit(
      config.difficulty,
      currentQuestionIndex,
      config.enableDynamicDifficulty
    );

    const score = calculateScore(isCorrect, currentTimeLimit - responseTime, currentTimeLimit);
    const newPoints = totalPoints + score;

    setTotalPoints(newPoints);

    // Guardar respuesta
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      userAnswer: answer,
      responseTime: currentTimeLimit - responseTime,
      isCorrect,
      points: score,
      startTime: Date.now(),
    };
    setQuestions(updatedQuestions);
    questionsRef.current = updatedQuestions;

    // Mostrar retroalimentación
    setTimeout(() => {
      moveToNextQuestion(updatedQuestions, newPoints);
    }, 1000);
  };

  const handleClassicSubmit = (answer: number) => {
    const isCorrect = answer === questions[currentQuestionIndex].operation.correctAnswer;
    handleAnswer(answer, isCorrect, timeRemaining);
  };

  const handleTrueFalseSubmit = (answer: boolean) => {
    const operation = questions[currentQuestionIndex].operation;
    const isCorrect = answer === (operation.correctAnswer !== -1);
    handleAnswer(answer, isCorrect, timeRemaining);
  };

  const handleMultiChoiceSubmit = (option: MultiChoiceOption) => {
    setSelectedOption(option.id);
    handleAnswer(option.value, option.isCorrect, timeRemaining);
  };

  const moveToNextQuestion = (updatedQuestions: GameQuestion[], newPoints: number) => {
    if (currentQuestionIndex < config.questionsPerRound - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedOption('');
    } else {
      finishGame(updatedQuestions, newPoints);
    }
  };

  const finishGame = async (
    finalQuestions?: GameQuestion[],
    finalPoints?: number
  ) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);

    const questionsToUse = finalQuestions || questionsRef.current;
    const pointsToUse = finalPoints !== undefined ? finalPoints : totalPoints;

    const correctCount = questionsToUse.filter((q) => q.isCorrect).length;
    const responseTimes = questionsToUse
      .filter((q) => q.responseTime !== undefined)
      .map((q) => q.responseTime as number);

    const result: RoundResult = {
      id: `round-${Date.now()}`,
      gameMode: config.gameMode,
      difficulty: config.difficulty,
      timestamp: Date.now(),
      questions: questionsToUse,
      totalPoints: pointsToUse,
      correctAnswers: correctCount,
      totalQuestions: questionsToUse.length,
      accuracy: calculateAccuracy(correctCount, questionsToUse.length),
      averageResponseTime: calculateAverageResponseTime(responseTimes),
      totalTime: 0,
      gameConfig: config,
    };

    try {
      await storageService.saveRoundResult(result);
      navigation.navigate('Results', { result, fromGame: true });
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el resultado');
    }
  };

  // Prevenir ir atrás
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparando el juego...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={[styles.container, webScreenContainer]}>
      <View style={styles.headerBar}>
        <Text style={styles.questionNumber}>
          Pregunta {currentQuestionIndex + 1}/{config.questionsPerRound}
        </Text>
        <Text style={styles.pointsDisplay}>Puntos: {totalPoints}</Text>
      </View>

      <ScreenScrollView embedded keyboardShouldPersistTaps="handled">
        {config.gameMode === 'classic' && (
          <ClassicMode
            key={currentQuestionIndex}
            operation={currentQuestion.operation}
            timeRemaining={timeRemaining}
            onSubmit={handleClassicSubmit}
            onTimeUp={handleTimeUp}
            isAnswered={isAnswered}
          />
        )}

        {config.gameMode === 'truefalse' && (
          <TrueFalseMode
            key={currentQuestionIndex}
            operation={currentQuestion.operation}
            showAnswer={true}
            timeRemaining={timeRemaining}
            onSubmit={handleTrueFalseSubmit}
            onTimeUp={handleTimeUp}
            isAnswered={isAnswered}
          />
        )}

        {config.gameMode === 'multichoice' &&
          currentQuestion.options &&
          currentQuestion.options.length === 4 && (
          <MultiChoiceMode
            key={currentQuestionIndex}
            operation={currentQuestion.operation}
            options={currentQuestion.options}
            timeRemaining={timeRemaining}
            onSubmit={handleMultiChoiceSubmit}
            onTimeUp={handleTimeUp}
            isAnswered={isAnswered}
            selectedOptionId={selectedOption}
          />
        )}

        {config.gameMode === 'timed' && (
          <TimedMode
            key={currentQuestionIndex}
            operation={currentQuestion.operation}
            totalTimeRemaining={totalTimeRemaining}
            questionTimeRemaining={timeRemaining}
            questionsAnswered={currentQuestionIndex}
            onSubmit={handleClassicSubmit}
            onTimeUp={handleTimeUp}
            isAnswered={isAnswered}
          />
        )}
      </ScreenScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  pointsDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});
