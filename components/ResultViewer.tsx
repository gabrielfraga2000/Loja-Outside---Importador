import React from 'react';
import { ProductData, ProductType } from '../types';

interface ResultViewerProps {
  data: ProductData | null;
  error: string | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ data, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Extraction Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data yet</h3>
        <p className="mt-1 text-sm text-gray-500">Paste HTML code and click "Extract Data" to see results.</p>
      </div>
    );
  }

  const isUnknown = data.tipo === ProductType.UNKNOWN;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className={`rounded-lg border p-4 shadow-sm ${isUnknown ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Product Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</span>
            <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.tipo === ProductType.SIMPLES ? 'bg-blue-100 text-blue-800' : 
                    data.tipo === ProductType.COMPOSICAO ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {data.tipo}
                </span>
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</span>
            <p className="mt-1 text-sm font-medium text-gray-900">{data.nome}</p>
          </div>
        </div>
      </div>

      {/* Variations Table */}
      {data.variacoes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Variations Grid</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size (Tamanho)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference (SKU)</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.variacoes.map((v, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.tamanho}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{v.referencia}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      )}

      {/* JSON Output */}
      <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs font-mono text-gray-400">JSON Result</span>
          <button 
            onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Copy JSON
          </button>
        </div>
        <pre className="p-4 text-xs sm:text-sm text-green-400 font-mono overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};
