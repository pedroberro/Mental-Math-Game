import { Platform, ViewStyle } from 'react-native';

const WEB_LAYOUT_STYLE_ID = 'mental-math-web-layout';

export function injectWebLayoutStyles(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }
  if (document.getElementById(WEB_LAYOUT_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = WEB_LAYOUT_STYLE_ID;
  style.textContent = `
    html, body {
      height: 100%;
      margin: 0;
      overflow: hidden;
    }
    #root {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #root > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }
    #root > div > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .mental-math-scroll {
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: #90a4ae #f5f5f5;
    }
    .mental-math-scroll::-webkit-scrollbar {
      width: 10px;
    }
    .mental-math-scroll::-webkit-scrollbar-track {
      background: #f5f5f5;
    }
    .mental-math-scroll::-webkit-scrollbar-thumb {
      background: #90a4ae;
      border-radius: 5px;
    }
    .mental-math-scroll::-webkit-scrollbar-thumb:hover {
      background: #607d8b;
    }
  `;
  document.head.appendChild(style);
}

export const webScreenContainer: ViewStyle =
  Platform.OS === 'web'
    ? ({
        flex: 1,
        height: '100%',
        maxHeight: '100vh',
        overflow: 'hidden',
      } as ViewStyle)
    : { flex: 1 };

export const webScrollView: ViewStyle =
  Platform.OS === 'web'
    ? ({
        flex: 1,
        height: '100%',
        overflowY: 'scroll',
      } as ViewStyle)
    : { flex: 1 };
