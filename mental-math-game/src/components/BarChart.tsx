import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  data: BarChartItem[];
  valueSuffix?: string;
  maxValue?: number;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  valueSuffix = '',
  maxValue,
  height = 160,
}) => {
  if (data.length === 0) {
    return null;
  }

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const barAreaHeight = height - 56;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, index) => {
          const barHeight =
            max > 0
              ? Math.max((item.value / max) * barAreaHeight, item.value > 0 ? 8 : 0)
              : 0;
          const color = item.color ?? '#2196F3';

          return (
            <View key={`${item.label}-${index}`} style={styles.barColumn}>
              <Text style={styles.barValue} numberOfLines={1}>
                {item.value}
                {valueSuffix}
              </Text>
              <View style={[styles.barTrack, { height: barAreaHeight }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barHeight,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
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
    marginBottom: 16,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#444',
    marginBottom: 6,
    textAlign: 'center',
  },
  barTrack: {
    width: '100%',
    maxWidth: 48,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
    minWidth: 20,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
    minHeight: 28,
  },
});
