
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { Product, Theme } from '../types';
import { WHATSAPP_NUMBER, DEFAULT_PRODUCT_IMAGE } from '../constants';

interface ProductDetailProps {
  product: Product;
  theme: Theme;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, theme, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const images = (product.images && product.images.length > 0) ? product.images : [DEFAULT_PRODUCT_IMAGE];

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const productUrl = window.location.href; 
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name}. Gostaria de solicitar um orçamento.`
  )}`;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/90 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* 
          CONTAINER PRINCIPAL
      */}
      <div 
        className={`relative w-full max-w-7xl h-[85vh] flex flex-col lg:flex-row items-center gap-8 lg:gap-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- COLUNA ESQUERDA: IMAGEM (60% Desktop) --- */}
        <div className="w-full lg:w-[60%] h-[40vh] lg:h-full relative flex flex-col justify-center overflow-hidden order-2 lg:order-1">
          
          {/* Badge de Destaque */}
          {product.featured && (
            <div className="absolute top-0 left-0 z-20 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
              <Star className="w-3 h-3 fill-current" /> Destaque
            </div>
          )}

          {/* CARROSSEL DESLIZANTE */}
          <div 
            className="flex h-full items-center transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeImage * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center p-4 relative">
                <img 
                  src={img} 
                  alt={`${product.name} - Foto ${index + 1}`}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* SETAS FIXAS DE NAVEGAÇÃO */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-90 z-20 border border-white/10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-90 z-20 border border-white/10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-20 pb-4">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
                      activeImage === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* --- COLUNA DIREITA: INFORMAÇÕES (40% Desktop) --- */}
        <div className={`
            relative w-full lg:w-[40%] h-full flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden order-1 lg:order-2
            ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}
        `}>
           {/* Botão Fechar dentro do Card */}
          <button 
            onClick={handleClose}
            className={`absolute top-6 right-6 z-50 p-2 rounded-full transition-all duration-200 active:scale-90 ${
                theme === 'dark' 
                ? 'bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white' 
                : 'bg-slate-100 text-slate-500 hover:bg-red-500 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            
            <span className="inline-block px-3 py-1 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-widest mb-4">
              {product.category}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-6 pr-8">
              {product.name}
            </h2>
            
            <div className="h-1 w-20 bg-fuzzi-blue rounded-full mb-8"></div>

            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-4">
                Sobre o Projeto
              </h3>
              <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {product.description}
              </p>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-8 pt-8 border-t border-inherit opacity-50 hover:opacity-100 transition-opacity">
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-70">Galeria</h4>
                 <div className="flex gap-2 flex-wrap">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === idx ? 'border-fuzzi-blue opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* Footer Fixo */}
          <div className={`p-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="space-y-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 bg-fuzzi-blue hover:bg-[#25D366] text-white font-black text-base rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 active:scale-95 group uppercase tracking-widest"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                Solicitar Orçamento
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
