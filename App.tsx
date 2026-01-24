
import React, { useState, useEffect, useCallback } from 'react';
import { Product, Testimonial, Theme, View, CatalogPDF } from './types';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, INITIAL_PDF_CATALOGS, WHATSAPP_NUMBER } from './constants';
import { supabase, uploadImage } from './supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import AdminModal from './components/AdminModal';
import TestimonialModal from './components/TestimonialModal';
import CatalogPDFModal from './components/CatalogPDFModal';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import Features from './components/Features';
import ProductDetail from './components/ProductDetail'; 
import ProductCard from './components/ProductCard'; 
import ConfirmModal from './components/ConfirmModal'; 
import WhatsAppIcon from './components/WhatsAppIcon';
import { FileText, Loader2, ArrowRight } from 'lucide-react';

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pdfCatalogs, setPdfCatalogs] = useState<CatalogPDF[]>([]);
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdminProductOpen, setIsAdminProductOpen] = useState(false);
  const [isAdminTestimonialOpen, setIsAdminTestimonialOpen] = useState(false);
  const [isAdminPDFOpen, setIsAdminPDFOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'product' | 'testimonial' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: prods } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prods && prods.length > 0) setProducts(prods);
      else setProducts(INITIAL_PRODUCTS);

      const { data: tests } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (tests && tests.length > 0) setTestimonials(tests);
      else setTestimonials(INITIAL_TESTIMONIALS);

      const { data: config } = await supabase.from('site_config').select('*');
      const heroCfg = config?.find(c => c.key === 'hero_image');
      const pdfCfg = config?.find(c => c.key === 'catalog');

      if (heroCfg) setHeroImage(heroCfg.value.url);
      if (pdfCfg) setPdfCatalogs([pdfCfg.value]);
      else setPdfCatalogs(INITIAL_PDF_CATALOGS);

    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const savedTheme = localStorage.getItem('fuzzi_theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, [fetchData]);

  const handleHeroChange = async (base64OrUrl: string) => {
    setIsLoading(true);
    try {
      const publicUrl = await uploadImage(base64OrUrl, 'hero');
      setHeroImage(publicUrl);
      await supabase.from('site_config').upsert({ key: 'hero_image', value: { url: publicUrl } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setIsLoading(true);
    try {
      const uploadedImages = await Promise.all(
        product.images.map(img => img.startsWith('data:') ? uploadImage(img, 'products') : img)
      );

      const productToSave = { 
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        images: uploadedImages,
        featured: product.featured,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('products').upsert(productToSave);
      if (error) throw error;
      
      await fetchData();
      setIsAdminProductOpen(false);
      setIsEditing(false);
    } catch (e: any) {
      alert("Erro ao salvar: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePDF = async (pdf: CatalogPDF) => {
    setIsLoading(true);
    try {
      const coverUrl = pdf.coverImage.startsWith('data:') ? await uploadImage(pdf.coverImage, 'catalogs') : pdf.coverImage;
      const pdfToSave = { ...pdf, coverImage: coverUrl };
      
      await supabase.from('site_config').upsert({ key: 'catalog', value: pdfToSave });
      await fetchData();
      setIsAdminPDFOpen(false);
    } catch (e) {
      alert("Erro ao salvar catálogo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTestimonial = async (testimonial: Testimonial) => {
    setIsLoading(true);
    try {
      const imageUrl = testimonial.image.startsWith('data:') ? await uploadImage(testimonial.image, 'testimonials') : testimonial.image;
      const testimonialToSave = { 
        ...testimonial, 
        image: imageUrl,
        created_at: new Date().toISOString()
      };

      await supabase.from('testimonials').upsert(testimonialToSave);
      await fetchData();
      setIsAdminTestimonialOpen(false);
    } catch (e) {
      alert("Erro ao salvar depoimento.");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete.id) return;
    setIsLoading(true);
    try {
      const table = confirmDelete.type === 'product' ? 'products' : 'testimonials';
      const { error } = await supabase.from(table).delete().eq('id', confirmDelete.id);
      if (error) throw error;
      await fetchData();
    } catch (e: any) {
      alert("Erro ao deletar: " + e.message);
    } finally {
      setIsLoading(false);
      setConfirmDelete({ isOpen: false, type: null, id: null });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('fuzzi_theme', newTheme);
  };

  const onLoginSuccess = (password: string) => {
    if (password === '123') setIsAdminAuthenticated(true);
  };

  const mainCatalog = pdfCatalogs[0] || INITIAL_PDF_CATALOGS[0];
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent("Olá! Gostaria de falar com um vendedor sobre os produtos da Fuzzi.")}`;

  return (
    <div className={`min-h-screen transition-theme flex flex-col overflow-x-hidden ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <Header 
        theme={theme} view={view} setView={setView} toggleTheme={toggleTheme} 
        openAdminProduct={() => { setCurrentProduct(null); setIsEditing(false); setIsAdminProductOpen(true); }} 
        openAdminPDF={() => setIsAdminPDFOpen(true)} 
        openAdminTestimonial={() => { if(testimonials.length >= 10) return alert("Limite de 10 atingido"); setCurrentTestimonial(null); setIsAdminTestimonialOpen(true); }}
        isAdmin={isAdminAuthenticated} testimonialsCount={testimonials.length}
      />

      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-fuzzi-blue animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-fuzzi-blue rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center">
              <span className="font-black text-[10px] uppercase tracking-[0.3em] text-fuzzi-blue block">Nuvem Fuzzi</span>
              <span className="text-sm font-bold opacity-60">Sincronizando dados...</span>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <section id="inicio" className="container mx-auto px-4 pt-24 pb-12 md:pb-20 min-h-[90vh] flex items-center scroll-mt-24">
          <Hero theme={theme} setView={setView} heroImage={heroImage} isAdmin={isAdminAuthenticated} onHeroImageChange={handleHeroChange} />
        </section>

        <section id="diferenciais" className="py-12 md:py-20 scroll-mt-20 md:scroll-mt-28"><Features theme={theme} /></section>
        
        <section id="produtos" className="container mx-auto px-4 py-10 md:py-20 scroll-mt-20 md:scroll-mt-28">
          {/* Header alinhado com max-w-7xl */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-10 border border-fuzzi-blue/5 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuzzi-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuzzi-blue"></span>
                </span>
                Nossa Vitrine
              </div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight">Projetos de <span className="text-fuzzi-blue">Alto Padrão</span></h2>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} theme={theme} isAdmin={isAdminAuthenticated} onEdit={() => { setCurrentProduct(p); setIsEditing(true); setIsAdminProductOpen(true); }} onDelete={(id) => setConfirmDelete({isOpen:true, type:'product', id})} onSelect={setSelectedProduct} />
            ))}
          </div>
        </section>

        <section id="depoimentos" className="py-10 scroll-mt-20 md:scroll-mt-28 min-h-[90vh] flex items-center">
          <div className="w-full">
            <Testimonials theme={theme} testimonials={testimonials} isAdmin={isAdminAuthenticated} onEdit={(t)=>{setCurrentTestimonial(t);setIsAdminTestimonialOpen(true)}} onDelete={(id)=>setConfirmDelete({isOpen:true, type:'testimonial', id})} />
          </div>
        </section>

        <section id="catalogo" className="py-10 md:py-24 scroll-mt-20 md:scroll-mt-28 min-h-[90vh] flex items-center">
          <div className="container mx-auto px-4 w-full">
            <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border shadow-2xl ${theme === 'dark' ? 'bg-[#0a0f1a] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center space-y-8 md:space-y-10 relative z-10 text-white lg:text-inherit">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuzzi-blue/20 text-fuzzi-blue text-[10px] font-black uppercase tracking-widest rounded-full border border-fuzzi-blue/20">
                      <FileText className="w-3.5 h-3.5"/> Catálogo Técnico
                    </div>
                    <h2 className={`text-4xl md:text-6xl font-black leading-tight ${theme === 'dark' ? 'text-white' : 'lg:text-slate-900 text-white'}`}>
                      {mainCatalog?.title || 'Catálogo de Esquadrias'}
                    </h2>
                    <p className={`text-lg md:text-xl font-medium leading-relaxed max-w-md text-white opacity-100 ${theme === 'dark' ? 'lg:text-slate-300 lg:opacity-60' : 'lg:text-slate-600 lg:opacity-60'}`}>
                      Confira as especificações técnicas, detalhes construtivos e opções de acabamentos exclusivos.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href={mainCatalog?.pdfUrl} target="_blank" className="group flex items-center justify-center gap-3 px-8 py-5 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl shadow-fuzzi-blue/20 hover:scale-105 transition-all active:scale-95 text-sm uppercase tracking-wider">
                      Veja nosso catálogo
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href={whatsappUrl} target="_blank" className="flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] text-white font-black rounded-2xl shadow-xl shadow-[#25D366]/20 hover:scale-105 transition-all active:scale-95 text-sm uppercase tracking-wider">
                      <WhatsAppIcon className="w-5 h-5 fill-white" />
                      Fale com um vendedor
                    </a>
                  </div>
                </div>
                <div className="absolute lg:relative inset-0 lg:inset-auto w-full h-full lg:min-h-full z-0">
                  <img src={mainCatalog?.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'} className="absolute inset-0 w-full h-full object-cover" alt="Capa do Catálogo" />
                  <div className={`absolute inset-0 bg-gradient-to-b from-black/100 via-black/85 to-black/100 lg:bg-none lg:bg-gradient-to-r ${theme === 'dark' ? 'lg:from-[#0a0f1a] lg:via-transparent lg:to-transparent' : 'lg:from-slate-50 lg:via-transparent lg:to-transparent'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer theme={theme} isAdmin={isAdminAuthenticated} onAdminToggle={()=>setIsAdminAuthenticated(false)} onLogin={onLoginSuccess} setView={setView} setIsLoginOpen={()=>{}} isLoginOpen={false} />
      {selectedProduct && <ProductDetail product={selectedProduct} theme={theme} onClose={()=>setSelectedProduct(null)} />}
      {isAdminProductOpen && <AdminModal theme={theme} onClose={()=>setIsAdminProductOpen(false)} onSave={handleSaveProduct} editProduct={currentProduct} isEditing={isEditing} />}
      {isAdminTestimonialOpen && <TestimonialModal theme={theme} onClose={()=>setIsAdminTestimonialOpen(false)} onSave={handleSaveTestimonial} editTestimonial={currentTestimonial} />}
      {isAdminPDFOpen && <CatalogPDFModal theme={theme} onClose={()=>setIsAdminPDFOpen(false)} onSave={handleSavePDF} editPDF={mainCatalog} />}
      <ConfirmModal theme={theme} isOpen={confirmDelete.isOpen} title="Confirmar exclusão?" message="Esta ação é permanente." onConfirm={executeDelete} onCancel={()=>setConfirmDelete({isOpen:false, type:null, id:null})} />
    </div>
  );
};

export default App;
