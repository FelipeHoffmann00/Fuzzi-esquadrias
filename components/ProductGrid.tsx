
import React from 'react';
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

const ProductGrid: React.FC<ProductGridProps> = ({ products, theme, onEdit, onDelete, onSelect, isAdmin }) => {
  return (
    <div className="space-y-6">
      {products.length === 0 ? (
        <div className={`text-center py-24 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-colors ${
          theme === 'dark' ? 'border-slate-800 text-slate-600 bg-slate-900/20' : 'border-slate-100 text-slate-400 bg-slate-50'
        }`}>
          <div className="p-4 bg-fuzzi-blue/10 rounded-full">
            <Filter className="w-8 h-8 text-fuzzi-blue/50" />
          </div>
          <div>
            <p className="text-xl font-bold">Nenhum destaque cadastrado.</p>
            <p className="text-sm">Confira em breve novas atualizações em nossa vitrine.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {products.map(product => (
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
