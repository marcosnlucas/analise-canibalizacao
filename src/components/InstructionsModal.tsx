import React from 'react';
import { X } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-purple-600">Instruções de Uso</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Configuração do Looker Studio</h3>
            <div className="space-y-4">
              <p>Para gerar o arquivo CSV necessário para a análise, configure seu relatório no Looker Studio com as seguintes colunas:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Query:</strong> A consulta/palavra-chave</li>
                <li><strong>Landing Page:</strong> URL da página de destino</li>
                <li><strong>Clicks:</strong> Número de cliques</li>
                <li><strong>Impressions:</strong> Número de impressões</li>
                <li><strong>Position:</strong> Posição média</li>
                <li><strong>CTR:</strong> Taxa de cliques</li>
              </ul>
              <p className="text-gray-600 italic">Dica: Aplique filtros relevantes no Looker Studio antes de exportar os dados para focar sua análise.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Configurações de Análise</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">Mínimo de Queries Diferentes</h4>
                <p>Define o número mínimo de consultas diferentes que uma página deve ter para ser considerada na análise de canibalização. Um valor maior ajuda a identificar páginas que realmente competem por múltiplos termos.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-lg">Similaridade Mínima</h4>
                <p>Determina o quão parecidas duas queries precisam ser para serem consideradas relacionadas. Um valor de 0.7 (70%) significa que as palavras-chave precisam ter 70% de similaridade para serem agrupadas.</p>
              </div>

              <div>
                <h4 className="font-medium text-lg">Fatores de Pontuação</h4>
                <p>Os quatro fatores abaixo são usados para calcular o score de canibalização:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Conflito de Intenção:</strong> Avalia o quanto as páginas estão competindo pela mesma intenção de busca. 
                    Quanto maior a similaridade entre as queries que cada página recebe, maior o conflito.
                  </li>
                  <li>
                    <strong>Sobreposição de Posição:</strong> Analisa a variação de posicionamento das páginas para as mesmas queries. 
                    Páginas que alternam posições frequentemente indicam forte canibalização.
                  </li>
                  <li>
                    <strong>Impacto no Tráfego:</strong> Considera o volume total de cliques e impressões afetados pelo conflito. 
                    Quanto maior o tráfego envolvido, mais prioritária é a resolução.
                  </li>
                  <li>
                    <strong>Sobreposição de Keywords:</strong> Mede a quantidade de palavras-chave que se sobrepõem entre as páginas. 
                    Uma alta sobreposição sugere que as páginas estão muito similares em termos de conteúdo.
                  </li>
                </ul>
                <p className="mt-4 text-gray-600">
                  Cada fator contribui para o score final, que varia de 0 a 100. Os pesos podem ser ajustados usando os controles 
                  deslizantes na interface principal para adequar a análise às suas necessidades específicas.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Interpretando os Resultados</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">Score de Canibalização</h4>
                <p>
                  O score é calculado considerando os fatores acima, onde cada fator individual varia de 0 a 1, 
                  mas o score final pode ultrapassar 1.0 devido à ponderação dos fatores. Quanto maior o score, 
                  mais prioritária é a resolução do conflito. O cálculo considera:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Quantidade de queries afetadas</li>
                  <li>Volume de tráfego impactado</li>
                  <li>Diferença de performance entre as páginas</li>
                  <li>Potencial de melhoria baseado na sobreposição</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-lg">Priorização de Ações</h4>
                <p>Recomendamos priorizar casos onde:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>O score é alto (&gt; 0.7)</li>
                  <li>Há grande volume de cliques envolvido</li>
                  <li>Existe diferença significativa de posicionamento entre as páginas</li>
                  <li>As queries têm alta similaridade (&gt; 0.8)</li>
                </ul>
                <p className="mt-4 text-gray-600">
                  Nota: Scores acima de 0.7 são destacados em vermelho na interface, indicando alta prioridade de ação.
                  É comum que a maioria dos scores fique abaixo de 1.0, mas alguns casos podem ultrapassar esse valor 
                  devido à soma ponderada dos fatores. Por exemplo, se vários fatores tiverem valores altos e pesos 
                  significativos, o score pode chegar a 3.5 ou mais, indicando uma situação extremamente crítica 
                  de canibalização.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-lg">Visualização de Dados</h4>
                <p>Os resultados incluem:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>Tabela de Conflitos:</strong> Lista detalhada de páginas que competem entre si</li>
                  <li><strong>Métricas Comparativas:</strong> Dados de performance de cada página para as queries afetadas</li>
                  <li><strong>Gráficos:</strong> Visualização da distribuição de queries e performance</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
