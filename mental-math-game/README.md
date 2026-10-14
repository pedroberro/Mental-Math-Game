# 🧮 Juego de Cálculos Mentales - React Native

Aplicación multiplataforma (iOS, Android y **Web**) para practicar operaciones matemáticas con tiempo limitado, varios modos de juego, estadísticas visuales e historial local.

**Versión actual:** 1.1.0 · **Mayo 2026**

---

## 📋 Características principales

### Niveles de dificultad
| Nivel | Números | Operadores | Tiempo base |
|-------|---------|------------|-------------|
| Fácil | 1–10 | +, − | 15 s |
| Medio | 5–50 | +, −, × | 10 s |
| Difícil | 10–100 | +, −, ×, ÷ | 5 s |

### Modos de juego
- **Clásico:** escribes el resultado. Enter para enviar. Foco automático en el campo de respuesta.
- **Verdadero/Falso:** indicas si el resultado mostrado es correcto.
- **Opción múltiple:** eliges entre 4 opciones en cuadrícula 2×2 (una correcta, tres distractores).
- **Contra reloj:** respondes en cadena hasta fallar o agotar 60 s totales.

### Configuración de partida
- Preguntas por ronda: 1–50
- Dificultad dinámica opcional (reduce el tiempo por pregunta)
- La configuración se guarda con cada partida para **volver a jugar** con los mismos ajustes

### Sistema de puntuación
| Situación | Puntos |
|-----------|--------|
| Correcta rápida (&lt; 75 % del tiempo) | +100 |
| Correcta en tiempo | +70 |
| Incorrecta | −30 |
| Sin respuesta (tiempo agotado) | −50 |

### Pantallas
| Pantalla | Descripción |
|----------|-------------|
| **Inicio** | Jugar, Estadísticas, Historial |
| **Configurar** | Dificultad, modo, preguntas, opciones |
| **Juego** | Modo activo + temporizador + scroll en web |
| **Resultados** | Puntuación, detalle de **todas** las respuestas (tuya vs correcta), recomendación |
| **Estadísticas** | Resumen + **gráficos** + detalle por modo/dificultad |
| **Historial** | Últimas **30** partidas; toque para ver resultado completo |

### Botones al finalizar partida (orden)
1. **Volver a jugar** — misma configuración (modo, dificultad, preguntas, etc.)
2. **Ver estadísticas**
3. **Volver al menú principal** (al final)

### Estadísticas con gráficos
- **Torta:** partidas jugadas por modo
- **Barras horizontales:** precisión por modo y por dificultad (%)
- **Barras verticales:** puntuación media por dificultad; puntuación de las últimas 8 partidas
- Tarjetas de detalle por modo y dificultad
- Reinicio de estadísticas

### Persistencia
- AsyncStorage (local, sin servidor)
- Historial completo en `gamesHistory`
- Estadísticas agregadas por modo y dificultad

### Soporte Web
- Scroll con barra visible en pantallas largas
- Layout con altura acotada (`100vh`) para que el desplazamiento funcione
- Compatible con teclado (Enter, foco automático en modos con entrada numérica)

---

## 🚀 Instalación y ejecución

### Requisitos
- Node.js 16+
- npm 8+

### Instalación
```bash
cd mental-math-game
npm install
```

### Ejecutar
```bash
npm start          # Menú Expo
npm run android    # Android
npm run ios        # iOS (macOS)
npm run web        # Navegador (Metro ~8081)
```

En web, si hay errores de caché:
```bash
npx expo start --web -c
```

---

## 📁 Estructura del proyecto

```
mental-math-game/
├── src/
│   ├── App.tsx                    # Navegación (Stack Navigator)
│   ├── components/
│   │   ├── ClassicMode.tsx
│   │   ├── TrueFalseMode.tsx
│   │   ├── MultiChoiceMode.tsx
│   │   ├── TimedMode.tsx
│   │   ├── ScreenScrollView.tsx   # Scroll web/móvil
│   │   ├── BarChart.tsx
│   │   ├── HorizontalBarChart.tsx
│   │   ├── PieChart.tsx           # react-native-svg
│   │   └── index.ts
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── GameConfigScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   └── useAnswerInputFocus.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── gameEngine.ts
│       ├── storageService.ts
│       ├── resultFormat.ts        # Formato respuestas en resultados
│       ├── gameConfigFromResult.ts # Volver a jugar
│       └── webLayout.ts           # Estilos scroll web
├── assets/                        # icon, splash, favicon
├── index.js
├── app.json
└── package.json
```

---

## 🔧 Tecnologías

| Paquete | Uso |
|---------|-----|
| React Native 0.73 + Expo 50 | Framework |
| TypeScript 5.3 | Tipos |
| React Navigation 6 (`@react-navigation/stack`) | Navegación (compatible web) |
| AsyncStorage | Persistencia |
| react-native-svg | Gráfico de torta |
| react-native-web | Versión web |

---

## 🔐 Privacidad

- Datos solo en el dispositivo
- Sin cuenta ni servidor
- Reinicio de estadísticas desde la app

---

## 📚 Más documentación

| Archivo | Contenido |
|---------|-----------|
| [FUNCIONALIDADES.md](./FUNCIONALIDADES.md) | Detalle funcional por módulo |
| [DECISIONES_DISEÑO.md](./DECISIONES_DISEÑO.md) | Decisiones técnicas |
| [COMPILACIÓN.md](./COMPILACIÓN.md) | Build, web, troubleshooting |
| [RESUMEN.md](./RESUMEN.md) | Resumen ejecutivo |
| [ÍNDICE.md](./ÍNDICE.md) | Índice de documentación |

---

## 📝 Licencia

MIT — proyecto educativo de cálculo mental.
