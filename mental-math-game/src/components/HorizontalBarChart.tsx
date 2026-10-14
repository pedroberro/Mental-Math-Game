import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface HorizontalBarItem {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarChartProps {
  title: string;
  data: HorizontalBarItem[];
  valueSuffix?: string;
  maxValue?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  data,
  valueSuffix = '',
  maxValue,
}) => {
  if (data.length === 0) {
    return null;
  }

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {data.map((item, index) => {
        const widthPercent = max > 0 ? Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0) : 0;
        const color = item.color ?? '#2196F3';

        return (
          <View key={`${item.label}-${index}`} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: `${widthPercent}%`, backgroundColor: color },
                ]}
              />
            </View>
            <Text style={styles.value}>
              {item.value}
              {valueSuffix}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    width: 72,
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  barBackground: {
    flex: 1,
    height: 22,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
  value: {
    width: 44,
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'right',
  },
});
