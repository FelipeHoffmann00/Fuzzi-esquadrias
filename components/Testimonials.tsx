
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

  const handleSwipeCheck = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) onNextClick();
    if (distance < -minSwipeDistance) onPrevClick();
  };

  const isDeleteDisabled = testimonials.length <= 1;

  if (testimonials.length === 0) return null;

  return (
    <div className="pt-8 pb-4 md:pt-32 md:pb-20 relative z-20 select-none overflow-hidden">
      <div className="container mx-auto px-4 max-w-full">
        {/* Cabeçalho */}
        <div className="max-w-7xl mx-auto mb-4 md:mb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6 border border-fuzzi-blue/5 shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuzzi-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuzzi-blue"></span>
              </span>
              Excelência Comprovada
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Quem escolhe <span className="text-fuzzi-blue">Fuzzi</span>, recomenda.
            </h2>
            <p className={`mt-2 text-[14px] md:text-[17px] opacity-60 font-medium leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Veja o que nossos clientes falaram sobre nossos serviços e como transformamos ambientes.
            </p>
          </div>
        </div>

        {/* CONTAINER DOS CARDS */}
        <div 
          className="relative max-w-5xl mx-auto h-[380px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y overflow-visible mb-0"
          onTouchStart={(e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); }}
          onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
          onTouchEnd={() => { handleSwipeCheck(); startTimers(); }}
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
                  onClick={() => position !== "active" && goToSlide(index)}
                  className={`absolute w-full max-w-[290px] md:max-w-md transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border ${
                    position === "active" 
                      ? "z-50 opacity-100 translate-x-0 scale-100 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] blur-0 ring-4 ring-fuzzi-blue/5" 
                      : position === "prev"
                        ? "z-20 opacity-30 -translate-x-[45%] md:-translate-x-[60%] scale-[0.8] blur-sm grayscale pointer-events-none"
                        : position === "next"
                          ? "z-20 opacity-30 translate-x-[45%] md:translate-x-[60%] scale-[0.8] blur-sm grayscale pointer-events-none"
                          : "z-10 opacity-0 scale-50 translate-x-0 pointer-events-none blur-xl"
                  } ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="relative h-36 md:h-52 overflow-hidden">
                      <img 
                        src={testimonial.image || DEFAULT_TESTIMONIAL_IMAGE} 
                        className="w-full h-full object-cover" 
                        alt={testimonial.name}
                        onError={(e) => (e.target as HTMLImageElement).src = DEFAULT_TESTIMONIAL_IMAGE}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-6">
                        <span className="text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] bg-fuzzi-blue/20 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl border border-white/10">
                          {testimonial.service}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-8 flex flex-col items-center text-center flex-grow">
                      <Quote className="w-6 h-6 md:w-8 md:h-8 text-fuzzi-blue opacity-20 mb-2 md:mb-3" />
                      
                      <p className={`text-[13px] md:text-base leading-relaxed italic mb-4 font-medium line-clamp-4 md:line-clamp-none ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        "{testimonial.text}"
                      </p>

                      <div className="w-full mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="text-left">
                          <div className="flex items-center gap-1.5 mb-1">
                            <h4 className={`font-black uppercase tracking-wide text-[9px] md:text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</h4>
                            <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-fuzzi-blue" />
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-2 h-2 md:w-2.5 md:h-2.5 text-fuzzi-blue/60" />
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{testimonial.city}</span>
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {isAdmin && position === "active" && (
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(testimonial); }} className="p-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-fuzzi-blue transition-all border border-white/10"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); !isDeleteDisabled && onDelete(testimonial.id); }} disabled={isDeleteDisabled} className={`p-2 rounded-xl transition-all border ${isDeleteDisabled ? 'bg-slate-500/20 text-slate-400 border-transparent' : 'bg-red-600/20 border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white'}`}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={onPrevClick} className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-slate-900/50 text-white backdrop-blur-md hover:bg-fuzzi-blue transition-all -ml-12"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={onNextClick} className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-slate-900/50 text-white backdrop-blur-md hover:bg-fuzzi-blue transition-all -mr-12"><ChevronRight className="w-8 h-8" /></button>
        </div>

        {/* INDICADORES */}
        <div className="mt-8 max-w-xs mx-auto space-y-2">
          <div className={`h-1 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="h-full bg-fuzzi-blue transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-center items-center gap-3">
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => goToSlide(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-8 bg-fuzzi-blue' : 'w-2 bg-slate-400/20'}`}></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
