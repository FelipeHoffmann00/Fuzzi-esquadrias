
import React from 'react';
import { FileText, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { CatalogPDF, Theme } from '../types';

interface CatalogProps {
  catalogs: CatalogPDF[];
  theme: Theme;
  isAdmin?: boolean;
  onEdit?: (pdf: CatalogPDF) => void;
  onDelete?: (id: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ catalogs, theme, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Nossos <span className="text-fuzzi-blue">Catálogos</span></h1>
        <p className={`text-base md:text-lg font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Explore nossas linhas completas e especificações técnicas para seu projeto.
        </p>
      </div>

      {catalogs.length === 0 ? (
        <div className="text-center py-20 opacity-30">
          <FileText className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-bold">Nenhum catálogo disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map(catalog => (
            <div 
              key={catalog.id}
              className={`group relative flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:-translate-y-2 fix-clipping ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-fuzzi-blue/5 shadow-md hover:shadow-2xl hover:shadow-fuzzi-blue/10'
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-[2.5rem]">
                <img 
                  src={catalog.coverImage} 
                  alt={catalog.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
                
                <div className="absolute top-5 left-5 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-10">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </div>

                {isAdmin && (
                  <div className="absolute top-5 right-5 flex gap-2 z-20">
                    <button 
                      onClick={() => onEdit?.(catalog)}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-fuzzi-blue transition-colors shadow-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete?.(catalog.id)}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={catalog.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-white text-fuzzi-blue rounded-full shadow-2xl hover:scale-110 transition-transform"
                  >
                    <ExternalLink className="w-6 h-6" />
                  </a>
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                    Abrir Catálogo
                  </span>
                </div>
              </div>

              <div className="p-8 text-center flex-grow flex flex-col justify-center items-center">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-fuzzi-blue mb-2 block opacity-80">
                  {catalog.category}
                </span>
                <h3 className={`font-black text-xl md:text-2xl leading-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {catalog.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
