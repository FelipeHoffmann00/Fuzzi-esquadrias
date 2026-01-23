
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Theme } from '../types';

interface ConfirmModalProps {
  theme: Theme;
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  theme, 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200 border ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h3>
          
          <p className={`text-sm mb-8 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {message}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className={`flex-1 py-4 font-bold rounded-2xl transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
