
import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Camera, Image as ImageIcon, AlertCircle, MessageSquare, Loader2 } from 'lucide-react';
import { Product, Theme } from '../types';

interface AdminModalProps {
  theme: Theme;
  onClose: () => void;
  onSave: (product: Product) => void;
  editProduct?: Product | null;
  isEditing: boolean;
}

const MAX_IMAGES = 15;
const MAX_DIMENSION = 800; 

const AdminModal: React.FC<AdminModalProps> = ({ theme, onClose, onSave, editProduct, isEditing }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editProduct && isEditing) {
      setName(editProduct.name);
      setDescription(editProduct.description);
      setImages(editProduct.images || []);
    }
  }, [editProduct, isEditing]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      cameraInputRef.current?.click();
    } catch (err) {
      cameraInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles) as File[];
    const currentCount = images.length;
    
    if (currentCount >= MAX_IMAGES) {
      setError(`Limite de ${MAX_IMAGES} fotos atingido.`);
      e.target.value = '';
      return;
    }

    const availableSlots = MAX_IMAGES - currentCount;
    const filesToProcess = filesArray.slice(0, availableSlots);

    setIsProcessing(true);
    const newImages: string[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      try {
        const base64 = await resizeImage(filesToProcess[i]);
        newImages.push(base64);
      } catch (err) {
        console.error("Erro ao processar imagem", err);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
    e.target.value = '';
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIMENSION) {
              height *= MAX_DIMENSION / width;
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width *= MAX_DIMENSION / height;
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
            reject(new Error("Erro ao criar contexto 2D"));
          }
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || images.length === 0) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const product: Product = {
      id: isEditing && editProduct ? editProduct.id : `prod_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      images: images,
      featured: true
    };

    onSave(product);
  };

  const isLimitReached = images.length >= MAX_IMAGES;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        <div className="sticky top-0 z-10 p-6 border-b flex items-center justify-between bg-inherit border-inherit">
          <h2 className="text-xl font-black">{isEditing ? 'Editar Destaque' : 'Novo Destaque'}</h2>
          <button onClick={onClose} className="p-2.5 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Produto</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Janela Integrada" className={`w-full px-5 py-4 rounded-2xl border outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Descrição detalhada das especificações..." className={`w-full px-5 py-4 rounded-2xl border outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`} />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-slate-400">Fotos ({images.length}/{MAX_IMAGES})</span></div>
            <div className="flex gap-4">
              <button type="button" disabled={isLimitReached || isProcessing} onClick={() => fileInputRef.current?.click()} className="flex-1 p-6 rounded-2xl border-2 border-dashed border-fuzzi-blue/20 text-fuzzi-blue hover:bg-fuzzi-blue/5 flex flex-col items-center gap-2"><ImageIcon className="w-6 h-6"/><span className="text-[10px] font-black uppercase">Galeria</span></button>
              <button type="button" disabled={isLimitReached || isProcessing} onClick={requestCameraPermission} className="flex-1 p-6 rounded-2xl border-2 border-dashed border-fuzzi-blue/20 text-fuzzi-blue hover:bg-fuzzi-blue/5 flex flex-col items-center gap-2"><Camera className="w-6 h-6"/><span className="text-[10px] font-black uppercase">Câmera</span></button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
            
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                </div>
              ))}
            </div>
            {isProcessing && <div className="text-center py-2 text-fuzzi-blue animate-pulse text-xs font-black">Processando...</div>}
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black opacity-50">Cancelar</button>
            <button type="submit" disabled={isProcessing} className="flex-1 py-4 bg-fuzzi-blue text-white font-black rounded-2xl shadow-lg">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
