
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Star, Quote, MapPin, CheckCircle, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Theme, Testimonial } from '../types';
import { DEFAULT_TESTIMONIAL_IMAGE } from '../constants';

interface TestimonialsProps {
  theme: Theme;
  testimonials: Testimonial[];
  isAdmin: boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string) => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ theme, testimonials, isAdmin, onEdit, onDelete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoPlayRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  // Estados para controle do Swipe (Toque e Mouse)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  
  const SLIDE_DURATION = 16000; 

  const handleNext = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setProgress(0);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgress(0);
  }, [testimonials.length]);

  const startTimers = useCallback(() => {
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);

    if (testimonials.length > 0) {
      autoPlayRef.current = window.setInterval(handleNext, SLIDE_DURATION);

      const step = 30;
      progressIntervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const next = prev + (step / SLIDE_DURATION) * 100;
          return next >= 100 ? 0 : next;
        });
      }, step);
    }
  }, [handleNext, SLIDE_DURATION, testimonials.length]);

  useEffect(() => {
    startTimers();
    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
      if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
    };
  }, [startTimers]);

  useEffect(() => {
    if (activeIndex >= testimonials.length && testimonials.length > 0) {
      setActiveIndex(0);
      setProgress(0);
    }
  }, [testimonials.length, activeIndex]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    startTimers();
  };

  const onNextClick = () => {
    handleNext();
    startTimers();
  };

  const onPrevClick = () => {
    handlePrev();
    startTimers();
  };

  // --- Lógica de Swipe ---

  const handleSwipeCheck = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNextClick();
    }
    if (isRightSwipe) {
      onPrevClick();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    // Pausar o timer enquanto segura
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    handleSwipeCheck();
    startTimers();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    handleSwipeCheck();
    setTouchStart(null);
    setTouchEnd(null);
    startTimers();
  };

  const onMouseLeave = () => {
    if (touchStart !== null) {
       setTouchStart(null);
       setTouchEnd(null);
       startTimers();
    }
  };

  const isDeleteDisabled = testimonials.length <= 1;

  if (testimonials.length === 0) return null;

  return (
    <section className="py-10 md:py-20 relative overflow-hidden select-none">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            Excelência Comprovada
          </div>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Quem escolhe <span className="text-fuzzi-blue">Fuzzi</span>,<br />recomenda.
          </h2>
        </div>

        <div 
          className="relative max-w-6xl mx-auto h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {testimonials.map((testimonial, index) => {
              const total = testimonials.length;
              let position = "hidden";
              
              if (index === activeIndex) position = "active";
              else if (total > 1 && index === (activeIndex - 1 + total) % total) position = "prev";
              else if (total > 2 && index === (activeIndex + 1) % total) position = "next";

              return (
                <div
                  key={testimonial.id}
                  onClick={() => {
                     // Permite clicar nos cards laterais para navegar, se não houver arraste
                     if (!touchEnd && position !== "active") goToSlide(index);
                  }}
                  className={`absolute w-full max-w-lg transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer rounded-[2.5rem] overflow-hidden border ${
                    position === "active" 
                      ? "z-50 opacity-100 translate-x-0 scale-100 shadow-[0_30px_60px_-15px_rgba(0,0,255,0.15)] blur-0" 
                      : position === "prev"
                        ? "z-20 opacity-30 -translate-x-[40%] md:-translate-x-[55%] scale-[0.85] blur-md grayscale"
                        : position === "next"
                          ? "z-20 opacity-30 translate-x-[40%] md:translate-x-[55%] scale-[0.85] blur-md grayscale"
                          : "z-10 opacity-0 scale-50 translate-x-0 pointer-events-none blur-xl"
                  } ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col h-full relative">
                    {/* Botões Admin */}
                    {isAdmin && position === "active" && (
                      <div className="absolute top-4 right-4 flex gap-2 z-[150] pointer-events-auto">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onEdit(testimonial); }} 
                          className="p-3 bg-white text-fuzzi-blue rounded-2xl hover:bg-fuzzi-blue hover:text-white transition-all shadow-2xl active:scale-90 border border-fuzzi-blue/10"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (isDeleteDisabled) {
                              alert("A vitrine precisa de pelo menos um depoimento para ser exibida.");
                              return;
                            }
                            onDelete(testimonial.id); 
                          }} 
                          disabled={isDeleteDisabled}
                          className={`p-3 rounded-2xl transition-all shadow-2xl border ${
                            isDeleteDisabled 
                              ? 'bg-slate-200 text-slate-400 border-transparent cursor-not-allowed' 
                              : 'bg-red-600 text-white hover:bg-red-700 active:scale-90 border-red-500'
                          }`}
                          title={isDeleteDisabled ? "Não é possível excluir o único depoimento" : "Excluir Depoimento"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <div className="relative h-60 overflow-hidden pointer-events-none">
                      <img 
                        src={testimonial.image || DEFAULT_TESTIMONIAL_IMAGE} 
                        className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${position === 'active' ? 'scale-105' : 'scale-100'}`} 
                        alt={testimonial.name}
                        onError={(e) => (e.target as HTMLImageElement).src = DEFAULT_TESTIMONIAL_IMAGE}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <span className="text-white text-[9px] font-black uppercase tracking-[0.15em] bg-fuzzi-blue/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10">
                          {testimonial.service}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col items-center text-center pointer-events-none">
                      <Quote className="w-8 h-8 text-fuzzi-blue opacity-10 mb-4" />
                      <p className={`text-lg md:text-xl leading-snug italic mb-6 font-medium tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        "{testimonial.text}"
                      </p>

                      <div className="w-full flex items-center justify-between mt-auto pt-6 border-t border-slate-800/10 dark:border-white/5">
                        <div className="text-left">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className={`font-black uppercase tracking-wide text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</h4>
                            <CheckCircle className="w-3.5 h-3.5 text-fuzzi-blue" />
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3 text-fuzzi-blue/60" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{testimonial.city}</span>
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SETAS DE NAVEGAÇÃO (Apenas Desktop) */}
          <button
            onClick={onPrevClick}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full backdrop-blur-sm transition-all shadow-lg border active:scale-95 -ml-5 lg:-ml-12 ${
               theme === 'dark' 
                 ? 'bg-slate-800/50 text-white border-slate-700 hover:bg-fuzzi-blue hover:border-fuzzi-blue' 
                 : 'bg-white/50 text-fuzzi-blue border-white/50 hover:bg-fuzzi-blue hover:text-white'
            }`}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={onNextClick}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full backdrop-blur-sm transition-all shadow-lg border active:scale-95 -mr-5 lg:-mr-12 ${
               theme === 'dark' 
                 ? 'bg-slate-800/50 text-white border-slate-700 hover:bg-fuzzi-blue hover:border-fuzzi-blue' 
                 : 'bg-white/50 text-fuzzi-blue border-white/50 hover:bg-fuzzi-blue hover:text-white'
            }`}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        <div className="mt-8 md:mt-12 max-w-xs mx-auto space-y-4">
          <div className={`h-1 w-full rounded-full overflow-hidden transition-theme ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div 
              className="h-full bg-fuzzi-blue transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(0,207,255,0.4)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-center items-center gap-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeIndex === idx ? 'w-10 bg-fuzzi-blue' : 'w-2.5 bg-slate-400/20 hover:bg-fuzzi-blue/30'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
