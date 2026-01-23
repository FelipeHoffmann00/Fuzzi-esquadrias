
import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Image as ImageIcon, AlertCircle, Check, Upload, Loader2, ZoomIn, Maximize, CheckCircle2 } from 'lucide-react';
import { CatalogPDF, Theme } from '../types';

interface CatalogPDFModalProps {
  theme: Theme;
  onClose: () => void;
  onSave: (pdf: CatalogPDF) => void;
  editPDF?: CatalogPDF | null;
}

const CatalogPDFModal: React.FC<CatalogPDFModalProps> = ({ theme, onClose, onSave, editPDF }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Principal');
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Crop States
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showGuides, setShowGuides] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (editPDF) {
      setTitle(editPDF.title);
      setCategory(editPDF.category);
      setCoverImage(editPDF.coverImage);
      setPdfUrl(editPDF.pdfUrl);
      if (editPDF.pdfUrl.startsWith('data:application/pdf')) {
        setPdfFileName('Arquivo PDF carregado');
      }
    }
  }, [editPDF]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImage(event.target?.result as string);
      setIsCropping(true);
      setZoom(1.1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setShowGuides(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({ x: clientX - startPos.x, y: clientY - startPos.y });
  };

  const stopDragging = () => {
    setIsDragging(false);
    setShowGuides(false);
  };

  const handleApplyCrop = () => {
    if (!imgRef.current || !viewerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 1000;

    const viewer = viewerRef.current.getBoundingClientRect();
    const img = imgRef.current.getBoundingClientRect();

    const scaleX = imgRef.current.naturalWidth / img.width;
    const scaleY = imgRef.current.naturalHeight / img.height;

    const cropX = (viewer.left - img.left) * scaleX;
    const cropY = (viewer.top - img.top) * scaleY;
    const cropW = viewer.width * scaleX;
    const cropH = viewer.height * scaleY;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgRef.current, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

    setCoverImage(canvas.toDataURL('image/jpeg', 1.0));
    setIsCropping(false);
    setTempImage(null);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError("Por favor, selecione apenas arquivos no formato PDF.");
      return;
    }
    setError(null);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPdfUrl(event.target?.result as string);
      setPdfFileName(file.name);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) { setError("O título é obrigatório."); return; }
    if (!coverImage) { setError("A imagem de capa é obrigatória."); return; }
    if (!pdfUrl) { setError("Selecione um PDF."); return; }

    setIsProcessing(true);
    setTimeout(() => {
      onSave({
        id: editPDF?.id || 'main_catalog',
        title,
        category,
        coverImage,
        pdfUrl
      });
      setIsProcessing(false);
      setSaveSuccess(true);
      setTimeout(onClose, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'
      }`}>
        
        {saveSuccess ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <h3 className="text-2xl font-black">Catálogo Atualizado!</h3>
          </div>
        ) : isCropping && tempImage ? (
          <div className="p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-black text-fuzzi-blue mb-1">Capa do Catálogo</h3>
              <p className="text-[10px] font-black uppercase text-slate-400">Arraste para ajustar</p>
            </div>
            <div 
              ref={viewerRef}
              className="relative w-full max-w-[280px] aspect-square mx-auto rounded-[2rem] overflow-hidden bg-slate-100 border-[4px] border-fuzzi-blue shadow-2xl cursor-move touch-none"
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopDragging} onMouseLeave={stopDragging} onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={stopDragging}
            >
              <img ref={imgRef} src={tempImage} className="absolute max-w-none pointer-events-none" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, left: '50%', top: '50%', width: '100%', height: 'auto', marginLeft: '-50%', marginTop: '-50%' }} />
            </div>
            <div className="space-y-4">
              <input type="range" min="0.5" max="5" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-fuzzi-blue h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCropping(false)} className="px-6 py-4 font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-2xl">Cancelar</button>
                <button type="button" onClick={handleApplyCrop} className="flex-1 py-4 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl">Aplicar Recorte</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-inherit flex items-center justify-between sticky top-0 bg-inherit z-10">
              <h2 className="text-xl font-black">Editar Catálogo do Site</h2>
              <button onClick={onClose} className="p-2 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex gap-2 animate-in slide-in-from-top-2"><AlertCircle className="w-5 h-5 flex-shrink-0"/> {error}</div>}
              <div className="flex flex-col items-center gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className={`relative aspect-square w-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all hover:border-fuzzi-blue group ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-blue-100'}`}>
                  {coverImage ? <img src={coverImage} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-fuzzi-blue group-hover:scale-110" />}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                <span className="text-[9px] font-black uppercase text-slate-400">Imagem de Destaque</span>
              </div>
              <div className="space-y-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título (ex: Catálogo Geral 2024)" className={`w-full px-5 py-4 rounded-2xl border outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-fuzzi-blue/5 text-slate-900'}`} />
                <button type="button" onClick={() => pdfInputRef.current?.click()} className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed font-bold transition-all ${pdfUrl.startsWith('data:') ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-fuzzi-blue'}`}>
                  <Upload className="w-5 h-5" /> {pdfFileName || 'Fazer Upload do PDF'}
                </button>
                <input type="file" ref={pdfInputRef} className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-5 font-black text-slate-500">Cancelar</button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-5 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl shadow-fuzzi-blue/20">Salvar Catálogo</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPDFModal;
