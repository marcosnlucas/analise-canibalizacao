import { AnalysisResult, GSCData, SearchIntent, AnalysisConfig } from '../types';
import { getIntentConflictScore } from './searchIntentAnalyzer';

interface ScoringFactors {
  intentConflict: number;
  positionOverlap: number;
  trafficImpact: number;
  keywordOverlap: number;
}

export const calculateCannibalizationScore = (
  page: GSCData,
  similarPage: GSCData,
  sharedKeywords: string[],
  intents: Record<string, SearchIntent>
): ScoringFactors => {
  // Intent conflict score (0-1)
  const intentConflict = getIntentConflictScore(
    intents[page.query] || 'informational',
    intents[similarPage.query] || 'informational'
  );

  // Position overlap score (0-1)
  const positionDiff = Math.abs((page.averagePosition || 0) - (similarPage.averagePosition || 0));
  const positionOverlap = Math.max(0, 1 - positionDiff / 10); // Normalizado para 10 posições

  // Traffic impact score (0-1)
  const pageClicks = page.urlClicks || 0;
  const similarPageClicks = similarPage.urlClicks || 0;
  const totalClicks = pageClicks + similarPageClicks;
  const trafficImpact = totalClicks > 0 
    ? Math.min(pageClicks, similarPageClicks) / totalClicks
    : 0;

  // Keyword overlap score (0-1)
  const keywordOverlap = page.query 
    ? sharedKeywords.length / Math.max(1, page.query.length)
    : 0;

  return {
    intentConflict: isNaN(intentConflict) ? 0 : intentConflict,
    positionOverlap: isNaN(positionOverlap) ? 0 : positionOverlap,
    trafficImpact: isNaN(trafficImpact) ? 0 : trafficImpact,
    keywordOverlap: isNaN(keywordOverlap) ? 0 : keywordOverlap
  };
};

export const getFinalScore = (factors: ScoringFactors, config: AnalysisConfig): number => {
  if (!config || !config.weights) {
    // Use default weights if config is not provided
    const defaultWeights = {
      intentConflict: 0.3,
      positionOverlap: 0.3,
      trafficImpact: 0.2,
      keywordOverlap: 0.2
    };
    
    return (
      factors.intentConflict * defaultWeights.intentConflict +
      factors.positionOverlap * defaultWeights.positionOverlap +
      factors.trafficImpact * defaultWeights.trafficImpact +
      factors.keywordOverlap * defaultWeights.keywordOverlap
    );
  }

  const { weights } = config;
  
  return (
    factors.intentConflict * weights.intentConflict +
    factors.positionOverlap * weights.positionOverlap +
    factors.trafficImpact * weights.trafficImpact +
    factors.keywordOverlap * weights.keywordOverlap
  );
};