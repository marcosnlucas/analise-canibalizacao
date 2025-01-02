// Existing interfaces...
export interface GSCData {
  landingPage: string;
  query: string;
  urlClicks: number;
  impressions: number;
  averagePosition: number;
}

export interface AnalysisConfig {
  weights: {
    intentConflict: number;
    positionOverlap: number;
    trafficImpact: number;
    keywordOverlap: number;
  };
  minQueries: number;
}

export interface AnalysisResult {
  landingPage: string;
  similarUrls: string[];
  sharedKeywords: string[];
  queries: string[];
  urlClicks: number;
  impressions: number;
  averagePosition: number;
  cannibalizationScore: number;
  searchIntent: SearchIntent;
  metrics: {
    clicksLost: number;
    impressionsLost: number;
    averagePositionDiff: number;
  };
  recommendations: string[];
}

export type SearchIntent = 'informational' | 'transactional' | 'commercial' | 'navigational';

export interface KeywordIntent {
  query: string;
  intent: SearchIntent;
  confidence: number;
}