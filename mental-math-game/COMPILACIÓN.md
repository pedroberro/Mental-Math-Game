# 🚀 Guía de Compilación y Ejecución

## Juego de Cálculos Mentales - React Native

---

## 📋 Requisitos Previos

### Sistema Operativo
- Windows 10 o superior
- macOS 10.15 o superior (para iOS)
- Linux (Ubuntu 18.04 o superior)

### Software Obligatorio
- **Node.js** 16.x o superior
- **npm** 8.x o superior (incluido con Node.js)
- **Git** (para control de versiones)

### Software Opcional (según plataforma)
- **Xcode** (para compilear iOS) - macOS solamente
- **Android Studio** (para compilar Android)
- **Visual Studio Code** (editor recomendado)

---

## 1️⃣ INSTALACIÓN DE DEPENDENCIAS GLOBALES

### Paso 1: Instalar Node.js

**Windows**:
1. Descargar desde https://nodejs.org (versión LTS)
2. Ejecutar el instalador
3. Seguir los pasos por defecto
4. Reiniciar la computadora

**Verificar instalación**:
```bash
node --version    # v16.x.x o superior
npm --version     # 8.x.x o superior
```

### Paso 2: Instalar Expo CLI

```bash
npm install -g expo-cli
```

**Verificar**:
```bash
expo --version
```

---

## 2️⃣ CLONAR/DESCARGAR EL PROYECTO

### Opción A: Usando Git
```bash
cd c:\Users\Tu_Usuario\Documentos
git clone <url-del-repositorio>
cd mental-math-game
```

### Opción B: Descargar ZIP
1. Descargar archivo ZIP del proyecto
2. Extraer en una carpeta
3. Abrir terminal en esa carpeta

---

## 3️⃣ INSTALAR DEPENDENCIAS DEL PROYECTO

```bash
cd c:\Users\Pedro\mtm\mental-math-game

# Instalar todas las dependencias
npm install

# O si prefieres yarn
yarn install
```

**⏱️ Tiempo estimado**: 2-5 minutos (depende de conexión)

**Esperar a que aparezca**:
```
added X packages in Xm
```

---

## 4️⃣ CONFIGURACIÓN INICIAL

### Crear archivo .env (opcional)
```bash
# En la raíz del proyecto
touch .env
```

**Contenido** (vacío o sin configuración especial para persistencia local):
```
# Placeholder para futura configuración
APP_ENV=development
```

---

## 5️⃣ EJECUTAR EN DESARROLLO

### Opción 1: Expo Go (Recomendado para Pruebas Rápidas)

```bash
npm start
# o
expo start
```

**Verás**:
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Expo DevTools is running at http://localhost:19000  │
│                                                        │
│  Android: Press 'a' to open the Android app           │
│  iOS: Press 'i' to open the iOS simulator             │
│  Web: Press 'w' to open the web version               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Opción 2: Android + Android Studio

**Requisito**: Tener Android Studio instalado

```bash
npm run android
```

**O manualmente**:
1. Tener Android Studio abierto con emulador corriendo
2. En la terminal donde está Expo, presiones 'a'

### Opción 3: iOS (solo en macOS)

```bash
npm run ios
```

**Requisitos**:
- macOS
- Xcode instalado
- iOS Simulator accesible

### Opción 4: Web

```bash
npm run web
```

Abrirá en el navegador (Metro suele usar **http://localhost:8081**).

Si el bundle falla o la pantalla no hace scroll:
```bash
npx expo start --web -c
```
Recarga forzada en el navegador: **Ctrl+Shift+R**.

---

## 6️⃣ COMPILAR PARA PRODUCCIÓN

### Compilar APK (Android)

```bash
# Opción 1: EAS Build (Recomendado)
eas build --platform android

# Opción 2: Expo build (Legacy)
expo build:android
```

**Resultado**: Archivo `.apk` para instalar en dispositivos Android

### Compilar IPA (iOS)

```bash
eas build --platform ios
```

**Nota**: Requiere cuenta Apple Developer

### Compilar para Web

```bash
npm run web
# o
expo export --platform web
```

---

## 7️⃣ DEVELOPMENT WORKFLOW

### Hot Reload
El código se recarga automáticamente cuando guardas cambios.

### Debug en Console
```bash
# En la terminal de Expo
- Press 'i' to open iOS
- Press 'a' to open Android
- Press 'e' to send your app to the browser
- Press 's' to sign out
- Press 'r' to restart the server
```

### React Native Debugger
```bash
# Instalar (opcional)
npm install --global react-native-debugger

# Usar en el menú de Expo (Debug remote)
```

---

## 1️⃣0️⃣ VARIABLES DE ENTORNO

### Archivo .env (crear si no existe)

```bash
# .env
# Configuración de la app
APP_NAME=Mental Math Game
APP_VERSION=1.0.0
APP_ENV=development

# Para conexión a servidor (futuro)
# API_URL=http://localhost:3000
# API_KEY=xxxxx
```

### Usar en código
```typescript
import { ENV } from './config';

const apiUrl = ENV.API_URL || 'http://localhost:3000';
```

---

## 1️⃣1️⃣ COMPILACIÓN AVANZADA

### Crear Bundle JavaScript manualmente
```bash
react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output bundle.js
```

### Escanear vulnerabilidades
```bash
npm audit

# Arreglar automáticamente
npm audit fix
```

### Optimizar tamaño
```bash
# Ver tamaño de módulos
npm ls --depth=0

# Remover dependencias no usadas
npm prune --production
```

---

## 1️⃣2️⃣ DEPLOYMENT A STORES

### Google Play (Android)

1. **Crear cuenta**: https://play.google.com/console
2. **Generar APK/AAB signed**:
   ```bash
   eas build --platform android --type app-bundle
   ```
3. **Subir a Play Store**
4. **Configurar details** (screenshots, descripción)
5. **Enviar a revisión**

### App Store (iOS)

1. **Developer account**: https://developer.apple.com
2. **Generar IPA**:
   ```bash
   eas build --platform ios --type archive
   ```
3. **Upload con Transporter**
4. **Completar información**
5. **Enviar a revisión**

---

## 1️⃣3️⃣ MONITOREO EN PRODUCCIÓN

### Herramientas Recomendadas
- **Sentry**: Para error tracking
- **LogRocket**: Para session replay
- **Firebase Analytics**: Para eventos

**Instalación**:
```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative
```

---

## 1️⃣4️⃣ CI/CD (Integración Continua)

### GitHub Actions (opcional)

Crear archivo `.github/workflows/test.yml`:
```yaml
name: Test
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
```

---

## 1️⃣5️⃣ COMANDOS ÚTILES RESUMEN

```bash
# Desarrollo
npm start                  # Iniciar dev server
npm run android           # Abrir en Android
npm run ios               # Abrir en iOS
npm run web               # Abrir en web

# TypeScript
npx tsc --noEmit          # Verificar tipos

# Dependencias
npm install               # Instalar todas
npm update                # Actualizar
npm outdated              # Ver desactualizadas
npm audit                 # Verificar seguridad

# Limpieza
npm cache clean --force   # Limpiar caché
rm -rf node_modules       # Eliminar módulos

# Producción
eas build --platform android  # Build Android
eas build --platform ios      # Build iOS
npm run web                    # Build Web
```

---

## 1️⃣6️⃣ SCRIPTS DISPONIBLES

En `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  }
}
```

Ejecutar con:
```bash
npm run <script-name>
```

---

## 1️⃣7️⃣ LINKS ÚTILES

- **Documentación Expo**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **TypeScript**: https://www.typescriptlang.org
- **React Navigation**: https://reactnavigation.org
- **AsyncStorage**: https://react-native-async-storage.github.io

---

## ✅ VERIFICACIÓN FINAL

Cuando ejecutes `npm start`, deberías ver:

```
✓ File watching enabled
✓ Metro bundler is ready
✓ Expo DevTools is running

✺ Metro React Native bundler
✺ Server running on http://localhost:19000
Wait for bundler to finish...
```

Presiona 'a' o 'i' o 'w' para abrir en emulador/web.

¡Éxito! 🎉

---

*Guía actualizada: Mayo 2026*
*Versión: 1.1.0*
