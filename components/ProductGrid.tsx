import React from 'react';
import { Product, Theme } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  theme: Theme;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSelect: (product: Product) => void;
  isAdmin: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, theme, onEdit, onDelete, onSelect, isAdmin }) => {
  if (products.length === 0) {
    return (
      <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-blue-100 text-blue-300'}`}>
        <p className="text-xl">Nenhum produto cadastrado no momento.</p>
      </div>
    );
  }

  return (
    <div id="catalogo" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          theme={theme} 
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default ProductGrid;