# 📚 Índice de Documentación

## Juego de Cálculos Mentales — v1.1.0

---

## Documentos

| Documento | Contenido |
|-----------|-----------|
| **README.md** | Instalación, características, estructura, tecnologías |
| **FUNCIONALIDADES.md** | Especificación por pantalla y módulo |
| **DECISIONES_DISEÑO.md** | Stack, web, gráficos, persistencia |
| **COMPILACIÓN.md** | Ejecución, web, troubleshooting |
| **RESUMEN.md** | Resumen ejecutivo v1.1.0 |

---

## Estructura del código (actual)

```
src/
├── App.tsx
├── components/
│   ├── ClassicMode.tsx, TrueFalseMode.tsx
│   ├── MultiChoiceMode.tsx, TimedMode.tsx
│   ├── ScreenScrollView.tsx
│   ├── BarChart.tsx, HorizontalBarChart.tsx, PieChart.tsx
│   └── index.ts
├── screens/
│   ├── HomeScreen.tsx, GameConfigScreen.tsx, GameScreen.tsx
│   ├── ResultsScreen.tsx, StatisticsScreen.tsx, HistoryScreen.tsx
│   └── index.ts
├── hooks/useAnswerInputFocus.ts
├── types/index.ts
└── utils/
    ├── gameEngine.ts, storageService.ts
    ├── resultFormat.ts, gameConfigFromResult.ts
    └── webLayout.ts
```

---

## Funcionalidades destacadas (v1.1.0)

- 4 modos · 3 dificultades · puntuación por tiempo/precisión  
- **Web:** scroll, Enter, foco automático  
- **Resultados:** todas las respuestas; volver a jugar; menú al final  
- **Estadísticas:** torta + barras  
- **Historial:** 30 últimas partidas  

---

## Inicio rápido

```bash
cd mental-math-game
npm install
npm run web
```

---

## Checklist

| Funcionalidad | Estado |
|---------------|--------|
| 4 modos de juego | ✅ |
| Web funcional | ✅ |
| Historial (30) | ✅ |
| Gráficos estadísticas | ✅ |
| Volver a jugar | ✅ |
| Enter / foco input | ✅ |
| Detalle respuestas completo | ✅ |

---


---

*Índice actualizado: Mayo 2026 · v1.1.0*
