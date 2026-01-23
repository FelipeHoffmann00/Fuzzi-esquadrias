
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

const AdminModal: React.FC<AdminModalProps> = ({ theme, onClose, onSave, editProduct, isEditing }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Janelas');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editProduct && isEditing) {
      setName(editProduct.name);
      setDescription(editProduct.description);
      setCategory(editProduct.category);
      setImages(editProduct.images || []);
    }
  }, [editProduct, isEditing]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const base64 = await resizeImage(files[i]);
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
          const width = img.width;
          const height = img.height;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 1.0));
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
    setError(null);

    if (!name.trim()) { setError('O nome do produto é obrigatório.'); return; }
    if (!description.trim()) { setError('A descrição é obrigatória.'); return; }
    if (images.length === 0) { setError('Adicione pelo menos uma foto do produto.'); return; }

    const product: Product = {
      id: isEditing && editProduct ? editProduct.id : `prod_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      images: images,
      featured: true
    };

    onSave(product);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl transform animate-in zoom-in-95 duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'
      }`}>
        <div className="sticky top-0 z-10 p-6 border-b flex items-center justify-between bg-inherit border-inherit">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-fuzzi-blue rounded-2xl shadow-lg shadow-fuzzi-blue/20">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {isEditing ? 'Editar Destaque' : 'Novo Destaque'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome do Produto*</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => {setName(e.target.value); setError(null);}}
                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-[border-color,box-shadow] focus:ring-4 focus:ring-fuzzi-blue/10 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-fuzzi-blue/5 text-slate-900'
                }`}
                placeholder="Ex: Janela Integrada"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoria*</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-[border-color,box-shadow] focus:ring-4 focus:ring-fuzzi-blue/10 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-fuzzi-blue/5 text-slate-900'
                }`}
              >
                <option value="Janelas">Janelas</option>
                <option value="Portas">Portas</option>
                <option value="Portões">Portões</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição*</label>
            <textarea 
              value={description}
              onChange={(e) => {setDescription(e.target.value); setError(null);}}
              rows={3}
              className={`w-full px-5 py-4 rounded-2xl border outline-none transition-[border-color,box-shadow] focus:ring-4 focus:ring-fuzzi-blue/10 resize-none ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-fuzzi-blue/5 text-slate-900'
              }`}
              placeholder="Descreva os diferenciais técnicos do produto..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mídias do Produto*</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-7 rounded-[2rem] border-2 border-dashed transition-[border-color,color,background-color] duration-200 hover:border-fuzzi-blue hover:bg-fuzzi-blue/5 ${
                  theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-500' : 'bg-fuzzi-blue/5 border-fuzzi-blue/10 text-fuzzi-blue'
                }`}
              >
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px] font-black uppercase">Galeria</span>
              </button>
              <button 
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-7 rounded-[2rem] border-2 border-dashed transition-[border-color,color,background-color] duration-200 hover:border-fuzzi-blue hover:bg-fuzzi-blue/5 ${
                  theme === 'dark' ? 'bg-slate-800/50 border-slate-700 text-slate-500' : 'bg-fuzzi-blue/5 border-fuzzi-blue/10 text-fuzzi-blue'
                }`}
              >
                <Camera className="w-8 h-8" />
                <span className="text-[10px] font-black uppercase">Tirar Foto</span>
              </button>
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm will-change-transform hover:scale-105 transition-transform duration-200">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center justify-center gap-3 py-4 text-fuzzi-blue">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">Processando Fotos...</span>
              </div>
            )}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className={`flex-1 py-5 font-black rounded-2xl transition-[background-color,color] duration-200 ${
                theme === 'dark' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`flex-1 py-5 text-white font-black rounded-2xl transition-[background-color,transform,box-shadow] duration-200 shadow-xl active:scale-95 ${
                isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-fuzzi-blue hover:brightness-110 shadow-fuzzi-blue/20'
              }`}
            >
              {isEditing ? 'Salvar Tudo' : 'Confirmar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
