
import React from 'react';
import { Edit3, Trash2, Maximize2, Star } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { Product, Theme } from '../types';
import { WHATSAPP_NUMBER, DEFAULT_PRODUCT_IMAGE } from '../constants';

interface ProductCardProps {
  product: Product;
  theme: Theme;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSelect: (product: Product) => void;
  isAdmin: boolean;
  isDeleteDisabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, theme, onEdit, onDelete, onSelect, isAdmin, isDeleteDisabled }) => {
  const productUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name} (${productUrl}). Gostaria de solicitar um orçamento.`
  )}`;

  return (
    <div 
      className={`group flex flex-col h-full rounded-[1.2rem] md:rounded-[2rem] overflow-hidden border cursor-pointer transition-all duration-500 will-change-transform hover:-translate-y-2 fix-clipping ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800 hover:border-fuzzi-blue/50 shadow-2xl shadow-black/30' 
          : 'bg-white border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]'
      }`}
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 fix-clipping">
        <img 
          src={(product.images && product.images.length > 0) ? product.images[0] : DEFAULT_PRODUCT_IMAGE} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
        
        <div className="absolute inset-0 bg-black/40 lg:bg-black/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm text-fuzzi-gray px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold flex items-center gap-2 transform lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300 shadow-lg scale-90 lg:scale-100">
            <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-fuzzi-blue" /> <span className="text-[9px] md:text-sm">Ver Detalhes</span>
          </div>
        </div>

        {/* Badge Destaque: Apenas Desktop */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 hidden md:flex flex-col gap-2 z-10">
          {product.featured && (
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 w-fit">
              <Star className="w-3 h-3 fill-current" /> Destaque
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-1 md:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              className="p-1 md:p-2 rounded-lg md:rounded-xl bg-white/90 text-fuzzi-blue hover:bg-fuzzi-blue hover:text-white transition-colors duration-200 shadow-md"
            >
              <Edit3 className="w-3 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isDeleteDisabled) {
                  alert("Este é o único produto em destaque. A vitrine não pode ficar vazia.");
                  return;
                }
                onDelete(product.id); 
              }}
              className={`p-1 md:p-2 rounded-lg md:rounded-xl transition-colors duration-200 shadow-md ${
                isDeleteDisabled 
                  ? 'bg-slate-300/90 text-slate-500 cursor-not-allowed' 
                  : 'bg-white/90 text-red-600 hover:bg-red-600 hover:text-white'
              }`}
              title={isDeleteDisabled ? "Não é possível excluir o único destaque" : "Excluir Produto"}
              disabled={isDeleteDisabled}
            >
              <Trash2 className="w-3 md:w-4 md:h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-3 md:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-0.5 md:mb-2">
          <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-fuzzi-blue">{product.category}</span>
          
          {/* Indicador Destaque: Apenas Mobile */}
          {product.featured && (
            <div className="md:hidden flex items-center gap-1 text-[7px] font-black uppercase tracking-widest text-amber-500">
              <Star className="w-2 h-2 fill-current" /> Destaque
            </div>
          )}
        </div>

        <h3 className={`text-sm md:text-xl font-black mb-2 md:mb-6 transition-colors duration-300 leading-tight group-hover:text-fuzzi-blue line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/btn w-full flex items-center justify-center gap-1 py-2 md:py-4 bg-fuzzi-blue hover:bg-[#25D366] text-white font-black rounded-lg md:rounded-xl transition-[background-color,transform,shadow] duration-200 shadow-lg hover:shadow-[#25D366]/30 active:scale-95 text-[9px] md:text-sm uppercase tracking-normal md:tracking-wider whitespace-nowrap"
          >
            <WhatsAppIcon className="w-3 h-3 md:w-4 md:h-4 transition-colors text-white" fill="currentColor" />
            Solicitar Orçamento
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
