
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
    // Para 'inicio', alinhamos no topo (start). Para as outras, centralizamos (center).
    const alignment: ScrollLogicalPosition = id === 'inicio' ? 'start' : 'center';
    const scrollOptions: ScrollIntoViewOptions = { behavior: 'smooth', block: alignment };
    const targetId = id === 'produtos' ? 'destaques' : id;

    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView(scrollOptions);
        }
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView(scrollOptions);
      }
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
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full backdrop-blur-md transition-all duration-300 border-b ${theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-fuzzi-blue/10'}`}>
      <div className="container mx-auto px-4 h-20 md:h-24 relative flex items-center justify-between">
        
        {/* LOGOTIPO OFICIAL FUZZI */}
        <div 
          className="flex items-center cursor-pointer group z-20 shrink-0" 
          onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img 
            src="https://i.imgur.com/QZZKjXf.png" 
            alt="Fuzzi Esquadrias" 
            className="h-12 md:h-16 lg:h-18 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* NAVEGAÇÃO CENTRALIZADA */}
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 xl:gap-4">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)} 
              className="relative flex items-center gap-2 group transition-all duration-300 active:scale-95 px-3 py-2 rounded-xl hover:bg-fuzzi-blue/5"
            >
              <item.icon className={`w-3.5 h-3.5 transition-all duration-300 ${theme === 'dark' ? 'text-slate-500 group-hover:text-fuzzi-blue' : 'text-slate-400 group-hover:text-fuzzi-blue'}`} />
              <span className={`text-[10px] xl:text-[11px] font-black uppercase tracking-[0.18em] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-fuzzi-blue'}`}>
                {item.label}
              </span>
            </button>
          ))}
          
          {isAdmin && (
            <div className="ml-4 pl-4 border-l border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500">ADMINISTRADOR</span>
            </div>
          )}
        </nav>
        
        <div className="flex items-center space-x-3 md:space-x-4 z-20">
          <div className={`relative transition-all duration-500 ease-in-out ${isAdmin ? 'w-auto opacity-100 translate-x-0 mr-1 md:mr-4 scale-100' : 'w-0 opacity-0 translate-x-8 mr-0 scale-90 pointer-events-none'}`} ref={menuRef}>
            <button onClick={() => setIsNewMenuOpen(!isNewMenuOpen)} className="flex items-center gap-2 md:gap-3 px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black bg-green-600 text-white hover:bg-green-700 transition-all shadow-xl active:scale-95 whitespace-nowrap uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" />
              <span>GERENCIAR</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isNewMenuOpen ? 'rotate-180' : ''}`} />
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
            className={`relative flex items-center w-[54px] h-[28px] md:w-[64px] md:h-[34px] p-1 rounded-full border transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}
          >
            <div className={`absolute top-0.5 bottom-0.5 w-[22px] md:w-[28px] rounded-full transition-all duration-500 shadow-sm ${theme === 'dark' ? 'translate-x-[24px] md:translate-x-[28px] bg-slate-800' : 'translate-x-0 bg-white'}`} />
            <div className="relative z-10 flex-1 flex justify-center items-center">
              <Sun className={`w-3 h-3 md:w-3.5 md:h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400 opacity-40'}`} />
            </div>
            <div className="relative z-10 flex-1 flex justify-center items-center">
              <Moon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${theme === 'dark' ? 'text-fuzzi-blue' : 'text-slate-400 opacity-40'}`} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
