import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        console.log('Arquivo selecionado:', file.name);
        onFileSelect(file);
      } else {
        console.error('Tipo de arquivo inválido:', file.type);
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-purple-500 mb-4" />
      {isDragActive ? (
        <p className="text-lg text-purple-600">Solte o arquivo aqui...</p>
      ) : (
        <div>
          <p className="text-lg text-gray-600 mb-2">
            Arraste e solte o arquivo CSV aqui, ou clique para selecionar
          </p>
          <p className="text-sm text-gray-500">
            Apenas arquivos CSV exportados do Looker Studio são aceitos
          </p>
        </div>
      )}
    </div>
  );
};