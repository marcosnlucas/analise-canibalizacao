import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { AnalysisResult } from '../types';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const columnHelper = createColumnHelper<AnalysisResult>();

const columns = [
  columnHelper.accessor('landingPage', {
    header: 'URL da Página',
    cell: info => (
      <div className="max-w-[200px] truncate" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('cannibalizationScore', {
    header: 'Score',
    cell: info => {
      const score = info.getValue();
      const color = score > 0.7 ? 'text-red-600' : score > 0.4 ? 'text-yellow-600' : 'text-green-600';
      const bgColor = score > 0.7 ? 'bg-red-50' : score > 0.4 ? 'bg-yellow-50' : 'bg-green-50';
      return (
        <div className={`font-semibold ${color} ${bgColor} rounded-full px-3 py-1 inline-flex items-center`}>
          {score > 0.7 && <AlertTriangle className="inline h-4 w-4 mr-1" />}
          {score.toFixed(2)}
        </div>
      );
    },
  }),
  columnHelper.accessor('searchIntent', {
    header: 'Intenção de Busca',
    cell: info => (
      <div className="w-32">
        <span className="capitalize">{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('similarUrls', {
    header: 'URLs Similares',
    cell: info => (
      <div className="max-w-[250px]">
        {info.getValue().slice(0, 2).map((url, i) => (
          <div key={i} className="truncate text-sm" title={url}>{url}</div>
        ))}
        {info.getValue().length > 2 && (
          <span className="text-sm text-gray-500">
            +{info.getValue().length - 2} mais
          </span>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('sharedKeywords', {
    header: 'Keywords Principais',
    cell: info => (
      <div className="max-w-[250px] flex flex-wrap gap-1">
        {info.getValue().slice(0, 3).map((keyword, i) => (
          <span key={i} className="inline-block bg-gray-100 rounded px-2 py-1 text-sm" title={keyword}>
            {keyword}
          </span>
        ))}
        {info.getValue().length > 3 && (
          <span className="text-sm text-gray-500">
            +{info.getValue().length - 3} mais
          </span>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('recommendations', {
    header: 'Recomendações',
    cell: info => (
      <div className="max-w-[300px] text-sm whitespace-normal break-words">
        {info.getValue()[0]}
      </div>
    ),
  }),
];

interface ResultsTableProps {
  data: AnalysisResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};