
import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { Theme } from '../types';

interface LoginModalProps {
  theme: Theme;
  onClose: () => void;
  onLogin: (password: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ theme, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admfuzzi1452') {
      onLogin(password);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300 ${
          theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'
        }`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Acesso Restrito
              </h2>
            </div>
            <button 
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={`block text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Senha do Administrador
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className={`w-full pl-4 pr-12 py-4 rounded-2xl border outline-none transition-all ${
                    error 
                      ? 'border-red-500 bg-red-50/50' 
                      : theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                        : 'bg-slate-50 border-blue-100 text-slate-900 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-xs font-bold animate-pulse">Senha incorreta. Tente novamente.</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
