import React, { useState } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { OrderList } from './components/OrderTable'; 
import { parseProductUrl } from './services/geminiService';
import { ProductData } from './types';

function App() {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [products, setProducts] = useState<ProductData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!inputValue.trim()) {
      setError(`Por favor, insira uma URL válida.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await parseProductUrl(inputValue);
      
      // Append new product to list
      setProducts(prev => [...prev, data]);
      setInputValue(''); // Clear input on success for better UX
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetOrder = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o pedido?")) {
      setProducts([]);
      setError(null);
    }
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    setProducts(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col print:bg-white">
      <div className="no-print">
        <Header />
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:w-full print:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full print:block">
          
          {/* Left Column: Input (Hidden in Print) - Takes 4/12 columns on large screens */}
          <div className="lg:col-span-4 flex flex-col gap-4 no-print">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col sticky top-4">
              
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-700">Importar Produto</h2>
              </div>

              <div className="p-4 flex flex-col">
                <label htmlFor="input-field" className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  URL do Produto
                </label>
                
                <input
                  id="input-field"
                  type="url"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 border mb-3"
                  placeholder="https://www.lojaoutside.com.br/produto..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                />

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={handleExtract} 
                    isLoading={isLoading} 
                    className="w-full justify-center"
                  >
                    {isLoading ? 'Analisando...' : 'Adicionar à Lista'}
                  </Button>
                  
                  {products.length > 0 && (
                    <button 
                      onClick={handleResetOrder}
                      className="text-xs text-red-600 hover:text-red-800 underline mt-2 self-center"
                    >
                      Limpar lista e começar novo pedido
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
               <h4 className="text-sm font-semibold text-blue-900 mb-2">Instruções</h4>
               <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                 <li>Copie a URL de um produto do site Loja Outside.</li>
                 <li>Cole no campo acima e clique em Adicionar.</li>
                 <li>O sistema irá ler o estoque e as variações automaticamente.</li>
                 <li>Após montar a lista, clique em "Imprimir Pedido".</li>
               </ul>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-medium text-red-800 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Erro ao processar
                  </h3>
                  <p className="mt-1 text-xs text-red-700 leading-relaxed">{error}</p>
                </div>
             )}
          </div>

          {/* Right Column: Order List - Takes 8/12 columns */}
          <div className="lg:col-span-8 flex flex-col print-container">
             {products.length > 0 ? (
               <OrderList products={products} onRemove={handleRemoveProduct} />
             ) : (
               <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-12 text-center h-full flex flex-col justify-center items-center min-h-[400px] no-print">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <svg className="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Seu pedido está vazio</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-sm">
                    Cole a URL de um produto ao lado para começar.
                  </p>
               </div>
             )}
          </div>

        </div>
      </main>
      
      <div className="no-print">
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
            Powered by Google Gemini API
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
