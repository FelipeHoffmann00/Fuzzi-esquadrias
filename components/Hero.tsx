
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

    // Resolução otimizada para o Hero (1000px é suficiente para qualquer celular)
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
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(imgRef.current, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

    // Qualidade 0.6 reduz drasticamente o peso da string Base64 no celular
    const finalData = canvas.toDataURL('image/jpeg', 0.6);
    onHeroImageChange(finalData);
    setIsCropping(false);
    setTempImage(null);
  };

  return (
    <div className="py-8 md:py-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
      <div className="flex-1 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 mx-auto lg:mx-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuzzi-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuzzi-blue"></span>
          </span>
          Qualidade em cada detalhe
        </div>
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Design & Qualidade <br />
          em <span className="text-fuzzi-blue">Esquadrias</span>
        </h1>
        <p className={`text-lg md:text-2xl mb-8 max-w-xl mx-auto lg:mx-0 opacity-70`}>
          Soluções sob medida em alumínio para transformar seu ambiente com durabilidade e estética.
        </p>
      </div>

      <div className="flex-1 w-full relative group mx-auto">
        <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] transition-all duration-700 ease-out ${
          theme === 'dark' ? 'shadow-[0_30px_100px_-20px_rgba(0,0,200,0.4)]' : 'shadow-2xl'
        }`}>
          <img 
            key={heroImage.substring(0, 100)} // Key instável para forçar re-render parcial no celular
            src={heroImage} 
            className="w-full aspect-square object-cover"
          />
          {isAdmin && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-fuzzi-blue text-white rounded-2xl font-black shadow-xl active:scale-90 flex items-center gap-2"><Camera className="w-5 h-5"/> Alterar Foto</button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>

      {isCropping && tempImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={`w-full max-w-lg rounded-[3rem] overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className="p-6 border-b flex items-center justify-between"><h3 className="font-black">Ajustar Capa</h3><button onClick={() => setIsCropping(false)}><X /></button></div>
            <div className="p-8 space-y-6">
              <div ref={viewerRef} className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-black border-4 border-fuzzi-blue touch-none" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopDragging} onTouchStart={onMouseDown} onTouchMove={onMouseMove} onTouchEnd={stopDragging}>
                <img ref={imgRef} src={tempImage} className="absolute max-w-none pointer-events-none" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`, left: '50%', top: '50%', width: '100%', height: 'auto', marginLeft: '-50%', marginTop: '-50%' }} />
              </div>
              <input type="range" min="0.5" max="4" step="0.01" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-fuzzi-blue" />
              <button onClick={handleApplyCrop} className="w-full py-4 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl">Salvar Alteração</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
