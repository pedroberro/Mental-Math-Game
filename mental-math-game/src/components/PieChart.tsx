import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export interface PieChartItem {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title: string;
  data: PieChartItem[];
  size?: number;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createSlicePath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  if (endAngle - startAngle >= 359.99) {
    return [
      `M ${cx} ${cy - radius}`,
      `A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius}`,
      'Z',
    ].join(' ');
  }

  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  size = 200,
}) => {
  const filtered = data.filter((item) => item.value > 0);
  const total = filtered.reduce((sum, item) => sum + item.value, 0);

  if (filtered.length === 0 || total === 0) {
    return null;
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 2;
  let currentAngle = -90;

  const slices = filtered.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;

    return {
      ...item,
      path: createSlicePath(cx, cy, radius, startAngle, endAngle),
      percent: Math.round((item.value / total) * 100),
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, index) => (
              <Path
                key={`${slice.label}-${index}`}
                d={slice.path}
                fill={slice.color ?? '#2196F3'}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </G>
        </Svg>

        <View style={styles.legend}>
          {slices.map((slice, index) => (
            <View key={`legend-${slice.label}-${index}`} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: slice.color ?? '#2196F3' }]}
              />
              <Text style={styles.legendText}>
                {slice.label}: {slice.value} ({slice.percent}%)
              </Text>
            </View>
          ))}
        </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  legend: {
    flex: 1,
    minWidth: 140,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
    flex: 1,
  },
});
