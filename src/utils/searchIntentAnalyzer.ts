import { SearchIntent, KeywordIntent } from '../types';

const informationalKeywords = new Set([
  'como', 'what', 'quando', 'onde', 'por que', 'qual', 'quem',
  'significado', 'diferença', 'guia', 'tutorial', 'dicas'
]);

const transactionalKeywords = new Set([
  'comprar', 'preço', 'valor', 'custo', 'download', 'assinar',
  'contratar', 'reservar', 'agendar', 'consultar'
]);

const commercialKeywords = new Set([
  'melhor', 'review', 'comparar', 'vs', 'versus', 'comparação',
  'avaliação', 'opinião', 'recomendação'
]);

export const analyzeSearchIntent = (query: string): SearchIntent => {
  const words = query.toLowerCase().split(' ');
  
  let scores = {
    informational: 0,
    transactional: 0,
    commercial: 0,
    navigational: 0
  };

  words.forEach(word => {
    if (informationalKeywords.has(word)) scores.informational++;
    if (transactionalKeywords.has(word)) scores.transactional++;
    if (commercialKeywords.has(word)) scores.commercial++;
  });

  // Detect navigational intent (brand searches)
  if (/\b(site|www|.com|.com.br)\b/.test(query)) {
    scores.navigational++;
  }

  const maxScore = Math.max(...Object.values(scores));
  const intent = Object.entries(scores)
    .find(([_, score]) => score === maxScore)?.[0] as SearchIntent || 'informational';

  return intent;
};

export const getIntentConflictScore = (intent1: SearchIntent, intent2: SearchIntent): number => {
  if (intent1 === intent2) return 1;
  
  // Maior conflito entre intents diferentes
  const conflictMatrix: Record<SearchIntent, Record<SearchIntent, number>> = {
    transactional: {
      informational: 0.8,
      commercial: 0.4,
      navigational: 0.2,
      transactional: 1
    },
    commercial: {
      informational: 0.6,
      transactional: 0.4,
      navigational: 0.3,
      commercial: 1
    },
    informational: {
      transactional: 0.8,
      commercial: 0.6,
      navigational: 0.4,
      informational: 1
    },
    navigational: {
      transactional: 0.2,
      commercial: 0.3,
      informational: 0.4,
      navigational: 1
    }
  };

  return conflictMatrix[intent1][intent2];
};