import React from 'react';
import {
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import { webScreenContainer, webScrollView } from '../utils/webLayout';

type ScreenScrollViewProps = ScrollViewProps & {
  children: React.ReactNode;
  /** Usar dentro de otra pantalla (p. ej. GameScreen con cabecera fija) */
  embedded?: boolean;
};

export const ScreenScrollView: React.FC<ScreenScrollViewProps> = ({
  children,
  style,
  contentContainerStyle,
  embedded = false,
  ...rest
}) => {
  const scrollView = (
    <ScrollView
      {...rest}
      style={[styles.scroll, embedded && styles.scrollEmbedded, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled
      {...(Platform.OS === 'web' ? { className: 'mental-math-scroll' } : {})}
    >
      {children}
    </ScrollView>
  );

  if (embedded) {
    return scrollView;
  }

  return <View style={styles.wrapper}>{scrollView}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    ...webScreenContainer,
    backgroundColor: '#fff',
  },
  scroll: {
    ...webScrollView,
  },
  scrollEmbedded: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
