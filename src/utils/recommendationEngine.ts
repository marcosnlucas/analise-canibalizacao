import { AnalysisResult, SearchIntent } from '../types';

interface RecommendationRule {
  condition: (result: AnalysisResult) => boolean;
  recommendation: (result: AnalysisResult) => string;
  priority: number;
}

const rules: RecommendationRule[] = [
  {
    condition: (result) => result.cannibalizationScore > 0.8,
    recommendation: (result) => 
      `Alta prioridade: Considere canonical tag de ${result.similarUrls[0]} para ${result.landingPage}`,
    priority: 1
  },
  {
    condition: (result) => result.metrics.clicksLost > 100,
    recommendation: (result) => 
      `Perda significativa de tráfego: Avalie consolidar o conteúdo em uma única página`,
    priority: 2
  },
  {
    condition: (result) => result.searchIntent === 'transactional' && result.cannibalizationScore > 0.6,
    recommendation: () => 
      `Páginas transacionais em conflito: Redirecione para a página com melhor conversão`,
    priority: 3
  },
  {
    condition: (result) => result.metrics.averagePositionDiff < 2,
    recommendation: (result) => 
      `Posições muito próximas: Defina uma hierarquia clara entre as páginas`,
    priority: 4
  }
];

export const generateRecommendations = (result: AnalysisResult): string[] => {
  return rules
    .filter(rule => rule.condition(result))
    .sort((a, b) => a.priority - b.priority)
    .map(rule => rule.recommendation(result));
};