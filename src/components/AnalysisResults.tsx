import React from 'react';
import { AnalysisResult } from '../types';
import { ResultsTable } from './ResultsTable';
import { CannibalizationChart } from './CannibalizationChart';
import { IntentDistribution } from './IntentDistribution';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const highPriorityResults = results.filter(r => r.cannibalizationScore > 0.7);

  return (
    <div className="space-y-6">
      {/* Resumo da Análise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total de Páginas Analisadas</h3>
          <p className="text-3xl font-bold text-purple-600">{results.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Casos Críticos</h3>
          <p className="text-3xl font-bold text-red-600">{highPriorityResults.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Score Médio</h3>
          <p className="text-3xl font-bold text-purple-600">
            {(results.reduce((acc, r) => acc + r.cannibalizationScore, 0) / results.length).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Alertas de Alta Prioridade */}
      {highPriorityResults.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-red-700">
              Atenção: {highPriorityResults.length} casos críticos identificados
            </h3>
          </div>
          <div className="mt-3 space-y-2">
            {highPriorityResults.map((result, index) => (
              <div key={index} className="flex items-start space-x-2 text-red-600">
                <span className="mt-1">•</span>
                <div>
                  <div className="font-medium">{result.landingPage}</div>
                  <div className="text-sm text-red-500">
                    Score: {result.cannibalizationScore.toFixed(2)} | 
                    Conflita com {result.similarUrls.length} {result.similarUrls.length === 1 ? 'página' : 'páginas'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botões de Exportação */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Resultados da Análise</h2>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(results)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
            </svg>
            Exportar CSV
          </button>
          <button
            onClick={() => exportToPDF(results)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" />
            </svg>
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Scores</h3>
          <CannibalizationChart results={results} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Intenção de Busca</h3>
          <IntentDistribution results={results} />
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Resultados Detalhados</h3>
        </div>
        <ResultsTable data={results} />
      </div>
    </div>
  );
};