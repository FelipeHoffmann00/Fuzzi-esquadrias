
import React, { useState, useRef, useEffect } from 'react';
import { Home, PlusCircle, FileText, ChevronDown, ShoppingCart, MessageSquare, BookOpen, Star, ShieldCheck, Award, Sun, Moon } from 'lucide-react';
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

const Header: React.FC<HeaderProps> = ({ theme, view, setView, toggleTheme, openAdminProduct, openAdminPDF, openAdminTestimonial, isAdmin, testimonialsCount }) => {
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isTestimonialLimitReached = testimonialsCount >= 10;

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
    const scrollOptions: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' };
    const targetId = id === 'produtos' ? 'destaques' : id;

    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        element?.scrollIntoView(scrollOptions);
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      element?.scrollIntoView(scrollOptions);
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'diferenciais', label: 'Diferenciais', icon: ShieldCheck },
    { id: 'produtos', label: 'Destaques', icon: Star },
    { id: 'depoimentos', label: 'Depoimentos', icon: Award },
    { id: 'catalogo', label: 'Catálogo', icon: BookOpen },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full backdrop-blur-md transition-all duration-300 border-b ${theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-fuzzi-blue/10'}`}>
      <div className="container mx-auto px-4 h-20 md:h-24 relative flex items-center justify-between">
        
        {/* LOGOTIPO OFICIAL FUZZI - USANDO SOMENTE A IMAGEM FORNECIDA */}
        <div 
          className="flex items-center cursor-pointer group z-20 shrink-0" 
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img 
            src="https://i.imgur.com/QZZKjXf.png" 
            alt="Fuzzi Esquadrias" 
            className="h-14 md:h-18 lg:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-end gap-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="relative flex flex-col items-center group transition-all duration-500 active:scale-95 px-4 py-2">
              <div className={`flex items-center gap-2.5 pb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-fuzzi-blue'}`}>
                <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item.label}</span>
              </div>
              <div className="absolute bottom-0 h-[2px] w-0 bg-fuzzi-blue transition-all duration-500 group-hover:w-full rounded-full" />
            </button>
          ))}
          <div className={`flex flex-col items-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isAdmin ? 'max-w-[180px] opacity-100 translate-x-0 px-4' : 'max-w-0 opacity-0 -translate-x-4 px-0'}`}>
             <div className="flex flex-col items-center py-2 select-none w-full whitespace-nowrap">
                <div className="flex items-center gap-2.5 pb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">Administrador</span>
                </div>
                <div className="h-[2px] w-full bg-green-500/30 rounded-full" />
             </div>
          </div>
        </nav>
        
        <div className="flex items-center space-x-3 md:space-x-4 z-20">
          <div className={`relative transition-all duration-500 ease-in-out ${isAdmin ? 'w-auto opacity-100 translate-x-0 mr-1 md:mr-4 scale-100' : 'w-0 opacity-0 translate-x-8 mr-0 scale-90 pointer-events-none'}`} ref={menuRef}>
            <button onClick={() => setIsNewMenuOpen(!isNewMenuOpen)} className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl text-xs font-black bg-green-600 text-white hover:bg-green-700 transition-all shadow-xl active:scale-95 whitespace-nowrap">
              <PlusCircle className="w-5 h-5" />
              <span className="inline">GERENCIAR</span>
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${isNewMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isNewMenuOpen && isAdmin && (
              <div className={`absolute right-0 mt-3 w-64 rounded-[2rem] shadow-2xl border animate-in fade-in zoom-in-95 duration-300 overflow-hidden z-50 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-50'}`}>
                <div className="p-3 space-y-1.5">
                  <button onClick={() => { openAdminProduct(); setIsNewMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-left rounded-2xl transition-all hover:bg-fuzzi-blue hover:text-white ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><ShoppingCart className="w-5 h-5 opacity-70" /> Novo Destaque</button>
                  <button onClick={() => { openAdminPDF(); setIsNewMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-left rounded-2xl transition-all hover:bg-fuzzi-blue hover:text-white ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}><FileText className="w-5 h-5 opacity-70" /> Editar Catálogo</button>
                  <button onClick={() => { if (!isTestimonialLimitReached) { openAdminTestimonial(); setIsNewMenuOpen(false); } else { alert("Limite de 10 depoimentos atingido."); } }} className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-left rounded-2xl transition-all ${isTestimonialLimitReached ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' : `hover:bg-fuzzi-blue hover:text-white ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}`}><MessageSquare className="w-5 h-5 opacity-70" /> {isTestimonialLimitReached ? 'Limite Atingido' : 'Novo Depoimento'}</button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleTheme} 
            className={`relative flex items-center w-[60px] h-[32px] md:w-[72px] md:h-[38px] p-1 rounded-full border transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}
          >
            <div className={`absolute top-1 bottom-1 w-[24px] md:w-[30px] rounded-full transition-all duration-500 ${theme === 'dark' ? 'translate-x-[26px] md:translate-x-[33px] bg-slate-800' : 'translate-x-0 bg-white'}`} />
            <div className="relative z-10 flex-1 flex justify-center items-center">
              <Sun className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400 opacity-40'}`} />
            </div>
            <div className="relative z-10 flex-1 flex justify-center items-center">
              <Moon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-fuzzi-blue' : 'text-slate-400 opacity-40'}`} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
