import React from 'react';

interface AnalyzeButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      type="button"
      style={{
        width: '100%',
        backgroundColor: '#9333ea',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '1.125rem',
        fontWeight: 500,
        opacity: 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background-color 200ms',
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = '#7e22ce';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = '#9333ea';
        }
      }}
    >
      {loading ? 'Processando...' : 'Realizar Análise'}
    </button>
  );
};
