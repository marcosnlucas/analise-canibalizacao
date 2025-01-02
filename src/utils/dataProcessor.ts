import { GSCData, AnalysisResult, AnalysisConfig } from '../types';
import { calculateCannibalizationScore, getFinalScore } from './cannibalizationScorer';
import { analyzeSearchIntent } from './searchIntentAnalyzer';
import { generateRecommendations } from './recommendationEngine';

export const analyzeKeywords = (
  data: GSCData[],
  similarityThreshold: number,
  config: AnalysisConfig
): AnalysisResult[] => {
  // Agrupar dados por URL
  const groupedData = new Map<string, {
    queries: Set<string>;
    urlClicks: number;
    impressions: number;
    averagePosition: number;
    count: number;
    intents: Map<string, string>;
  }>();

  // Primeira passagem: agrupar dados
  data.forEach(item => {
    const current = groupedData.get(item.landingPage) || {
      queries: new Set<string>(),
      urlClicks: 0,
      impressions: 0,
      averagePosition: 0,
      count: 0,
      intents: new Map<string, string>()
    };

    current.queries.add(item.query);
    current.urlClicks += item.urlClicks;
    current.impressions += item.impressions;
    current.averagePosition += item.averagePosition;
    current.count++;
    current.intents.set(item.query, item.searchIntent);

    groupedData.set(item.landingPage, current);
  });

  // Segunda passagem: análise de canibalização
  const results: AnalysisResult[] = [];

  groupedData.forEach((pageData, landingPage) => {
    if (pageData.queries.size < config.minQueries) return;

    const similarPages: string[] = [];
    const sharedKeywords: Set<string> = new Set();
    let totalScore = 0;
    let comparisons = 0;

    groupedData.forEach((otherData, otherPage) => {
      if (landingPage === otherPage) return;

      const intersection = new Set(
        [...pageData.queries].filter(x => otherData.queries.has(x))
      );

      if (intersection.size >= similarityThreshold * pageData.queries.size) {
        similarPages.push(otherPage);
        intersection.forEach(keyword => sharedKeywords.add(keyword));

        // Calcular score de canibalização
        const factors = calculateCannibalizationScore(
          { landingPage, query: [...pageData.queries][0], ...pageData },
          { landingPage: otherPage, query: [...otherData.queries][0], ...otherData },
          [...intersection],
          Object.fromEntries(pageData.intents)
        );
        
        const score = getFinalScore(factors, config);
        totalScore += score;
        comparisons++;
      }
    });

    if (similarPages.length > 0) {
      const avgScore = totalScore / comparisons;
      const result: AnalysisResult = {
        landingPage,
        similarUrls: similarPages,
        sharedKeywords: [...sharedKeywords],
        queries: [...pageData.queries],
        urlClicks: pageData.urlClicks,
        impressions: pageData.impressions,
        averagePosition: pageData.averagePosition / pageData.count,
        cannibalizationScore: avgScore,
        searchIntent: analyzeSearchIntent([...pageData.queries][0]),
        metrics: {
          clicksLost: 0, // Calculado posteriormente
          impressionsLost: 0,
          averagePositionDiff: 0
        },
        recommendations: []
      };

      // Adicionar recomendações
      result.recommendations = generateRecommendations(result);

      results.push(result);
    }
  });

  return results;
};