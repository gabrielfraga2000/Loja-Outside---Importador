import React, { useState, useEffect } from 'react';
import { ProductData } from '../types';
import { Button } from './Button';

interface OrderListProps {
  products: ProductData[];
  onRemove: (index: number) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ products, onRemove }) => {
  // State to hold quantities. Key format: `${productIndex}-${sku}`
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const handleQuantityChange = (productIndex: number, sku: string, value: string) => {
    setQuantities(prev => ({
      ...prev,
      [`${productIndex}-${sku}`]: value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate global total items
  const totalItems = Object.values(quantities).reduce((sum: number, qty: string) => {
      const parsed = parseInt(qty);
      return sum + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  if (products.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Global Controls & Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 print:border-none print:shadow-none print:p-0">
        
        {/* Logo Placeholder for Print */}
        <div className="only-print mb-6 text-center border-b-2 border-black pb-4">
          <div className="text-3xl font-extrabold text-black tracking-wider uppercase">LOJA OUTSIDE</div>
          <p className="text-sm text-gray-600 mt-1">Pedido de Compra</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 print:hidden">Resumo do Pedido</h2>
            <div className="text-sm text-gray-500 print:hidden">{products.length} produto(s) adicionado(s)</div>
          </div>

          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
             <div className="text-right">
                 <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold print:text-black">Total Geral de Peças</div>
                 <div className="text-3xl font-bold text-indigo-600 print:text-black">{totalItems}</div>
             </div>
             
             <div className="no-print">
                <Button onClick={handlePrint} variant="secondary" className="whitespace-nowrap">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir Pedido
                </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-6 print:space-y-8">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden break-inside-avoid print:border print:border-black print:shadow-none">
            
            {/* Product Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-start gap-6 print:bg-gray-100 print:border-black">
              
              <div className="flex gap-4 items-center">
                 {/* Product Image */}
                 {product.imagem ? (
                   <div className="flex-shrink-0 w-20 h-20 rounded-md border border-gray-200 overflow-hidden bg-white print:w-16 print:h-16 print:border-black">
                      <img src={product.imagem} alt={product.nome} className="w-full h-full object-cover" />
                   </div>
                 ) : (
                    <div className="flex-shrink-0 w-20 h-20 rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center print:border-black">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                 )}

                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-mono text-gray-400 print:text-black">Item #{index + 1}</span>
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide print:border print:border-black print:text-black ${
                        product.tipo === 'simples' ? 'bg-blue-100 text-blue-800' : 
                        product.tipo === 'composicao' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                     }`}>
                        {product.tipo}
                     </span>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 print:text-black leading-tight">{product.nome}</h3>
                   {product.referenciaPai && (
                     <p className="text-sm text-gray-500 mt-1 print:text-black font-mono">
                       Ref: <strong>{product.referenciaPai}</strong>
                     </p>
                   )}
                 </div>
              </div>
              
              <button 
                onClick={() => onRemove(index)}
                className="no-print text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Remover produto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto print:overflow-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-white">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold border-r border-gray-100 print:border-black">Ref (SKU)</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold border-r border-gray-100 print:border-black">Tamanho</th>
                    <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider print:text-black print:font-bold border-r border-gray-100 print:border-black w-32">Estoque</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 print:text-black print:font-bold">Qtd Pedido</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 print:divide-black">
                  {product.variacoes.map((item, vIndex) => {
                    const uniqueKey = `${index}-${item.referencia || vIndex}`;
                    const qty = quantities[uniqueKey] || '';
                    
                    return (
                      <tr key={uniqueKey} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-gray-600 print:text-black border-r border-gray-100 print:border-black">
                          {item.referencia || "N/A"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 print:text-black border-r border-gray-100 print:border-black">
                          {item.tamanho}
                        </td>
                         <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-500 text-center print:text-black border-r border-gray-100 print:border-black bg-gray-50 print:bg-white">
                          {item.estoque !== null ? item.estoque : '-'}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border print:border-none print:text-right print:p-0 print:font-bold"
                            placeholder="0"
                            value={qty}
                            onChange={(e) => handleQuantityChange(index, item.referencia || String(vIndex), e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {product.variacoes.length === 0 && (
                 <div className="p-4 text-center text-gray-500 text-sm">Sem variações disponíveis.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
