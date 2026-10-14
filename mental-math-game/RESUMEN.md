# 🧮 Resumen del Proyecto: Juego de Cálculos Mentales

**Versión:** 1.1.0 · **Mayo 2026**  
**Plataformas:** iOS, Android, **Web**  
**Estado:** ✅ Funcional y documentado

---

## Descripción

App React Native (Expo) para entrenar cálculo mental bajo tiempo. Cuatro modos de juego, tres dificultades, puntuación por velocidad y precisión, historial local y estadísticas con gráficos.

---

## Novedades v1.1.0

| Área | Mejora |
|------|--------|
| Web | Scroll, layout `100vh`, teclado (Enter, foco automático) |
| Opción múltiple | Cuadrícula 2×2 funcional en web |
| Resultados | Todas las respuestas; volver a jugar; botones reordenados |
| Estadísticas | Gráfico de torta, barras horizontales y verticales |
| Historial | Botón en inicio; últimas 30 partidas |
| Navegación | `@react-navigation/stack` (compatible web) |

---

## Métricas del proyecto

```
Pantallas:           6
Modos de juego:      4
Componentes juego:   4 (+ 4 de UI/gráficos)
Gráficos:            3 tipos (torta, barras H, barras V)
Utilidades:          5 módulos en src/utils/
Hooks:               1 (useAnswerInputFocus)
```

---

## Pantallas

1. **Inicio** — Jugar · Estadísticas · Historial  
2. **Configurar** — Dificultad, modo, preguntas, dificultad dinámica  
3. **Juego** — UI según modo + temporizador  
4. **Resultados** — Resumen + detalle completo + Volver a jugar / Estadísticas / Menú  
5. **Estadísticas** — Gráficos + tablas + reset  
6. **Historial** — 30 últimas partidas → detalle  

---

## Stack

- React Native 0.73 · Expo 50 · TypeScript 5.3  
- React Navigation 6 (Stack)  
- AsyncStorage  
- react-native-svg (gráfico de torta)  
- react-native-web  

---

## Inicio rápido

```bash
cd mental-math-game
npm install
npm run web    # o npm start
```

---

## Documentación

| Archivo | Uso |
|---------|-----|
| README.md | Visión general e instalación |
| FUNCIONALIDADES.md | Especificación detallada |
| DECISIONES_DISEÑO.md | Arquitectura y trade-offs |
| COMPILACIÓN.md | Build y troubleshooting |
| ÍNDICE.md | Navegación entre docs |

---

**Licencia:** MIT
