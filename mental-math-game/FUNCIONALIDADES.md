# 🎮 Guía de Funcionalidades Implementadas

## Juego de Cálculos Mentales - React Native

---

## 1️⃣ CONFIGURACIÓN DE NIVELES DE DIFICULTAD

### ✅ Fácil
- **Números**: 1 - 10
- **Operadores**: Suma (+), Resta (-)
- **Tiempo límite**: 15 segundos por pregunta
- **Uso**: Calentamiento, principiantes

### ✅ Medio
- **Números**: 5 - 50
- **Operadores**: Suma (+), Resta (-), Multiplicación (*)
- **Tiempo límite**: 10 segundos por pregunta
- **Uso**: Nivel intermedio, práctica

### ✅ Difícil
- **Números**: 10 - 100
- **Operadores**: Suma (+), Resta (-), Multiplicación (*), División (/)
- **Tiempo límite**: 5 segundos por pregunta
- **Uso**: Avanzado, competencia

**Archivo**: `src/utils/gameEngine.ts` - `DIFFICULTY_CONFIG`

---

## 2️⃣ GENERACIÓN ALEATORIA DE OPERACIONES

### ✅ Características
- ✅ Generación bajo demanda (sin precarga)
- ✅ Números uniformemente distribuidos en rango
- ✅ Operadores variados según dificultad
- ✅ Cálculo exacto de respuesta (Math.round para división)
- ✅ IDs únicos para cada operación

### Código
```typescript
function generateRandomOperation(difficulty, id) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const num1 = Math.floor(...); // Random en rango
  const num2 = Math.floor(...); // Random en rango
  const operator = config.operators[...]; // Random del array
  // Calcular resultado exacto
  return { num1, num2, operator, correctAnswer, difficulty, id };
}
```

**Archivo**: `src/utils/gameEngine.ts` - `generateRandomOperation()`

---

## 3️⃣ MODOS DE JUEGO MÚLTIPLES

### 🎯 MODO CLÁSICO

**Cómo funciona**:
1. Se muestra operación: "7 + 5 ="
2. Usuario ingresa número en TextInput
3. Envía con botón **Enviar** o tecla **Enter**
4. El campo recibe **foco automático** en cada pregunta

**Interfaz**:
- TextInput de 5 caracteres máximo
- Botón "Enviar" para confirmar
- `returnKeyType="done"` + `onSubmitEditing` + Enter en web
- Hook `useAnswerInputFocus` para foco al cambiar pregunta
- Contador de tiempo con color dinámico
- Teclado numérico

**Ventajas**:
- Completo análisis de tiempo
- Flexibilidad en entrada
- Feedback claro

**Archivo**: `src/components/ClassicMode.tsx`

---

### ✓✗ MODO VERDADERO/FALSO

**Cómo funciona**:
1. Se muestra operación con resultado: "8 * 3 = 25"
2. Usuario elige "Verdadero" o "Falso"
3. Validación inmediata

**Interfaz**:
- Dos botones grandes: "Verdadero" (verde) y "Falso" (rojo)
- Pregunta clara: "¿Es correcto?"
- Contadores de tiempo

**Ventajas**:
- Muy rápido de responder
- Sem necesidad de mucha escritura
- Bueno para principiantes

**Implementación**:
```typescript
const isCorrect = answer === (operation.correctAnswer !== -1);
// operation.correctAnswer = -1 indica resultado mostrado era falso
```

**Archivo**: `src/components/TrueFalseMode.tsx`

---

### ⭕ MODO OPCIÓN MÚLTIPLE

**Cómo funciona**:
1. Se muestra operación: "9 + 6"
2. El usuario ve 4 opciones de respuesta
3. Selecciona la correcta

**Generación de opciones**:
```typescript
const correctAnswer = 15;
const wrongAnswers = [12, 18, 14]; // Offset de ±10
const shuffled = shuffle([15, 12, 18, 14]);
```

**Interfaz**:
- Pregunta con "= ?" e instrucción "Elige la respuesta correcta"
- **Cuadrícula 2×2** con etiquetas A, B, C, D
- Un toque envía la respuesta; feedback verde/rojo al responder
- Generación robusta de 3 distractores + mezcla aleatoria

**Ventajas**:
- Elimina error de escritura
- Visible en web (sin ScrollView anidado sin altura)

**Archivos**: `MultiChoiceMode.tsx`, `gameEngine.ts` → `generateMultipleChoiceOptions()`

---

### ⏱️ MODO CONTRA RELOJ

**Cómo funciona**:
1. 60 segundos totales para responder múltiples preguntas
2. Cada pregunta tiene su propio timer
3. Se termina cuando falla o se agota tiempo total

**Dos timers simultáneos**:
```typescript
// Timer de pregunta (reset cada pregunta)
questionTimeRemaining: resetsea en cada pregunta

// Timer total (no reset)
totalTimeRemaining: cuenta de 60s a 0
```

**Interfaz**:
- Número de pregunta respondida
- Tiempo restante general
- Tiempo por pregunta
- Botón "Siguiente" después de cada respuesta

**Ventajas**:
- Genera urgencia realista
- Métrica clara de desempeño
- Muy motivante

**Archivo**: `src/components/TimedMode.tsx`

---

## 4️⃣ CANTIDAD DE ITERACIONES POR RONDA

### ✅ Configurable

**Rango**: 1 - 50 preguntas

**Controles**:
- Botones +/- para incrementar/decrementar
- Valor numérico visible
- Uno a uno, no input libre

**Ubicación**: `GameConfigScreen.tsx` - `questionsPerRound`

**Validación**:
```typescript
if (questionsPerRound < 50) setQuestionsPerRound(questionsPerRound + 1);
if (questionsPerRound > 1) setQuestionsPerRound(questionsPerRound - 1);
```

---

## 5️⃣ TIEMPO MÁXIMO POR OPERACIÓN

### ✅ Definido según dificultad

| Dificultad | Tiempo Base |
|-----------|------------|
| Fácil | 15 segundos |
| Medio | 10 segundos |
| Difícil | 5 segundos |

### ✅ Dificultad Dinámica (Opcional)

Cuando está activada, el tiempo **disminuye** con cada pregunta:
```typescript
const decrementPerQuestion = { easy: 500, medium: 800, hard: 1000 }; // ms
const newTime = Math.max(2000, baseTime - i * decrement);
```

**Mínimo garantizado**: 2 segundos

**Ubicación**: `src/utils/gameEngine.ts` - `getTimeLimit()`

---

## 6️⃣ REGISTRO DE RESPUESTAS

### ✅ Datos Registrados por Pregunta

```typescript
{
  operation: MathOperation;        // Operación presentada
  userAnswer: number | boolean;    // Respuesta del usuario
  isCorrect: boolean;              // Validación
  responseTime: number;            // ms desde inicio
  points: number;                  // Puntos otorgados
  startTime: number;               // Timestamp
}
```

### ✅ Validaciones

**Clásico**:
```typescript
isCorrect = userAnswer === operation.correctAnswer;
```

**Verdadero/Falso**:
```typescript
isCorrect = answer === (operation.correctAnswer !== -1);
```

**Opción Múltiple**:
```typescript
isCorrect = selectedValue === operation.correctAnswer
```

**Archivo**: `src/screens/GameScreen.tsx` - `handleAnswer()`

---

## 7️⃣ CÁLCULO DE PUNTAJE

### ✅ Sistema Implementado

```typescript
function calculateScore(isCorrect, responseTime, timeLimit) {
  if (!isCorrect) return -30;        // Incorrecto
  if (responseTime > timeLimit) return -50;  // Sin respuesta
  if (responseTime < timeLimit * 0.75) return 100;  // Rápido
  return 70;                         // Correcto en tiempo
}
```

### ✅ Tabla de Puntos

| Situación | Puntos | Criterio |
|----------|--------|---------|
| Respuesta rápida | +100 | Correcto en <75% del tiempo |
| Respuesta en tiempo | +70 | Correcto dentro del tiempo |
| Respuesta incorrecta | -30 | Resultado erróneo |
| Sin respuesta | -50 | Tiempo agotado |

### ✅ Acumulación
- Suma en tiempo real durante el juego
- Mostrdo en la interfaz
- Guardado al final de la ronda

**Archivo**: `src/utils/gameEngine.ts` - `calculateScore()`

---

## 8️⃣ REGISTRO DE MEJORES PUNTAJES

### ✅ Histórico Completo

**Datos guardados por juego**:
```typescript
{
  id: string;                    // ID único
  gameMode: GameMode;            // Modo utilizado
  difficulty: DifficultyLevel;   // Dificultad
  timestamp: number;             // Momento
  questions: GameQuestion[];     // Todas las preguntas
  totalPoints: number;           // Puntuación final
  correctAnswers: number;        // Respuestas correctas
  totalQuestions: number;        // Total de preguntas
  accuracy: number;              // % Precisión
  averageResponseTime: number;   // ms promedio
  totalTime: number;             // Tiempo total
  gameConfig?: GameConfig;       // Para "Volver a jugar"
}
```

### ✅ Estadísticas Agregadas

**Por modo**:
- Juegos jugados
- Mejor puntuación
- Promedio
- Precisión promedio

**Por dificultad**:
- Mejor puntuación
- Promedio
- Precisión
- Tiempo respuesta promedio

**Global**:
- Total de juegos
- Mejor puntuación general
- Puntos totales

**Archivo**: `src/utils/storageService.ts`

---

## 9️⃣ VISUALIZACIÓN DE ESTADÍSTICAS

### ✅ Pantalla de Resultados

Después de cada juego:
- ✅ Puntuación total, mensaje motivacional, precisión, velocidad, calificación
- ✅ **Detalles de todas las respuestas** con:
  - Enunciado numerado
  - **Tu respuesta** (formato según modo: número o Verdadero/Falso)
  - **Respuesta correcta**
  - Tiempo y puntos
- ✅ Recomendación personalizada
- ✅ Botones (en orden):
  1. **Volver a jugar** → `navigation.replace('Game', { config })` vía `gameConfigFromResult.ts`
  2. **Ver estadísticas**
  3. **Volver al menú principal**

Parámetro `fromGame: true` bloquea gesto atrás al terminar partida; desde historial se permite volver.

**Archivos**: `ResultsScreen.tsx`, `resultFormat.ts`, `gameConfigFromResult.ts`

### ✅ Pantalla de Estadísticas

- ✅ Resumen: juegos jugados, mejor puntuación, puntos totales
- ✅ **Gráficos** (`react-native-svg` + componentes propios):
  - **Torta:** partidas por modo (`PieChart`)
  - **Barras horizontales:** precisión por modo y por dificultad (`HorizontalBarChart`)
  - **Barras verticales:** puntuación media por dificultad; últimas 8 partidas (`BarChart`)
- ✅ Detalle por modo y por dificultad (tarjetas)
- ✅ Reiniciar estadísticas

**Archivos**: `StatisticsScreen.tsx`, `PieChart.tsx`, `BarChart.tsx`, `HorizontalBarChart.tsx`

### ✅ Pantalla de Historial

- ✅ Últimas **30** partidas (más recientes primero)
- ✅ Modo, dificultad, puntos, precisión, fecha
- ✅ Toque → pantalla de resultados completa

**Archivo**: `HistoryScreen.tsx`

---

## 🔟 PERSISTENCIA LOCAL

### ✅ AsyncStorage

**Qué se guarda**:
```javascript
localStorage["player_stats"] = JSON.stringify({
  totalGamesPlayed,
  bestScore,
  totalPoints,
  gamesHistory: Array<RoundResult>,
  statisticsByMode,
  statisticsByDifficulty
});
```

### ✅ Operaciones

```typescript
// Cargar
const stats = await storageService.getPlayerStats();

// Guardar
await storageService.saveRoundResult(result);

// Obtener historial
const history = await storageService.getGamesHistory();

// Reset
await storageService.resetAllData();
```

### ✅ Garantías

- ✅ Sincronización automática
- ✅ Persistencia entre sesiones
- ✅ Sin necesidad de internet
- ✅ Recuperación de errores

**Archivo**: `src/utils/storageService.ts`

---

## 1️⃣1️⃣ REINICIO Y REPETICIÓN

### ✅ Opciones

1. **Durante el juego**: botón atrás bloqueado (`BackHandler` + `gestureEnabled: false`)
2. **Volver a jugar**: botón en resultados; reutiliza `gameConfig` guardado en la ronda
3. **Nueva partida**: menú → Configurar → Iniciar
4. **Reset total**: Estadísticas → "Reiniciar Estadísticas"

### ✅ Confirmaciones
- Alert de confirmación para reset
- Navegación clara entre pantallas
- Botones contextuales

---

## 1️⃣2️⃣ FUNCIONALIDADES OPCIONALES IMPLEMENTADAS

### ✅ 1. Dificultad Dinámica

**Activar**: En ConfigScreen, selecciona checkbox
**Efecto**: Tiempo disminuye con cada pregunta
**Mínimo**: 2 segundos garantizados

```typescript
tiempo = Math.max(2000, baseTime - i * decrementPerQuestion);
```

### ✅ 2. Indicadores Visuales Avanzados

- ✅ Cambio de color del timer según urgencia
- ✅ Barras de progreso implícitas (color)
- ✅ Feedback inmediato de corrección
- ✅ Animaciones suaves de transición

### ✅ 3. Elementos Motivacionales

- ✅ Mensajes de felicitación personalizados
- ✅ Recomendaciones basadas en desempeño
- ✅ Badge de logros (en resultados)
- ✅ Contador progresivo de preguntas

### ✅ 4. Datos Desglosados por Categoría

Todas las selecciones se guardan y reportan:
- Por modo (4 estadísticas diferentes)
- Por dificultad (3 estadísticas diferentes)
- General (3 métricas principales)

---

## 1️⃣3️⃣ PANTALLA POR PANTALLA

### HomeScreen (`src/screens/HomeScreen.tsx`)

```
┌─────────────────────────────┐
│   🧮 Cálculos Mentales      │
│   ¡Mejora tu velocidad!     │
├─────────────────────────────┤
│  ▶ JUGAR (Botón Grande)     │
│  📊 Estadísticas            │
│  📋 Historial (30 últimas)  │
├─────────────────────────────┤
│  Cómo Jugar (infografía)    │
│  Modos de Juego (lista)     │
└─────────────────────────────┘
```

**Funciones**:
- Punto de entrada
- Acceso a todas las pantallas
- Información de ayuda

---

### GameConfigScreen (`src/screens/GameConfigScreen.tsx`)

```
┌─────────────────────────────┐
│   Configurar Juego          │
├─────────────────────────────┤
│  Nivel de Dificultad        │
│  [Fácil] [Medio] [Difícil]  │
├─────────────────────────────┤
│  Modo de Juego              │
│  ✏️ Clásico                 │
│  ✓✗ Verdadero/Falso         │
│  ⭕ Opción Múltiple         │
│  ⏱️ Contra Reloj            │
├─────────────────────────────┤
│  Preguntas: [−] 10 [+]      │
│  ☑ Dificultad Dinámica      │
├─────────────────────────────┤
│  ▶ INICIAR JUEGO            │
└─────────────────────────────┘
```

**Funciones**:
- Seleccionar parámetros
- Validación de valores
- Inicio del juego

---

### GameScreen (`src/screens/GameScreen.tsx`)

**Encabezado**:
- Pregunta X / Total
- Puntos total

**Cuerpo** (varía por modo):
- **Clásico**: Pregunta + Input + Enviar
- **V/F**: Pregunta + Verdadero/Falso
- **Opción Múltiple**: Pregunta + 4 botones
- **Contra Reloj**: 2 timers + Pregunta + Input

**Timer**: Dinámico, color según urgencia

---

### ResultsScreen (`src/screens/ResultsScreen.tsx`)

```
┌─────────────────────────────┐
│   ¡Excelente! 🌟             │
├─────────────────────────────┤
│      [Puntos: 850]          │
├─────────────────────────────┤
│  Modo: Clásico              │
│  Dificultad: Medio          │
│  Precisión: 85% 🟢          │
│  Velocidad: 8500ms          │
│  Desempeño: 8/10            │
├─────────────────────────────┤
│  Detalles (todas las preguntas) │
│  Tu respuesta / Correcta    │
├─────────────────────────────┤
│  Recomendación              │
├─────────────────────────────┤
│  🔄 Volver a Jugar          │
│  📊 Ver Estadísticas        │
│  ← Volver al Menú Principal │
└─────────────────────────────┘
```

---

### StatisticsScreen (`src/screens/StatisticsScreen.tsx`)

```
┌─────────────────────────────┐
│   Mis Estadísticas          │
├─────────────────────────────┤
│ [Juegos] [Mejor] [Puntos]   │
├─────────────────────────────┤
│  GRÁFICOS                   │
│  🥧 Torta: partidas/modo    │
│  📊 Barras: precisión       │
│  📈 Últimas partidas        │
├─────────────────────────────┤
│  Detalle por Modo           │
│  ✏️ Clásico: 10 juegos      │
│     Mejor: 920              │
│     Promedio: 850           │
│     Precisión: 88%          │
│  ... (x4 modos)             │
├─────────────────────────────┤
│  Por Dificultad             │
│  🟢 Fácil: 15 juegos        │
│     Mejor: 950              │
│     Promedio: 880           │
│     Precisión: 92%          │
│     Tiempo: 7200ms          │
│  ... (x3 dificultades)      │
├─────────────────────────────┤
│  🔄 Reiniciar Estadísticas  │
└─────────────────────────────┘
```

---

### HistoryScreen (`src/screens/HistoryScreen.tsx`)

```
┌─────────────────────────────┐
│   Historial de Juegos       │
├─────────────────────────────┤
│  Clásico | Medio | Hoy 5:30 │
│  Puntos: 820 | 85% 🟢       │
│  Correctas: 17/20 | 8.5s    │
│ ───────────────────────────→  │
│  Opción M. | Fácil | Ayer   │
│  Puntos: 950 | 92% 🟢       │
│  Correctas: 23/25 | 5.2s    │
│ ───────────────────────────→  │
│  ... (lista scrollable)     │
└─────────────────────────────┘
```

---

## 1️⃣4️⃣ FLUJO DE USUARIO COMPLETO

```
1. Inicio
   ↓
2. Botón "Jugar"
   ↓
3. Elegir dificultad, modo, cantidad
   ↓
4. Configurar opciones avanzadas (opcional)
   ↓
5. Presionar "Iniciar Juego"
   ↓
6. Responder preguntas
   ├─ Si acierta: +100, +70 ó -30
   ├─ Si falla: -30 ó -50
   └─ Si final: Pantalla resultados
   ↓
7. Ver resultados detallados (todas las respuestas)
   ↓
8. Acciones
   ├─ Volver a jugar (misma config)
   ├─ Ver estadísticas (gráficos)
   └─ Volver al menú principal
   ↓
9. Historial / Estadísticas desde inicio
```

---

## 1️⃣5️⃣ VALIDACIONES Y ERRORES

### ✅ Validaciones Implementadas
- ✅ Núme positivo en entrada
- ✅ Número en rango válido
- ✅ Tiempo agotado = sin respuesta
- ✅ Solo números en clásico
- ✅ Una opción en multichoice
- ✅ Un booleano en V/F

### ✅ Manejo de Errores
- ✅ Try-catch en AsyncStorage
- ✅ Alert para errores críticos
- ✅ Fallbacks con valores por defecto
- ✅ Cleanup de timers en desmonte

---

## 1️⃣6️⃣ OPTIMIZACIONES

### ✅ Performance
- Generación lazy de preguntas
- No precarga toda la ronda
- Limpieza de timers
- Memoización de componentes

### ✅ UX
- Transiciones suaves
- Feedback inmediato
- Navegación clara
- Mensajes contextuales

---

## ✅ RESUMEN DE CUMPLIMIENTO

| Requisito | Estado | Detalles |
|----------|--------|---------|
| Niveles dificultad | ✅ | Easy, Medium, Hard |
| Operaciones aleatorias | ✅ | Generadas dinámicamente |
| 4 modos de juego | ✅ | Classic, V/F, Multi, Timed |
| Cantidad configurable | ✅ | 1-50 preguntas |
| Tiempo personalizado | ✅ | Por dificultad + dinámico |
| Registro respuestas | ✅ | Todas las métricas |
| Cálculo puntuación | ✅ | Sistema balanceado |
| Mejores puntajes | ✅ | Por modo y dificultad |
| Historial | ✅ | Todos los juegos |
| Estadísticas | ✅ | Desglosadas |
| Persistencia local | ✅ | AsyncStorage |
| Reinicio | ✅ | Opción disponible |
| Dificultad dinámica | ✅ | Opcional |
| Animaciones | ✅ | Transiciones suaves |
| Estadísticas avanzadas | ✅ | Gráficos + tablas |
| Soporte Web | ✅ | Scroll, layout, teclado |
| Volver a jugar | ✅ | gameConfig en RoundResult |
| Gráficos | ✅ | Torta, barras H/V |
| Enter / foco input | ✅ | Clásico y Contra Reloj |

---

## 1️⃣7️⃣ SOPORTE WEB

- `ScreenScrollView` + `webLayout.ts` (altura `100vh`, barra de scroll visible)
- Navegación con `@react-navigation/stack` (compatible web; no `native-stack`)
- Enter y foco automático en campos numéricos
- Assets en `assets/` (icon, splash, favicon)

**Archivos**: `webLayout.ts`, `ScreenScrollView.tsx`, `injectWebLayoutStyles()` en `App.tsx`

---

*Documento actualizado: Mayo 2026*
*Versión: 1.1.0*
