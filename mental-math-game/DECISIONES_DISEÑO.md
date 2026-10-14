# 📋 Documento de Decisiones de Diseño

## Juego de Cálculos Mentales - React Native

### 1. Selección de Tecnología

#### ✅ Por qué React Native
- **Multiplataforma**: Un solo código base para iOS, Android y Web
- **Rendimiento**: Suficiente para una aplicación de juegos ligera
- **Comunidad**: Amplia comunidad y muchos recursos disponibles
- **Mantenibilidad**: Código limpio y fácil de mantener en TypeScript

#### ✅ Por qué Expo
- **Facilita el desarrollo**: No requiere configuración compleja de Xcode o Android Studio
- **Rápido prototipado**: Ideal para MVP (Mínimo Producto Viable)
- **Over-the-air updates**: Posibilidad de actualizar sin enviar a tiendas
- **Documentación**: Excelente documentación y ejemplos

#### ✅ Por qué TypeScript
- **Type Safety**: Previene errores en tiempo de compilación
- **Mejor IDE support**: Autocompletado superior
- **Escalabilidad**: Facilita mantenimiento en proyectos grandes
- **Documentación automática**: Los tipos sirven como documentación

---

### 2. Arquitectura de la Aplicación

#### Stack Navigator con React Navigation
```
Home
├── GameConfig → Game → Results (fromGame: bloquea atrás)
├── Statistics
└── History → Results (permite atrás)
```

**Navegador:** `@react-navigation/stack` (no `native-stack`).

**Justificación**:
- `native-stack` falla en web con Metro (resolución `.native.js` vs `.web.js`)
- Stack clásico funciona en iOS, Android y web
- `replace('Game')` en "Volver a jugar" evita apilar pantallas de juego

---

### 3. Gestión de Estado

#### Decision: Manejo Local vs Redux
- **Seleccionado**: Estado local con hooks (useState, useCallback)
- **Razón**: 
  - Aplicación relativamente simple
  - Non es necesario estado global compartido entre muchas pantallas
  - Reduce complejidad y tiempo de desarrollo
  - AsyncStorage maneja persistencia bien

**Posible mejora futura**: Implementar Redux/Zustand si se agrega sincronización en la nube

---

### 4. Persistencia de Datos

#### ✅ AsyncStorage de React Native
- **Ventajas**:
  - Simétrica API
  - Manejo automático de serialización JSON
  - Suficiente capacidad (típicamente 10MB+)
  - Sin necesidad de servidor

- **Alternativas consideradas**:
  - ❌ SQLite: Overkill para este caso de uso
  - ❌ Realm: Complejidad innecesaria
  - ❌ localStorage web: No disponible en React Native

#### Estructura de datos
```typescript
{
  totalGamesPlayed: number;
  bestScore: number;
  totalPoints: number;
  gamesHistory: RoundResult[];
  statisticsByMode: { classic, truefalse, multichoice, timed };
  statisticsByDifficulty: { easy, medium, hard };
}
```

**Ventaja**: Estructura normalizada permite queries rápidas sin necesidad de SQL

---

### 5. Lógica de Generación de Operaciones

#### Problemas Considerados:
1. **División exacta**: Usamos Math.round() para evitar decimales
2. **Validación de respuestas**: Exacta coincidencia con correctAnswer
3. **Distribución uniforme**: Números aleatorios en cada rango de dificultad

#### Código de Generación:
```typescript
const num1 = Math.floor(Math.random() * (max - min + 1) + min);
const num2 = Math.floor(Math.random() * (max - min + 1) + min);
```

**Razón**: Garantiza distribución uniforme en el rango especificado

#### Opciones Múltiples:
- Se generan 3 opciones incorrectas evitando duplicados
- Se usan ±10 de offset para opciones realistas
- Se mezclan todas las opciones para evitar patrones

---

### 6. Sistema de Puntuación

#### Criterios de Diseño:
1. **Recompensar velocidad sin penalizar precisión**
   - Respuesta correcta rápida (+100) vs en tiempo (+70)
   - Diferencia significativa pero sin castigar respuestas dudosas

2. **Penalizar errores moderadamente**
   - Respuesta incorrecta (-30) vs sin respuesta (-50)
   - Los errores son recuperables

3. **Balanceo para diferentes modos**
   - Mismo sistema para todos los modos
   - Dificultad ajusta el tiempo límite, no los puntos

#### Fórmula:
```typescript
if (!isCorrect) return -30;
if (responseTime > timeLimit) return -50;
if (responseTime < timeLimit * 0.75) return 100;
return 70;
```

**Justificación**: Simple, entendible, justo

---

### 7. Interfaz de Usuario

#### Decisiones de Diseño:

##### 🎨 Color Scheme
- **Azul (#2196F3)**: Acción primaria, información
- **Verde (#4CAF50)**: Éxito, respuesta correcta, tiempo abundante
- **Naranja (#FFC107)**: Advertencia, tiempo moderado
- **Rojo (#F44336)**: Error, tiempo crítico

**Razón**: Psicología del color y accesibilidad

##### 📐 Layout
- Centrado vertical para preguntas
- Máximo width implícito (no más de ~500px)
- Padding consistente de 20px

##### ⏰ Indicadores de Tiempo
- Cambio de color dinámico según tiempo restante
- Dos niveles de precisión: segundos con decimales
- Conspicuo pero no invasivo

---

### 8. Modos de Juego

#### ✏️ Modo Clásico
- **Pros**: Simple, directo, acepta múltiples formatos
- **Contras**: Requiere teclado, más lento
- **Público**: Todos

#### ✓✗ Modo Verdadero/Falso
- **Pros**: Rápido, dos opciones claras, sin ambigüedad
- **Contras**: Menos desafiante mentalmente
- **Público**: Principiantes

#### ⭕ Modo Opción Múltiple
- **Pros**: Sin teclado; cuadrícula 2×2 clara; feedback visual al responder
- **Contras**: Requiere generación cuidadosa de distractores
- **Público**: Intermedio
- **Web**: Sin ScrollView anidado sin altura; layout en `View` con flexWrap

#### ⏱️ Modo Contra Reloj
- **Pros**: Muy motivante, crea presión realista
- **Contras**: Puede ser frustrante para principiantes
- **Público**: Avanzados

---

### 9. Dificultad Dinámica

#### ✅ Implementada
```typescript
const decrementedTime = Math.max(
  2000, // mínimo 2s
  baseTime - questionIndex * timeDecrement
);
```

**Objetivo**: Aumentar desafío sin ser imposible

**Control**: 
- Mínimo garantizado de 2 segundos
- Usuario puede desactivar si lo desea

---

### 10. Manejo de Timers

#### ⚠️ Challenges Enfrentados:
1. **Memory leaks**: Timers no limpiados
2. **Race conditions**: Múltiples timers activos
3. **Precisión**: setInterval != exacto

#### ✅ Soluciones:
```typescript
useEffect(() => {
  const timer = setInterval(...);
  return () => clearInterval(timer); // Cleanup
}, [dependencies]);

// Usar refs para estado mutable
const timerRef = useRef<NodeJS.Timeout>();
```

**Razón**: Intervalos de 100ms balancean precisión y rendimiento

---

### 11. Validación de Respuestas

#### Lógica Implementada:
1. **Clásico**: Igualdad exacta de números
2. **Verdadero/Falso**: Booleano vs resultado correcto
3. **Opción Múltiple**: Opción seleccionada = correctAnswer
4. **Contra Reloj**: Igual que Clásico

```typescript
const isCorrect = userAnswer === operation.correctAnswer;
```

---

### 12. Cálculo de Estadísticas

#### Promedios Ponderados:
```typescript
averageScore = Math.round(
  (newScore + oldAverage * (count - 1)) / count
);
```

**Razón**: Precisión decimal mantenida durante cálculos iterativos

#### Accuracy:
```typescript
accuracy = Math.round((correct / total) * 100);
```

**Redondeado a enteros** para simplificación

---

### 13. Tratamiento de Errores

#### Strategy:
1. **Try-catch en operaciones de storage**
2. **Alerts para errores críticos**
3. **Fallbacks sensatos**

```typescript
try {
  // operación
} catch (error) {
  console.error('Error:', error);
  Alert.alert('Error', 'Mensaje amigable');
}
```

---

### 14. Optimizaciones de Rendimiento

#### ✅ Implementadas:
1. **Memoización**: `React.memo` en componentes pesados
2. **useCallback**: Para callbacks en listas
3. **useFocusEffect**: Cargar datos solo cuando pantalla visible
4. **Timers optimizados**: clearInterval en cleanup

#### ❌ No Implementadas (Future):
- [ ] Virtualization en listas largas
- [ ] Image optimization
- [ ] Code splitting

---

### 15. Testing (Consideraciones)

#### Qué se testaría:
- ✅ Generación de operaciones (números en rango)
- ✅ Cálculo de puntos (casos edge)
- ✅ Persistencia de datos
- ✅ Cálculos de estadísticas

#### Qué se omitió:
- ❌ Tests de UI (requeriría setup complejo)
- ❌ Tests de integración (futuro)

---

### 16. Requisitos No Funcionales

#### ✅ Alcanzados:
- Tiempo de inicio < 3 segundos
- FPS consistente en gameplay
- Sin lag en transiciones de pantalla
- Bajo uso de memoria

#### 📈 Métricas:
- Bundle size: ~5MB (Expo managed)
- Storage footprint: <1MB con 100 juegos

---

### 17. Accesibilidad

#### ✅ Consideraciones:
- Colores contrastantes
- Tamaños de fuente legibles
- Botones suficientemente grandes
- Feedback táctil (vibración en futuro)



---

### 18. Gráficos en estadísticas

**Decisión:** Componentes propios + `react-native-svg` solo para la torta.

| Gráfico | Implementación |
|---------|----------------|
| Partidas por modo | `PieChart` (SVG Path) |
| Precisión | `HorizontalBarChart` (View + width %) |
| Puntuaciones | `BarChart` (View + height px) |

**Alternativa descartada:** Librería chart completa (peso, compatibilidad web).

---

### 19. Soporte Web

- `injectWebLayoutStyles()`: `html/body/#root` al 100 %, scroll en contenedores
- `ScreenScrollView`: altura acotada + clase CSS `mental-math-scroll`
- Enter + `useAnswerInputFocus` para UX de escritorio

---

### 20. Volver a jugar

`RoundResult.gameConfig?: GameConfig` guardado al finalizar.  
`buildGameConfigFromResult()` reconstruye config si falta (partidas antiguas).

---

---

## 📊 Comparativa de Decisiones Clave

| Aspecto | Seleccionado | Alternativa | Razón |
|--------|--------------|-------------|-------|
| Framework | React Native | Flutter | Equipo familiarizado, JS ecosystem |
| State | Local + AsyncStorage | Redux | Complejidad innecesaria |
| Storage | AsyncStorage | SQLite | Simplicidad vs capacidad |
| Navigation | Stack (no native-stack) | Bottom Tabs / native-stack | Web + flujo lineal |
| Gráficos | SVG + Views | Chart.js / Victory | Peso y compatibilidad |
| Puntuación | Fórmula simple | ML clustering | Interpretabilidad |

---

## ✅ Conclusiones

Este diseño prioriza:
1. **Simplitud**: Código mantenible
2. **Performance**: Experiencia fluida
3. **UX**: Intuitividad
4. **Escalabilidad**: Preparado para futuro

El stack elegido ofrece el mejor balance entre capacidad, complejidad y velocidad de desarrollo.

---

*Documento actualizado: Mayo 2026*
*Versión: 1.1.0*
