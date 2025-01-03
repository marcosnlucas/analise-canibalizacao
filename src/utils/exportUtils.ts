import { AnalysisResult } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

interface ExportRow {
  url: string;
  similarUrls: string;
  sharedKeywords: string;
  queries: string;
  urlClicks: number;
  impressions: number;
  averagePosition: number;
  cannibalizationScore: number;
  searchIntent: string;
  recommendations: string;
}

export const exportToCSV = (results: AnalysisResult[]) => {
  const rows: ExportRow[] = results.map(result => ({
    url: result.landingPage,
    similarUrls: result.similarUrls.join(', '),
    sharedKeywords: result.sharedKeywords.join(', '),
    queries: result.queries.join(', '),
    urlClicks: result.urlClicks,
    impressions: result.impressions,
    averagePosition: result.averagePosition,
    cannibalizationScore: result.cannibalizationScore,
    searchIntent: result.searchIntent,
    recommendations: result.recommendations.join('; ')
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  
  link.href = URL.createObjectURL(blob);
  link.download = `canibalizacao-analise-${date}.csv`;
  link.click();
};

export const exportToPDF = (results: AnalysisResult[]) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Título
  doc.setFontSize(20);
  doc.text('Relatório de Análise de Canibalização', 14, 20);
  doc.setFontSize(12);
  doc.text(`Data: ${date}`, 14, 30);

  // Resumo
  doc.setFontSize(16);
  doc.text('Resumo', 14, 45);
  doc.setFontSize(12);
  doc.text(`Total de URLs analisadas: ${results.length}`, 14, 55);

  // Tabela de resultados
  const tableData = results.map(result => [
    result.landingPage,
    result.cannibalizationScore.toFixed(2),
    result.queries.length.toString(),
    result.similarUrls.length.toString(),
    result.recommendations[0] || ''
  ]);

  doc.autoTable({
    startY: 65,
    head: [['URL', 'Score', 'Queries', 'URLs Similares', 'Principal Recomendação']],
    body: tableData,
    headStyles: { fillColor: [66, 66, 66] },
    styles: { overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 65 }
    }
  });

  // Salvar PDF
  const fileName = `canibalizacao-relatorio-${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
