
import React, { useState, useMemo } from 'react';
import { Product, Theme } from '../types';
import ProductCard from './ProductCard';
import { Filter } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  theme: Theme;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSelect: (product: Product) => void;
  isAdmin: boolean;
}

const CATEGORIES = ['Todas', 'Janelas', 'Portas', 'Portões', 'Acessórios'];

const ProductGrid: React.FC<ProductGridProps> = ({ products, theme, onEdit, onDelete, onSelect, isAdmin }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todas') return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-2 md:gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border ${
                selectedCategory === category
                  ? 'bg-fuzzi-blue text-white border-fuzzi-blue shadow-lg shadow-fuzzi-blue/20 scale-105'
                  : theme === 'dark'
                  ? 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className={`hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
           <Filter className="w-3 h-3" />
           Filtrando {filteredProducts.length} itens
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={`text-center py-24 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-colors ${
          theme === 'dark' ? 'border-slate-800 text-slate-600 bg-slate-900/20' : 'border-slate-100 text-slate-400 bg-slate-50'
        }`}>
          <div className="p-4 bg-fuzzi-blue/10 rounded-full">
            <Filter className="w-8 h-8 text-fuzzi-blue/50" />
          </div>
          <div>
            <p className="text-xl font-bold">Nenhum produto nesta categoria.</p>
            <p className="text-sm">Tente selecionar outra categoria ou confira em breve.</p>
          </div>
          <button 
            onClick={() => setSelectedCategory('Todas')}
            className="mt-2 text-fuzzi-blue font-black uppercase tracking-widest text-xs hover:underline"
          >
            Ver tudo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              theme={theme} 
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
              isAdmin={isAdmin}
              isDeleteDisabled={products.length <= 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
