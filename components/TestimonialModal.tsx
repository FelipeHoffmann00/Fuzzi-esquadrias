
import React, { useState, useEffect, useRef } from 'react';
// Fix: Added Camera to imports
import { X, Image as ImageIcon, AlertCircle, Star, ZoomIn, Check, Maximize, Move, Camera } from 'lucide-react';
import { Testimonial, Theme } from '../types';

interface TestimonialModalProps {
  theme: Theme;
  onClose: () => void;
  onSave: (testimonial: Testimonial) => void;
  editTestimonial?: Testimonial | null;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ theme, onClose, onSave, editTestimonial }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [service, setService] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showGuides, setShowGuides] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (editTestimonial) {
      setName(editTestimonial.name);
      setCity(editTestimonial.city);
      setText(editTestimonial.text);
      setRating(editTestimonial.rating);
      setService(editTestimonial.service);
      setImage(editTestimonial.image);
    }
  }, [editTestimonial]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      fileInputRef.current?.setAttribute('capture', 'environment');
      fileInputRef.current?.click();
    } catch (err) {
      console.warn("Permissão de câmera não concedida:", err);
      fileInputRef.current?.removeAttribute('capture');
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImage(event.target?.result as string);
      setIsCropping(true);
      setZoom(1.2);
      setPosition({ x: -20, y: -20 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
    
    let newX = clientX - startPos.x;
    let newY = clientY - startPos.y;

    const snapThreshold = 15;
    if (Math.abs(newX) < snapThreshold) newX = 0;
    if (Math.abs(newY) < snapThreshold) newY = 0;

    setPosition({ x: newX, y: newY });
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

    canvas.width = 800;
    canvas.height = 1000;

    const viewer = viewerRef.current.getBoundingClientRect();
    const img = imgRef.current.getBoundingClientRect();

    const scaleX = imgRef.current.naturalWidth / img.width;
    const scaleY = imgRef.current.naturalHeight / img.height;

    const cropX = (viewer.left - img.left) * scaleX;
    const cropY = (viewer.top - img.top) * scaleY;
    const cropW = viewer.width * scaleX;
    const cropH = viewer.height * scaleY;

    ctx.drawImage(imgRef.current, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

    setImage(canvas.toDataURL('image/jpeg', 0.8));
    setIsCropping(false);
    setTempImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !text || !service || !image) {
      setError("Preencha todos os campos e selecione uma foto.");
      return;
    }
    onSave({ id: editTestimonial?.id || `test_${Date.now()}`, name, city, text, rating, service, image });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl transition-all ${
        theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="p-6 border-b border-inherit flex items-center justify-between sticky top-0 bg-inherit z-10">
          <h2 className="text-xl font-black">{editTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}</h2>
          <button onClick={onClose} className="p-2 hover:text-red-500 transition-colors"><X /></button>
        </div>
        
        {isCropping && tempImage ? (
          <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4">
            <div className="text-center">
              <h3 className="text-xl font-black text-blue-600 mb-1">Enquadre sua Foto</h3>
              <p className="text-xs text-slate-400">Arraste para centralizar.</p>
            </div>

            <div 
              ref={viewerRef}
              className="relative w-full max-w-[260px] aspect-[4/5] mx-auto rounded-[2rem] overflow-hidden bg-slate-100 border-[6px] border-blue-600 shadow-2xl cursor-move touch-none"
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
                alt="Crop preview" 
                className="absolute max-w-none transition-transform duration-75 pointer-events-none"
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
              
              {showGuides && (
                <>
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.5)] pointer-events-none"></div>
                  <div className="absolute top-0 left-1/2 w-[1px] h-full bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.5)] pointer-events-none"></div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
                <ZoomIn className="w-5 h-5 text-blue-500" />
                <input 
                  type="range" min="0.5" max="5" step="0.01" 
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-600 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCropping(false)} className="px-6 py-4 font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-2xl">Cancelar</button>
                <button type="button" onClick={handleApplyCrop} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> Confirmar Recorte
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex gap-2 animate-bounce"><AlertCircle className="w-5 h-5"/> {error}</div>}

            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <button 
                  type="button" 
                  onClick={() => {
                    fileInputRef.current?.removeAttribute('capture');
                    fileInputRef.current?.click();
                  }}
                  className={`relative aspect-[4/5] w-28 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500 group shadow-lg ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-blue-100'
                  }`}
                >
                  {image ? <img src={image} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-blue-600" />}
                  <span className="text-[7px] font-black uppercase text-blue-600 mt-1">Galeria</span>
                </button>

                <button 
                  type="button" 
                  onClick={requestCameraPermission}
                  className={`relative aspect-[4/5] w-28 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500 group shadow-lg ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-blue-100'
                  }`}
                >
                  <Camera className="w-6 h-6 text-blue-600" />
                  <span className="text-[7px] font-black uppercase text-blue-600 mt-1">Câmera</span>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Nome</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-blue-100 text-slate-900'}`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Cidade</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-blue-100 text-slate-900'}`} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Serviço</label>
                <input type="text" value={service} onChange={e => setService(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-blue-100 text-slate-900'}`} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Depoimento</label>
                <textarea rows={3} value={text} onChange={e => setText(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-blue-100 text-slate-900'}`} />
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                <label className="text-[10px] font-black uppercase text-slate-400">Avaliação</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button key={num} type="button" onClick={() => setRating(num)} className={rating >= num ? 'text-yellow-400' : 'text-slate-300'}>
                      <Star className={`w-5 h-5 ${rating >= num ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500">Cancelar</button>
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl">Salvar Tudo</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TestimonialModal;
