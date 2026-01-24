
import React, { useRef, useState } from 'react';
import { Camera, ZoomIn, Check, X } from 'lucide-react';
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
    e.target.value = ''; 
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

    canvas.width = 1600;
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

    const finalData = canvas.toDataURL('image/jpeg', 0.8);
    onHeroImageChange(finalData);
    setIsCropping(false);
    setTempImage(null);
  };

  return (
    <div className="w-full pt-6 pb-12 md:py-24 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
      {/* Container de Texto: Alinhado à esquerda no Mobile e Desktop */}
      <div className="flex-1 text-left animate-in fade-in slide-in-from-left-4 duration-1000 relative z-20 px-6 md:px-0">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-10 border border-fuzzi-blue/5 shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuzzi-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuzzi-blue"></span>
          </span>
          Qualidade Premium
        </div>
        
        <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-5 md:mb-6 leading-[1.1] tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Design & Qualidade em <span className="text-fuzzi-blue">Esquadrias</span>
        </h1>
        
        <p className={`text-base md:text-2xl mb-1 lg:mb-8 max-w-2xl opacity-60 leading-relaxed font-medium text-left`}>
          Soluções sob medida em alumínio para transformar seu ambiente com durabilidade e estética refinada.
        </p>
      </div>

      {/* Container de Imagem */}
      <div className="flex-[1.2] w-full relative group mx-auto px-4 md:px-0 z-10">
        <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === 'dark' 
            ? 'shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]' 
            : 'shadow-[0_30px_50px_-15px_rgba(0,0,0,0.1)]'
        } md:hover:scale-[1.02] md:hover:shadow-[0_0_80px_-10px_rgba(0,207,255,0.2)]`}>
          
          <img 
            key={heroImage.substring(0, 100)} 
            src={heroImage} 
            className="w-full aspect-[1.3/1] md:aspect-[1.5/1] object-cover transition-transform duration-1000 md:group-hover:scale-105"
            alt="Fuzzi Esquadrias de Alumínio"
          />

          <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none transition-opacity duration-500 ${
            theme === 'dark' ? 'from-slate-950/40 to-transparent' : 'from-black/5 to-transparent'
          }`}></div>
          
          {isAdmin && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-fuzzi-blue text-white rounded-2xl font-black shadow-xl active:scale-90 flex items-center gap-2 hover:bg-fuzzi-blue/90 transition-colors">
                <Camera className="w-5 h-5"/> Alterar Foto
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>

      {isCropping && tempImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <div className={`w-full max-w-2xl rounded-[3rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-2xl'}`}>
            <div className="p-6 border-b flex items-center justify-between"><h3 className="font-black">Ajustar Capa</h3><button onClick={() => setIsCropping(false)} className="p-2 hover:bg-red-500/10 rounded-full transition-colors"><X className="w-6 h-6"/></button></div>
            <div className="p-8 space-y-8">
              <div ref={viewerRef} className="relative w-full aspect-[1.5/1] rounded-[2rem] overflow-hidden bg-black border-4 border-fuzzi-blue/30 touch-none shadow-inner" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopDragging} onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={stopDragging}>
                <img ref={imgRef} src={tempImage} className="absolute max-w-none pointer-events-none" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, left: '50%', top: '50%', width: '100%', height: 'auto', marginLeft: '-50%', marginTop: '-50%' }} />
              </div>
              <div className="flex items-center gap-5 px-2">
                <ZoomIn className="w-5 h-5 opacity-40" />
                <input type="range" min="0.5" max="4" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-fuzzi-blue h-1.5 rounded-lg appearance-none bg-slate-200 dark:bg-slate-700" />
              </div>
              <button onClick={handleApplyCrop} className="w-full py-5 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all">Salvar Alteração</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
