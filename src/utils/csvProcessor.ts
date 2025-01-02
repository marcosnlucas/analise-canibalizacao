import Papa from 'papaparse';
import { GSCData } from '../types';
import { analyzeSearchIntent } from './searchIntentAnalyzer';

interface CSVRow {
  'Landing Page': string;
  'Query': string;
  'Clicks': string;
  'Impressions': string;
  'CTR': string;
  'Position': string;
}

export const validateAndParseCSV = (file: File): Promise<GSCData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Validar colunas
          const requiredColumns = [
            'Landing Page',
            'Query',
            'Clicks',
            'Impressions',
            'CTR',
            'Position'
          ];
          
          const headers = results.meta.fields || [];
          const missingColumns = requiredColumns.filter(
            col => !headers.includes(col)
          );

          if (missingColumns.length > 0) {
            throw new Error(
              `Colunas obrigatórias faltando: ${missingColumns.join(', ')}`
            );
          }

          // Processar e validar dados
          const processedData: GSCData[] = results.data
            .filter(row => row['Landing Page'] && !row['Landing Page'].includes('#'))
            .map(row => {
              const clicks = parseInt(row['Clicks']);
              const impressions = parseInt(row['Impressions']);
              const position = parseFloat(row['Position']);

              if (isNaN(clicks) || isNaN(impressions) || isNaN(position)) {
                throw new Error(
                  `Dados inválidos na linha com URL: ${row['Landing Page']}`
                );
              }

              return {
                landingPage: row['Landing Page'],
                query: row['Query'],
                urlClicks: clicks,
                impressions: impressions,
                averagePosition: position,
                searchIntent: analyzeSearchIntent(row['Query'])
              };
            });

          resolve(processedData);
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Erro ao processar CSV'));
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao ler arquivo CSV: ${error.message}`));
      }
    });
  });
};