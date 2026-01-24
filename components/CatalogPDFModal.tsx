
import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Image as ImageIcon, AlertCircle, Link, Loader2, CheckCircle2, UploadCloud, FileCheck } from 'lucide-react';
import { CatalogPDF, Theme } from '../types';
import { uploadFile } from '../supabase';

interface CatalogPDFModalProps {
  theme: Theme;
  onClose: () => void;
  onSave: (pdf: CatalogPDF) => void;
  editPDF?: CatalogPDF | null;
}

const CatalogPDFModal: React.FC<CatalogPDFModalProps> = ({ theme, onClose, onSave, editPDF }) => {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [imgProgress, setImgProgress] = useState(0);
  const [isImgUploading, setIsImgUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const imgInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editPDF) {
      setTitle(editPDF.title);
      setCoverImage(editPDF.coverImage);
      setPdfUrl(editPDF.pdfUrl === '#' ? '' : editPDF.pdfUrl);
    }
  }, [editPDF]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImgUploading(true);
    setImgProgress(0);
    setError(null);
    try {
      const publicUrl = await uploadFile(file, 'catalogs/covers', (p) => setImgProgress(p));
      setCoverImage(publicUrl);
    } catch (err) {
      setError("Erro ao subir imagem.");
    } finally {
      setIsImgUploading(false);
    }
  };

  const handlePDFChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError("Por favor, selecione apenas arquivos PDF.");
      return;
    }
    setIsPdfUploading(true);
    setPdfProgress(0);
    setError(null);
    setPdfFileName(file.name);
    try {
      const publicUrl = await uploadFile(file, 'catalogs/files', (p) => setPdfProgress(p));
      setPdfUrl(publicUrl);
    } catch (err) {
      setError("Erro ao subir arquivo PDF.");
      setPdfFileName(null);
    } finally {
      setIsPdfUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("O título é obrigatório."); return; }
    if (!coverImage) { setError("A imagem de capa é obrigatória."); return; }
    if (!pdfUrl.trim()) { setError("Faça o upload do PDF ou insira um link."); return; }

    setSaveSuccess(true);
    setTimeout(() => {
      onSave({
        id: editPDF?.id || 'main_catalog',
        title: title.trim(),
        coverImage,
        pdfUrl: pdfUrl.trim()
      });
      onClose();
    }, 1200);
  };

  const inputClasses = `w-full px-5 py-4 rounded-2xl border outline-none font-bold transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 focus:border-fuzzi-blue' : 'bg-slate-50 border-slate-100 focus:border-fuzzi-blue shadow-inner'}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        {saveSuccess ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-fuzzi-blue rounded-full flex items-center justify-center shadow-2xl animate-bounce"><CheckCircle2 className="w-10 h-10 text-white" /></div>
            <h3 className="text-xl font-black uppercase tracking-widest">Catálogo Salvo!</h3>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-inherit flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight">Configurar Catálogo</h2>
              <button onClick={onClose} className="p-2 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-7">
              {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase flex gap-2 animate-in slide-in-from-top-2"><AlertCircle className="w-4 h-4 flex-shrink-0"/> {error}</div>}
              
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <button type="button" disabled={isImgUploading} onClick={() => imgInputRef.current?.click()} className={`relative w-28 h-28 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all hover:border-fuzzi-blue ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-blue-50'}`}>
                    {coverImage && !isImgUploading ? <img src={coverImage} className="w-full h-full object-cover" /> : isImgUploading ? <div className="flex flex-col items-center gap-1"><Loader2 className="w-5 h-5 text-fuzzi-blue animate-spin" /><span className="text-[12px] font-black text-fuzzi-blue">{imgProgress}%</span></div> : <ImageIcon className="w-6 h-6 text-fuzzi-blue/40" />}
                  </button>
                  {isImgUploading && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-fuzzi-blue transition-all" style={{ width: `${imgProgress}%` }}></div></div>}
                </div>
                <input type="file" ref={imgInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <span className="text-[9px] font-black uppercase text-slate-500">Capa do Catálogo</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Nome do Catálogo</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Catálogo Geral" className={inputClasses} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Arquivo PDF</label>
                  <div className="flex flex-col gap-3">
                    <button type="button" disabled={isPdfUploading} onClick={() => pdfInputRef.current?.click()} className={`relative w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 transition-all ${isPdfUploading ? 'border-fuzzi-blue bg-fuzzi-blue/5' : pdfUrl ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 hover:border-fuzzi-blue'}`}>
                      {isPdfUploading ? <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 text-fuzzi-blue animate-spin" /><span className="text-xs font-black uppercase text-fuzzi-blue">Enviando: {pdfProgress}%</span></div> : pdfUrl ? <div className="flex items-center gap-3 text-green-500"><FileCheck className="w-5 h-5" /><span className="text-xs font-black uppercase truncate max-w-[200px]">{pdfFileName || 'PDF Pronto'}</span></div> : <div className="flex items-center gap-3 opacity-60"><UploadCloud className="w-5 h-5" /><span className="text-xs font-black uppercase">Fazer Upload do PDF</span></div>}
                      {isPdfUploading && <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800"><div className="h-full bg-fuzzi-blue shadow-[0_0_8px_rgba(0,207,255,0.5)] transition-all" style={{ width: `${pdfProgress}%` }}></div></div>}
                    </button>
                    <input type="file" ref={pdfInputRef} className="hidden" accept="application/pdf" onChange={handlePDFChange} />
                    <div className="relative group"><div className="absolute left-5 top-1/2 -translate-y-1/2 text-fuzzi-blue opacity-50"><Link className="w-4 h-4" /></div><input type="url" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="Ou link do Google Drive..." className={`${inputClasses} pl-12 text-xs py-3`} /></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-2"><button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-500 text-xs">Cancelar</button><button type="submit" disabled={isImgUploading || isPdfUploading} className="flex-[2] py-4 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl disabled:opacity-50 text-xs uppercase tracking-widest">Salvar Catálogo</button></div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPDFModal;
