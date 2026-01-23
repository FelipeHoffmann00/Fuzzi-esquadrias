
import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, PlusCircle, Home, FileText, ChevronDown, ShoppingCart, MessageSquare, BookOpen, LayoutGrid, ShieldCheck, Award } from 'lucide-react';
import { Theme, View } from '../types';

interface HeaderProps {
  theme: Theme;
  view: View;
  setView: (view: View) => void;
  toggleTheme: () => void;
  openAdminProduct: () => void;
  openAdminPDF: () => void;
  openAdminTestimonial: () => void;
  isAdmin: boolean;
  testimonialsCount: number;
}

const Header: React.FC<HeaderProps> = ({ theme, view, setView, toggleTheme, openAdminProduct, openAdminTestimonial, isAdmin, testimonialsCount }) => {
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const LOGO_URL = "https://i.imgur.com/3AIeDRi.png";
  
  const isTestimonialLimitReached = testimonialsCount >= 5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'diferenciais', label: 'Diferenciais', icon: ShieldCheck },
    { id: 'produtos', label: 'Produtos', icon: LayoutGrid },
    { id: 'catalogo', label: 'Catálogo', icon: BookOpen },
    { id: 'depoimentos', label: 'Depoimentos', icon: Award },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full backdrop-blur-md transition-all duration-300 border-b ${theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-fuzzi-blue/10'}`}>
      <div className="container mx-auto px-4 h-24 relative flex items-center justify-between">
        <div className="flex items-center cursor-pointer group h-12 md:h-16 z-10" onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img src={LOGO_URL} alt="Fuzzi Esquadrias" className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>

        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="relative flex flex-col items-center group transition-all duration-500 active:scale-95 px-4 py-2">
              <div className={`flex items-center gap-2.5 pb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-fuzzi-blue'}`}>
                <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </div>
              <div className="absolute bottom-0 h-[2px] w-0 bg-fuzzi-blue transition-all duration-500 group-hover:w-full rounded-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4 z-10">
          {isAdmin && (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsNewMenuOpen(!isNewMenuOpen)} className="flex items-center gap-3 px-6 py-3.5 rounded-2xl text-xs font-black bg-green-600 text-white hover:bg-green-700 transition-all shadow-xl active:scale-95">
                <PlusCircle className="w-5 h-5" />
                <span className="hidden sm:inline">NOVO</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isNewMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isNewMenuOpen && (
                <div className={`absolute right-0 mt-3 w-64 rounded-[2.5rem] shadow-2xl border animate-in fade-in zoom-in-95 duration-300 overflow-hidden z-50 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-50'}`}>
                  <div className="p-3 space-y-1.5">
                    <button onClick={() => { openAdminProduct(); setIsNewMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-left rounded-2xl transition-all hover:bg-green-600 hover:text-white ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      <ShoppingCart className="w-5 h-5 opacity-70" /> Novo Destaque
                    </button>
                    <button 
                      onClick={() => { 
                        if (!isTestimonialLimitReached) {
                          openAdminTestimonial(); 
                          setIsNewMenuOpen(false);
                        } else {
                          // Se já estiver bloqueado, o clique pode fechar ou mostrar alerta se desejado,
                          // mas o estilo visual já indica bloqueio. 
                          // Vamos manter comportamento de fechar e opcionalmente alertar via prop function se chamado.
                          // Mas aqui vamos apenas não chamar openAdmin se estiver bloqueado.
                          alert("Limite de 5 depoimentos atingido. Exclua um item existente para adicionar novos.");
                        }
                      }} 
                      className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-left rounded-2xl transition-all ${
                        isTestimonialLimitReached 
                          ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' 
                          : `hover:bg-green-600 hover:text-white ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`
                      }`}
                    >
                      <MessageSquare className="w-5 h-5 opacity-70" /> 
                      {isTestimonialLimitReached ? 'Limite Atingido (5/5)' : 'Novo Depoimento'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button onClick={toggleTheme} className={`relative flex items-center w-[72px] h-[38px] p-1 rounded-full border transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
            <div className={`absolute top-1 bottom-1 w-[30px] rounded-full transition-all duration-500 ${theme === 'dark' ? 'translate-x-[33px] bg-slate-800' : 'translate-x-0 bg-white'}`} />
            <div className="relative z-10 flex-1 flex justify-center items-center"><Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400 opacity-40'}`} /></div>
            <div className="relative z-10 flex-1 flex justify-center items-center"><Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-fuzzi-blue' : 'text-slate-400 opacity-40'}`} /></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
