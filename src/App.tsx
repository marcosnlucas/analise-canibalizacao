import React, { useState, useEffect, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { AnalyzeButton } from './components/AnalyzeButton';
import { InstructionsModal } from './components/InstructionsModal';
import { validateAndParseCSV } from './utils/csvProcessor';
import { analyzeKeywords } from './utils/dataProcessor';
import { AnalysisResult, GSCData, AnalysisConfig } from './types';
import { Info, HelpCircle } from 'lucide-react';
import './styles/global.css';

const defaultConfig: AnalysisConfig = {
  weights: {
    intentConflict: 0.3,
    positionOverlap: 0.3,
    trafficImpact: 0.2,
    keywordOverlap: 0.2
  },
  minQueries: 3
};

const weightLabels = {
  intentConflict: 'Conflito de Intenção',
  positionOverlap: 'Sobreposição de Posição',
  trafficImpact: 'Impacto no Tráfego',
  keywordOverlap: 'Sobreposição de Keywords'
};

function App() {
  const [csvData, setCsvData] = useState<GSCData[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [similarity, setSimilarity] = useState(0.7);
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(false);
  const [config, setConfig] = useState<AnalysisConfig>(defaultConfig);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sliders = document.querySelectorAll<HTMLInputElement>('.range-slider');
    sliders.forEach(slider => {
      const value = Number(slider.value);
      slider.style.setProperty('--value', `${value * 100}%`);
    });
  }, []);

  useEffect(() => {
    // Atualiza visibilidade do botão sempre que csvData mudar
    console.log('csvData mudou:', {
      length: csvData.length,
      showButton: csvData.length > 0
    });
    setShowAnalyzeButton(csvData.length > 0);
  }, [csvData]);

  const handleConfigChange = (field: string, value: number) => {
    if (field === 'minQueries') {
      setConfig(prev => ({ ...prev, minQueries: value }));
    } else {
      const totalOtherWeights = Object.entries(config.weights)
        .filter(([key]) => key !== field)
        .reduce((sum, [, val]) => sum + val, 0);

      const newWeights = { ...config.weights, [field]: value };
      const scale = (1 - value) / totalOtherWeights;

      // Ajusta outros pesos proporcionalmente
      Object.keys(newWeights).forEach(key => {
        if (key !== field) {
          newWeights[key] *= scale;
        }
      });

      setConfig(prev => ({ ...prev, weights: newWeights }));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSimilarity(value);
    e.target.style.setProperty('--value', `${value * 100}%`);
  };

  const handleConfigSliderChange = (key: keyof typeof config.weights, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    handleConfigChange(key, value);
    e.target.style.setProperty('--value', `${value * 100}%`);
  };

  const handleFileSelect = async (file: File) => {
    try {
      console.log('Iniciando processamento do arquivo:', file.name);
      setLoading(true);
      setError('');
      setCsvData([]);
      setShowAnalyzeButton(false);

      const data = await validateAndParseCSV(file);
      console.log('Arquivo processado com sucesso:', data.length, 'linhas');
      
      if (data.length === 0) {
        throw new Error('O arquivo não contém dados válidos');
      }

      setCsvData(data);
      setShowAnalyzeButton(true);
    } catch (err) {
      console.error('Erro no processamento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo');
      setCsvData([]);
      setShowAnalyzeButton(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!csvData.length) return;
    
    setLoading(true);
    try {
      const results = analyzeKeywords(csvData, similarity, config);
      setResults(results);
      setError('');
      
      // Scroll suave para os resultados após um pequeno delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar dados');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="title-huge text-center text-purple-600 mb-8">
          Análise de Canibalização SEO
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Faça upload de um arquivo CSV do Looker Studio para análise.{' '}
          <button
            onClick={() => setIsInstructionsOpen(true)}
            className="text-purple-600 hover:text-purple-700 underline font-medium"
          >
            Instruções de uso!
          </button>
        </p>
        
        <InstructionsModal
          isOpen={isInstructionsOpen}
          onClose={() => setIsInstructionsOpen(false)}
        />

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Configurações de Análise</h2>
            <button
              onClick={() => setConfig(defaultConfig)}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium mt-2"
            >
              Restaurar Padrões
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 text-base mb-1">
                  Mínimo de Queries Diferentes
                </label>
                <span className="block text-gray-500 text-sm mb-2">
                  Mínimo de termos diferentes para considerar uma página
                </span>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={config.minQueries}
                    onChange={(e) => handleConfigChange('minQueries', Number(e.target.value))}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg p-2"
                  />
                  <span className="ml-2 text-gray-500">queries</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 text-base mb-1">
                  Similaridade Mínima
                </label>
                <span className="block text-gray-500 text-sm mb-2">
                  % de palavras-chave em comum para considerar páginas similares
                </span>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={similarity}
                    onChange={handleSliderChange}
                    className="block w-full h-2 accent-purple-600 range-slider"
                  />
                  <span className="text-lg font-medium w-20 text-center">{Math.round(similarity * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">Pesos dos Fatores</h3>
              <div className="text-base text-gray-600 font-medium">
                Total: 100%
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(config.weights).map(([key, value]) => (
                <div key={key} className="space-y-4">
                  <label className="block font-medium text-gray-700 text-base">
                    {weightLabels[key as keyof typeof weightLabels]}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={value}
                      onChange={(e) => handleConfigSliderChange(key, e)}
                      className="block w-full h-2 accent-purple-600 range-slider"
                    />
                    <span className="text-lg font-medium w-16 text-right">{Math.round(value * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold">Upload de Dados</h2>
            <button
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => window.alert(`
Formato esperado do CSV do Looker Studio:

1. Exporte os dados do Looker Studio com as seguintes colunas:
- Query (termo de busca)
- Landing Page (URL da página)
- Clicks (cliques)
- Impressions (impressões)
- Position (posição média)

2. O arquivo deve estar no formato CSV
3. Deve conter dados de pelo menos 30 dias
4. Inclua todas as páginas que deseja analisar
              `)}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          
          <FileUpload onFileSelect={handleFileSelect} />
          
          {showAnalyzeButton && (
            <div className="mt-6">
              <AnalyzeButton onClick={handleAnalyze} loading={loading} />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <Info className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processando dados...</p>
          </div>
        ) : results.length > 0 ? (
          <div ref={resultsRef} className="mt-8">
            <AnalysisResults results={results} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;