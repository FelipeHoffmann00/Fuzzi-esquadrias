
import React, { useState, useEffect } from 'react';
import { X, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  // Estados para controle do Swipe (Toque e Mouse)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const images = (product.images && product.images.length > 0) ? product.images : [DEFAULT_PRODUCT_IMAGE];
  const minSwipeDistance = 50; // Distância mínima para considerar um swipe

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

  // --- Navegação ---
  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // --- Lógica de Swipe (Unificada) ---

  const handleSwipeCheck = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  // Touch Events (Celular)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    handleSwipeCheck();
  };

  // Mouse Events (Desktop - Simulação)
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    // Só atualiza se estiver clicando (arrastando)
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    handleSwipeCheck();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onMouseLeave = () => {
    // Se sair da área da imagem, cancela o arraste
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div 
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/90 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* 
          CONTAINER PRINCIPAL - Layout Vertical Fixo
      */}
      <div 
        className={`relative w-full max-w-xl h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        } ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- ÁREA DA IMAGEM (PRIORIDADE - 65% da Altura) --- */}
        <div 
          className="w-full h-[65%] relative flex flex-col justify-center overflow-hidden bg-black/5 touch-pan-y cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          
          {/* Botão Fechar Flutuante */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-red-600 transition-all duration-200 active:scale-90 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge de Destaque */}
          {product.featured && (
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2 pointer-events-none">
              <Star className="w-3 h-3 fill-current" /> Destaque
            </div>
          )}

          {/* SETAS DE NAVEGAÇÃO (Apenas Desktop) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all border border-white/10 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handleNext}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all border border-white/10 active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* CARROSSEL DESLIZANTE */}
          <div 
            className="flex h-full items-center transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeImage * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center p-0 relative">
                <img 
                  src={img} 
                  alt={`${product.name} - Foto ${index + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none" 
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Dots de Navegação */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                    activeImage === idx ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- ÁREA DE INFORMAÇÕES (SECUNDÁRIA - 35% da Altura) --- */}
        <div className="w-full h-[35%] flex flex-col relative z-10 -mt-6 bg-inherit rounded-t-[2rem]">
           {/* Puxador visual (apenas estético) */}
           <div className="w-full flex justify-center pt-3 pb-1">
             <div className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
           </div>

          <div className={`flex-1 overflow-y-auto px-6 pb-4 pt-2 custom-scrollbar ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-xl md:text-2xl font-black leading-tight">
                {product.name}
              </h2>
              <span className="shrink-0 px-2 py-1 rounded-lg bg-fuzzi-blue/10 text-fuzzi-blue text-[9px] font-black uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {product.description}
              </p>
            </div>

            {/* Thumbnails Pequenos */}
            {images.length > 1 && (
               <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-10 h-10 shrink-0 rounded-lg overflow-hidden border transition-all ${
                        activeImage === idx ? 'border-fuzzi-blue opacity-100 ring-1 ring-fuzzi-blue' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
               </div>
            )}
          </div>

          {/* Footer com Botão */}
          <div className={`p-4 border-t mt-auto ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-fuzzi-blue hover:bg-[#25D366] text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20 active:scale-95 group uppercase tracking-widest"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
