
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
import ProductGrid from './components/ProductGrid'; 
import ConfirmModal from './components/ConfirmModal'; 
import WhatsAppIcon from './components/WhatsAppIcon';
import { Loader2, ArrowRight, FileText } from 'lucide-react';

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
    try {
      await supabase.from('site_config').upsert({ key: 'catalog', value: pdf });
      await fetchData();
    } catch (e) {
      alert("Erro ao salvar configuração do catálogo.");
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
    if (password === '12') { 
      setIsAdminAuthenticated(true);
    }
  };

  const onLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const mainCatalog = pdfCatalogs[0] || INITIAL_PDF_CATALOGS[0];
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent("Olá! Gostaria de falar com um vendedor sobre os produtos da Fuzzi.")}`;

  return (
    <div className={`min-h-screen transition-theme flex flex-col max-w-full overflow-x-hidden relative ${theme === 'dark' ? 'bg-[#050a14] text-white' : 'bg-white text-slate-900'}`}>
      <Header 
        theme={theme} view={view} setView={setView} toggleTheme={toggleTheme} 
        openAdminProduct={() => { setCurrentProduct(null); setIsEditing(false); setIsAdminProductOpen(true); }} 
        openAdminPDF={() => setIsAdminPDFOpen(true)} 
        openAdminTestimonial={() => { if(testimonials.length >= 10) return alert("Limite de 10 atingido"); setCurrentTestimonial(null); setIsAdminTestimonialOpen(true); }}
        isAdmin={isAdminAuthenticated} testimonialsCount={testimonials.length}
      />

      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-[#050a14]/60 backdrop-blur-xl flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-fuzzi-blue animate-spin" />
        </div>
      )}

      <main className={`flex-grow transition-opacity duration-700 max-w-full overflow-x-hidden ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <section id="inicio" className="container mx-auto px-4 pt-24 pb-12 md:pb-20 min-h-[90vh] flex items-center scroll-mt-24">
          <Hero theme={theme} setView={setView} heroImage={heroImage} isAdmin={isAdminAuthenticated} onHeroImageChange={handleHeroChange} />
        </section>

        <section id="diferenciais" className="py-12 md:py-24 scroll-mt-24"><Features theme={theme} /></section>
        
        <section id="destaques" className="container mx-auto px-4 py-8 md:py-24 scroll-mt-24 overflow-x-hidden">
          <div className="max-w-7xl mx-auto mb-10">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuzzi-blue/10 text-fuzzi-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6 border border-fuzzi-blue/5 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuzzi-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuzzi-blue"></span>
                </span>
                Vitrine Principal
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-tight">Projetos em <span className="text-fuzzi-blue">Destaque</span></h2>
              <p className="mt-3 text-base md:text-lg opacity-60 font-medium max-w-2xl">
                Explore nossa seleção de projetos que demonstram o auge da sofisticação e engenharia Fuzzi.
              </p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <ProductGrid 
              products={products} 
              theme={theme} 
              isAdmin={isAdminAuthenticated} 
              onEdit={(p) => { setCurrentProduct(p); setIsEditing(true); setIsAdminProductOpen(true); }} 
              onDelete={(id) => setConfirmDelete({isOpen:true, type:'product', id})} 
              onSelect={setSelectedProduct} 
            />
          </div>
        </section>

        <section id="depoimentos" className="pt-8 pb-10 md:py-24 scroll-mt-24 md:min-h-[90vh] flex items-center overflow-x-hidden">
          <div className="w-full">
            <Testimonials theme={theme} testimonials={testimonials} isAdmin={isAdminAuthenticated} onEdit={(t)=>{setCurrentTestimonial(t);setIsAdminTestimonialOpen(true)}} onDelete={(id)=>setConfirmDelete({isOpen:true, type:'testimonial', id})} />
          </div>
        </section>

        <section id="catalogo" className="pt-10 pb-12 md:py-32 scroll-mt-24 md:min-h-[90vh] flex items-center overflow-x-hidden">
          <div className="container mx-auto px-4 w-full">
            <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                <div className={`p-8 md:p-16 lg:p-24 flex flex-col justify-center space-y-8 md:space-y-10 relative z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuzzi-blue/20 text-fuzzi-blue text-[10px] font-black uppercase tracking-widest rounded-full border border-fuzzi-blue/20">
                      <FileText className="w-3.5 h-3.5"/> Catálogo Técnico
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black leading-tight">
                      {mainCatalog?.title || 'Catálogo de Esquadrias'}
                    </h2>
                    <p className={`text-base md:text-xl font-medium leading-relaxed max-w-md opacity-70`}>
                      Confira as especificações técnicas, detalhes construtivos e opções de acabamentos exclusivos.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <a href={mainCatalog?.pdfUrl} target="_blank" className="group w-full sm:w-fit flex items-center justify-center gap-3 px-8 py-4 bg-fuzzi-blue text-white font-black rounded-2xl shadow-xl shadow-fuzzi-blue/20 hover:scale-105 transition-all active:scale-95 text-xs md:text-sm uppercase tracking-wider whitespace-nowrap">
                      Veja nosso catálogo
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href={whatsappUrl} target="_blank" className="flex w-full sm:w-fit items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-black rounded-2xl shadow-xl shadow-[#25D366]/20 hover:scale-105 transition-all active:scale-95 text-xs md:text-sm uppercase tracking-wider whitespace-nowrap">
                      <WhatsAppIcon className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                      Fale com um vendedor
                    </a>
                  </div>
                </div>
                <div className="absolute lg:relative inset-0 lg:inset-auto w-full h-full lg:min-h-full z-0 overflow-hidden">
                  <img src={mainCatalog?.coverImage || DEFAULT_HERO_IMAGE} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Capa do Catálogo" />
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent' : 'bg-gradient-to-r from-slate-50 via-slate-50/60 to-transparent'} lg:block hidden`}></div>
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-50/80'} lg:hidden block`}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp CTA */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[105] group flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#25D366] rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        title="Fale Conosco no WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        <WhatsAppIcon className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
      </a>

      <Footer theme={theme} isAdmin={isAdminAuthenticated} onAdminToggle={onLogout} onLogin={onLoginSuccess} setView={setView} setIsLoginOpen={()=>{}} isLoginOpen={false} />
      {selectedProduct && <ProductDetail product={selectedProduct} theme={theme} onClose={()=>setSelectedProduct(null)} />}
      {isAdminProductOpen && <AdminModal theme={theme} onClose={()=>setIsAdminProductOpen(false)} onSave={handleSaveProduct} editProduct={currentProduct} isEditing={isEditing} />}
      {isAdminTestimonialOpen && <TestimonialModal theme={theme} onClose={()=>setIsAdminTestimonialOpen(false)} onSave={handleSaveTestimonial} editTestimonial={currentTestimonial} />}
      {isAdminPDFOpen && <CatalogPDFModal theme={theme} onClose={()=>setIsAdminPDFOpen(false)} onSave={handleSavePDF} editPDF={mainCatalog} />}
      <ConfirmModal theme={theme} isOpen={confirmDelete.isOpen} title="Confirmar exclusão?" message="Esta ação é permanente." onConfirm={executeDelete} onCancel={()=>setConfirmDelete({isOpen:false, type:null, id:null})} />
    </div>
  );
};

export default App;
