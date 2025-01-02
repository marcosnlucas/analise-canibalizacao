import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResult } from '../types';

interface IntentDistributionProps {
  results: AnalysisResult[];
}

export const IntentDistribution: React.FC<IntentDistributionProps> = ({ results }) => {
  const intentCounts = results.reduce((acc, result) => {
    acc[result.searchIntent] = (acc[result.searchIntent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(intentCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};