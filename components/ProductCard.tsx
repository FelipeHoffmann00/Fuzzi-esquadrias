
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
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name}. Gostaria de solicitar um orçamento.`
  )}`;

  return (
    <div 
      className={`group flex flex-col h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border cursor-pointer transition-all duration-500 will-change-transform hover:-translate-y-2 fix-clipping ${
        theme === 'dark' 
          ? 'bg-slate-900/50 border-slate-800/60 hover:border-fuzzi-blue/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'
      }`}
      onClick={() => onSelect(product)}
    >
      {/* Área da Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 fix-clipping">
        <img 
          src={(product.images && product.images.length > 0) ? product.images[0] : DEFAULT_PRODUCT_IMAGE} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
          }}
        />
        
        {/* Overlay Detalhes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-white/5 border border-white/20 backdrop-blur-md text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full font-black flex items-center gap-1.5 md:gap-2 transform shadow-2xl scale-90 lg:scale-100 lg:translate-y-4 lg:group-hover:translate-y-0">
            <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-fuzzi-blue" /> 
            <span className="text-[9px] md:text-sm tracking-widest uppercase">Detalhes</span>
          </div>
        </div>

        {/* Botões Administrativos */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl bg-white/20 border border-white/20 backdrop-blur-md text-white hover:bg-fuzzi-blue transition-all shadow-lg"
            >
              <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isDeleteDisabled) {
                  alert("A vitrine não pode ficar vazia.");
                  return;
                }
                onDelete(product.id); 
              }}
              className={`p-1.5 md:p-2.5 rounded-lg md:rounded-xl border backdrop-blur-md transition-all shadow-lg ${
                isDeleteDisabled 
                  ? 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed' 
                  : 'bg-white/20 border-white/20 text-white hover:bg-red-600 hover:border-red-600'
              }`}
              disabled={isDeleteDisabled}
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="pt-1.5 px-3 pb-3 md:p-8 flex flex-col flex-1">
        {/* Substituição de categoria por DESTAQUE */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mb-1.5 md:mb-4">
          <span className="flex items-center gap-1.5 text-[8px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-fuzzi-blue/90 bg-fuzzi-blue/10 px-2 py-1 rounded-lg whitespace-nowrap border border-fuzzi-blue/5">
            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
            DESTAQUE
          </span>
        </div>

        <h3 className={`text-xs md:text-2xl font-black mb-2 md:mb-6 transition-colors duration-300 leading-tight group-hover:text-fuzzi-blue line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/btn w-full flex items-center justify-center gap-1.5 md:gap-2 py-2.5 md:py-4 bg-fuzzi-blue text-white font-black rounded-lg md:rounded-2xl transition-all duration-300 shadow-xl shadow-fuzzi-blue/10 hover:bg-[#25D366] hover:shadow-[#25D366]/30 active:scale-95 text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.15em] whitespace-nowrap overflow-hidden"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white fill-current shrink-0" />
            <span className="hidden md:inline">Solicitar </span>
            <span>Orçamento</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
