import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface CannibalizationChartProps {
  results: AnalysisResult[];
}

export const CannibalizationChart: React.FC<CannibalizationChartProps> = ({ results }) => {
  const data = results.map(result => ({
    url: result.landingPage.split('/').slice(-1)[0] || result.landingPage,
    score: parseFloat(result.cannibalizationScore.toFixed(2))
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="url" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="score" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};