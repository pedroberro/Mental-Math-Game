// Pantalla de Inicio

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScreenScrollView } from '../components';

type RootStackParamList = {
  Home: undefined;
  GameConfig: undefined;
  Game: undefined;
  Results: undefined;
  Statistics: undefined;
  History: undefined;
};

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScreenScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>🧮 Cálculos Mentales</Text>
        <Text style={styles.subtitle}>¡Mejora tu velocidad mental!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigation.navigate('GameConfig')}
        >
          <Text style={styles.mainButtonText}>▶ Jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.buttonText}>📊 Estadísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>📋 Historial</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Cómo Jugar</Text>
        <Text style={styles.infoText}>
          • Elige un nivel de dificultad y modo de juego{'\n'}
          • Resuelve operaciones matemáticas bajo presión de tiempo{'\n'}
          • Obtén puntos por rapidez y precisión{'\n'}
          • Compite con tus propios récords
        </Text>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Modos de Juego</Text>
        <Text style={styles.tipsText}>
          <Text style={styles.bold}>Clásico:</Text> Ingresa el resultado directamente{'\n'}
          <Text style={styles.bold}>Verdadero/Falso:</Text> Indica si el resultado es correcto{'\n'}
          <Text style={styles.bold}>Múltiple Choice:</Text> Selecciona entre 4 opciones{'\n'}
          <Text style={styles.bold}>Contra Reloj:</Text> ¡Responde hasta que falles!
        </Text>
      </View>
    </ScreenScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 40,
  },
  mainButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  tipsContainer: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#6A1B9A',
  },
});
