// Componente raíz de la aplicación

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { injectWebLayoutStyles } from './utils/webLayout';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  GameConfigScreen,
  GameScreen,
  ResultsScreen,
  StatisticsScreen,
  HistoryScreen,
} from './screens';
import { GameConfig, RoundResult } from './types';

export type RootStackParamList = {
  Home: undefined;
  GameConfig: undefined;
  Game: { config: GameConfig };
  Results: { result: RoundResult; fromGame?: boolean };
  Statistics: undefined;
  History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    injectWebLayoutStyles();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: '#2196F3',
          cardStyle: { flex: 1 },
          contentStyle: { flex: 1, backgroundColor: '#fff' },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 16,
          },
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 2,
            shadowColor: 'transparent',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GameConfig"
          component={GameConfigScreen}
          options={{
            title: 'Configurar Juego',
          }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            title: 'En Juego',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: 'Resultados',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            title: 'Estadísticas',
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'Historial',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
