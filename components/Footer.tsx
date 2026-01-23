
import React, { useState } from 'react';
import { Instagram, Lock, Unlock, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Theme, View } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import WhatsAppIcon from './WhatsAppIcon';

interface FooterProps {
  theme: Theme;
  isAdmin: boolean;
  isLoginOpen: boolean;
  onAdminToggle: () => void;
  onLogin: (password: string) => void;
  setIsLoginOpen: (open: boolean) => void;
  setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ theme, isAdmin, onAdminToggle, onLogin, setView }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const emailAddress = 'fuzziesquadrias@hotmail.com';
  const addressText = 'Praça Manoel de Vasconcelos, 593 - Centro, Sumaré - SP';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setView('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      onLogin(password);
      setShowPasswordInput(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      // Mantém o erro visível por 3 segundos para dar tempo de ler
      setTimeout(() => setError(false), 3000);
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

  return (
    <footer className={`pt-12 pb-8 border-t transition-theme ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-fuzzi-light border-slate-200 text-slate-600'
    }`}>
      <div className="container mx-auto px-4">
        
        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row items-start lg:justify-center lg:gap-24 gap-10 mb-12">
          
          {/* 1. Marca (Esquerda) */}
          <div className="flex flex-col items-start space-y-4 order-1 lg:max-w-xs">
            <div>
              <span className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-fuzzi-gray'}`}>
                FUZZI
              </span>
              <p className="text-sm mt-2 leading-relaxed opacity-80">
                Excelência em esquadrias de alumínio para projetos de alto padrão. Qualidade que você vê, segurança que você sente.
              </p>
            </div>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/fuzziesquadrias/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-fuzzi-blue/10 text-fuzzi-blue hover:bg-fuzzi-blue hover:text-white transition-all shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. Contato (Meio) */}
          <div className="flex flex-col items-start space-y-4 order-2 lg:order-2">
            <h4 className={`text-[10px] font-black uppercase tracking-widest mb-0 lg:mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Fale Conosco
            </h4>
            <div className="space-y-3 text-sm">
              <p className="hover:text-fuzzi-blue transition-colors cursor-pointer block font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 opacity-50" />
                +55 (19) 98446-2287
              </p>
              <button onClick={handleCopyEmail} className="hover:text-fuzzi-blue transition-colors block w-full text-left font-medium">
                 <span className={`flex items-center gap-2 ${emailCopied ? 'text-green-500 font-bold' : ''}`}>
                    <Mail className="w-4 h-4 opacity-50" />
                    {emailCopied ? 'E-mail copiado!' : emailAddress}
                 </span>
              </button>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fuzzi-blue transition-colors block font-medium flex items-start gap-2 text-left group"
              >
                <MapPin className="w-4 h-4 opacity-50 shrink-0 mt-0.5 group-hover:opacity-100" />
                <span className="leading-relaxed max-w-xs">{addressText}</span>
              </a>
            </div>
          </div>

          {/* 3. Navegação (Direita) */}
          <div className="flex flex-col items-start order-3 lg:order-3">
            <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 lg:mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Navegação
            </h4>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-left">
              <div className="flex flex-col gap-3">
                <button onClick={() => scrollToSection('inicio')} className="text-sm hover:text-fuzzi-blue transition-colors text-left">Início</button>
                <button onClick={() => scrollToSection('diferenciais')} className="text-sm hover:text-fuzzi-blue transition-colors text-left">Diferenciais</button>
                <button onClick={() => scrollToSection('produtos')} className="text-sm hover:text-fuzzi-blue transition-colors text-left">Produtos</button>
                <button onClick={() => scrollToSection('catalogo')} className="text-sm hover:text-fuzzi-blue transition-colors text-left">Catálogo</button>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => scrollToSection('depoimentos')} className="text-sm hover:text-fuzzi-blue transition-colors text-left">Depoimentos</button>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (isAdmin) {
                        onAdminToggle();
                      } else {
                        setShowPasswordInput(!showPasswordInput);
                        setError(false);
                      }
                    }}
                    type="button"
                    className={`text-sm flex items-center gap-1.5 transition-colors text-left ${isAdmin ? 'text-green-500 hover:text-red-500' : 'hover:text-fuzzi-blue'}`}
                  >
                    {isAdmin ? (
                      <>
                        <Unlock className="w-3 h-3" /> Sair
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 opacity-70" /> Administrador
                      </>
                    )}
                  </button>

                  {!isAdmin && showPasswordInput && (
                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2 animate-in slide-in-from-top-1 duration-200">
                      <div className="relative">
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError(false);
                          }}
                          placeholder="Senha"
                          autoFocus
                          className={`w-32 px-3 py-2 text-xs rounded-xl border outline-none transition-all ${
                            error 
                              ? 'border-red-500 bg-red-50/50 ring-4 ring-red-500/10' 
                              : theme === 'dark' 
                                ? 'bg-slate-900 border-slate-800 text-white focus:border-fuzzi-blue' 
                                : 'bg-white border-slate-200 text-slate-900 focus:border-fuzzi-blue shadow-sm'
                          }`}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-fuzzi-blue hover:scale-110 transition-transform">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                      {error && (
                        <span className="text-[10px] font-bold text-red-500 animate-pulse flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          Senha incorreta!
                        </span>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Barra Inferior Centralizada */}
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-[10px] uppercase tracking-wider font-medium text-center ${
           theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <p>© {new Date().getFullYear()} Fuzzi Esquadrias. Todos os direitos reservados.</p>
          
          <a 
            href="https://www.linkedin.com/in/felipe-hoffmann-9bb7361a4/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-fuzzi-blue transition-colors"
          >
            Desenvolvido por Felipe Hoffmann
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
