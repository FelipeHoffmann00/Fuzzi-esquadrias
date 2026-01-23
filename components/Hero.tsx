
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Loader2, Maximize, ZoomIn, Check, X, Move } from 'lucide-react';
import { Theme, View } from '../types';

interface HeroProps {
  theme: Theme;
  setView: (view: View) => void;
  heroImage: string;
  isAdmin: boolean;
  onHeroImageChange: (imageUrl: string) => void;
}

const Hero: React.FC<HeroProps> = ({ theme, setView, heroImage, isAdmin, onHeroImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crop States
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImage(event.target?.result as string);
      setIsCropping(true);
      setZoom(1.2);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset for same file re-selection
  };

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
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

  const stopDragging = () => setIsDragging(false);

  const handleApplyCrop = () => {
    if (!imgRef.current || !viewerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Alta definição para o Hero
    canvas.width = 1200;
    canvas.height = 1200;

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

    onHeroImageChange(canvas.toDataURL('image/jpeg', 0.9));
    setIsCropping(false);
    setTempImage(null);
  };

  return (
    <div className="py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      
      {/* Coluna da Esquerda: Texto */}
      <div className="flex-1 text-left animate-in slide-in-from-left-8 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuzzi-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuzzi-blue"></span>
          </span>
          Qualidade em cada detalhe
        </div>
        
        <h1 className={`text-5xl md:text-6xl lg:text-8xl font-extrabold mb-8 leading-[1.05] tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-fuzzi-gray'}`}>
          Design & Qualidade em <br />
          <span className="text-fuzzi-blue">Esquadrias</span>
        </h1>
        
        <p className={`text-xl md:text-2xl mb-4 max-w-xl transition-colors duration-300 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Soluções sob medida em alumínio para transformar seu ambiente. 
          Durabilidade, estética e tecnologia integradas em cada detalhe da sua obra.
        </p>
      </div>

      {/* Coluna da Direita: Imagem */}
      <div className="flex-1 w-full relative group animate-in slide-in-from-right-8 duration-1000">
        <div className="absolute -inset-10 bg-fuzzi-blue/20 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
        
        <div className={`relative overflow-hidden rounded-[3rem] transition-all duration-700 ease-out fix-clipping ${
          theme === 'dark' 
            ? 'ring-1 ring-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8),0_0_60px_-10px_rgba(0,207,255,0.4)]' 
            : 'ring-1 ring-black/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2),0_0_40px_-10px_rgba(0,0,0,0.1)]'
        } group-hover:scale-[1.01]`}>
          
          <img 
            src={heroImage} 
            alt="Fuzzi Esquadrias Showroom" 
            className={`w-full aspect-[4/5] lg:aspect-square object-cover transition-all duration-1000 ease-out ${isProcessing ? 'opacity-50 scale-105' : 'opacity-100 scale-100 group-hover:scale-110'}`}
          />
          
          <div className={`absolute inset-0 transition-opacity duration-700 ${theme === 'dark' ? 'bg-gradient-to-t from-slate-950/20 to-transparent' : 'bg-gradient-to-t from-fuzzi-blue/5 to-transparent'}`}></div>
          
          {isAdmin && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-8 py-4 bg-fuzzi-blue text-white rounded-3xl font-black hover:brightness-110 transition-all shadow-2xl active:scale-90"
              >
                <Camera className="w-5 h-5" />
                Alterar Foto
              </button>
              <button 
                onClick={() => { setTempImage(heroImage); setIsCropping(true); setZoom(1); setPosition({x:0,y:0}); }}
                className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-3xl font-black hover:bg-white/30 transition-all shadow-2xl active:scale-90"
              >
                <Maximize className="w-5 h-5" />
                Ajustar Enquadramento
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de Crop para o Hero */}
      {isCropping && tempImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border animate-in zoom-in-95 duration-300 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}>
            <div className="p-6 border-b border-inherit flex items-center justify-between">
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Ajustar Foto Principal</h3>
              <button onClick={() => { setIsCropping(false); setTempImage(null); }} className="p-2 hover:text-red-500 transition-colors"><X /></button>
            </div>
            
            <div className="p-8 space-y-8">
              <div 
                ref={viewerRef}
                className="relative w-full aspect-square mx-auto rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-fuzzi-blue shadow-2xl cursor-move touch-none"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={onMouseDown}
                onTouchMove={onMouseMove}
                onTouchEnd={stopDragging}
              >
                <img 
                  ref={imgRef}
                  src={tempImage} 
                  className="absolute max-w-none pointer-events-none"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    left: '50%',
                    top: '50%',
                    width: '100%',
                    height: 'auto',
                    marginLeft: '-50%',
                    marginTop: '-50%',
                    transformOrigin: 'center'
                  }}
                />
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                  {[...Array(9)].map((_, i) => <div key={i} className="border border-white/30"></div>)}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl shadow-inner">
                  <ZoomIn className="w-5 h-5 text-fuzzi-blue" />
                  <input 
                    type="range" min="0.5" max="5" step="0.01" 
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-fuzzi-blue h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-black text-slate-400 w-8">{Math.round(zoom * 100)}%</span>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => { setIsCropping(false); setTempImage(null); }}
                    className="flex-1 py-4 font-black text-slate-500 rounded-2xl bg-slate-100 dark:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleApplyCrop}
                    className="flex-1 py-4 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl shadow-fuzzi-blue/20 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check className="w-5 h-5" /> Salvar Ajuste
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
