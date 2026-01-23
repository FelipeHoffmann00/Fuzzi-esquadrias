
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Check, Lock, Unlock, ArrowRight, X } from 'lucide-react';
import { Theme, View } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface FooterProps {
  theme: Theme;
  isAdmin: boolean;
  isLoginOpen: boolean;
  onAdminToggle: () => void;
  onLogin: () => void;
  setIsLoginOpen: (open: boolean) => void;
  setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ theme, isAdmin, isLoginOpen, onAdminToggle, onLogin, setIsLoginOpen, setView }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const emailAddress = 'fuzziesquadrias@hotmail.com';
  const addressText = 'Praça Manoel de Vasconcelos, 593 - Centro, Sumaré - SP, 13170-025';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      setLoginError(false);
      setPassword('');
      onLogin();
    } else {
      setLoginError(true);
    }
  };

  const scrollToSection = (id: string) => {
    setView('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

  const navLinks = [
    { label: 'Início', id: 'inicio' },
    { label: 'Diferenciais', id: 'diferenciais' },
    { label: 'Produtos', id: 'produtos' },
    { label: 'Catálogo', id: 'catalogo' },
    { label: 'Depoimentos', id: 'depoimentos' },
  ];

  const leftLinks = navLinks.slice(0, 4);
  const rightLinks = navLinks.slice(4);

  return (
    <footer className={`py-12 border-t transition-theme ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-fuzzi-blue/5 border-fuzzi-blue/10 text-slate-600'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <span className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-fuzzi-gray'}`}>
                FUZZI
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Excelência em esquadrias de alumínio para projetos residenciais e comerciais de alto padrão. Qualidade que você vê, segurança que você sente.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/fuzziesquadrias/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue hover:bg-fuzzi-blue hover:text-white transition-all"
                title="Siga-nos no Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Contato</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:text-fuzzi-blue transition-colors group"
                >
                  <Phone className="w-5 h-5 text-fuzzi-blue group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium text-base">+55 (19) 98446-2287</span>
                </a>
              </li>
              
              <li className="flex items-start group">
                <button 
                  onClick={handleCopyEmail}
                  className="flex items-start gap-4 hover:text-fuzzi-blue transition-colors w-full text-left"
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {emailCopied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Mail className="w-5 h-5 text-fuzzi-blue" />
                    )}
                  </div>
                  <div className="flex flex-col relative">
                    <span className="font-medium text-base leading-none">{emailAddress}</span>
                    <span className={`absolute top-full left-0 text-[10px] font-black uppercase tracking-wider transition-all duration-300 mt-1.5 whitespace-nowrap ${
                      emailCopied 
                        ? 'text-green-500 opacity-100 translate-y-0' 
                        : 'text-fuzzi-blue opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
                    }`}>
                      {emailCopied ? 'E-mail copiado!' : 'CLIQUE PARA COPIAR'}
                    </span>
                  </div>
                </button>
              </li>

              <li className="flex items-start">
                <a 
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 hover:text-fuzzi-blue transition-colors group"
                  title="Abrir no Google Maps"
                >
                  <MapPin className="w-5 h-5 text-fuzzi-blue flex-shrink-0 mt-0.5 group-hover:animate-bounce transition-transform" />
                  <span className="font-medium text-base leading-snug">{addressText}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Links</h4>
            
            <div className="flex gap-12">
              <ul className="space-y-3 text-sm">
                {leftLinks.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => scrollToSection(link.id)} 
                      className="hover:text-fuzzi-blue transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              
              <ul className="space-y-3 text-sm">
                {rightLinks.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => scrollToSection(link.id)} 
                      className="hover:text-fuzzi-blue transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                
                <li className="relative">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onAdminToggle();
                    }}
                    type="button"
                    className={`flex items-center gap-2 transition-colors font-bold ${isAdmin ? 'text-green-500' : 'hover:text-fuzzi-blue'}`}
                  >
                    {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {isAdmin ? 'Sair' : 'Administrador'}
                  </button>

                  {isLoginOpen && !isAdmin && (
                    <div className={`absolute right-0 bottom-full mb-4 p-4 rounded-2xl shadow-2xl z-50 w-64 border animate-in slide-in-from-bottom-2 duration-300 ${
                      theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-black' : 'bg-white border-fuzzi-blue/10 shadow-fuzzi-blue/10'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-fuzzi-blue">Senha Admin</span>
                        <button onClick={() => setIsLoginOpen(false)} className="text-slate-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <form onSubmit={handleLoginSubmit} className="flex gap-2">
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                          placeholder="••••••"
                          autoFocus
                          className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-fuzzi-blue ${
                            loginError 
                              ? 'border-red-500 bg-red-50/10' 
                              : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-fuzzi-blue/5 border-fuzzi-blue/10 text-slate-900'
                          }`}
                        />
                        <button 
                          type="submit"
                          className="p-2 bg-fuzzi-blue text-white rounded-xl hover:brightness-110 transition-all active:scale-90"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                      {loginError && <p className="text-[10px] text-red-500 mt-2 font-bold">Senha incorreta.</p>}
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-inherit text-center text-[10px] md:text-xs flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 opacity-70">
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} Fuzzi Esquadrias. Todos os direitos reservados.</p>
          </div>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-current opacity-30"></span>
          <div className="flex items-center gap-1">
            <span>Desenvolvido por</span>
            <a 
              href="https://www.linkedin.com/in/felipe-hoffmann-9bb7361a4/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-black hover:text-fuzzi-blue transition-colors underline decoration-fuzzi-blue/30 underline-offset-4"
            >
              Felipe Hoffmann
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
