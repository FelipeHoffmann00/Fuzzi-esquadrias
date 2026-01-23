
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
import { FileText, Loader2 } from 'lucide-react';

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

  // Carregamento de dados do Supabase
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Buscar Produtos
      const { data: prods, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (prods && prods.length > 0) setProducts(prods);
      else setProducts(INITIAL_PRODUCTS);

      // Buscar Depoimentos
      const { data: tests, error: testErr } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (tests && tests.length > 0) setTestimonials(tests);
      else setTestimonials(INITIAL_TESTIMONIALS);

      // Buscar Configurações (Hero e Catálogo)
      const { data: config } = await supabase.from('site_config').select('*');
      const heroCfg = config?.find(c => c.key === 'hero_image');
      const pdfCfg = config?.find(c => c.key === 'catalog');

      if (heroCfg) setHeroImage(heroCfg.value.url);
      if (pdfCfg) setPdfCatalogs([pdfCfg.value]);
      else setPdfCatalogs(INITIAL_PDF_CATALOGS);

    } catch (e) {
      console.error("Erro ao carregar dados do Supabase:", e);
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
    const publicUrl = await uploadImage(base64OrUrl, 'hero');
    setHeroImage(publicUrl);
    await supabase.from('site_config').upsert({ key: 'hero_image', value: { url: publicUrl } });
  };

  const handleSaveProduct = async (product: Product) => {
    setIsLoading(true);
    try {
      // Upload de imagens novas (as que são base64)
      const uploadedImages = await Promise.all(
        product.images.map(img => img.startsWith('data:') ? uploadImage(img, 'products') : img)
      );

      const productToSave = { ...product, images: uploadedImages };
      
      const { error } = await supabase.from('products').upsert(productToSave);
      if (error) throw error;
      
      await fetchData();
      setIsAdminProductOpen(false);
      setIsEditing(false);
    } catch (e) {
      alert("Erro ao salvar produto no banco de dados.");
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
      const testimonialToSave = { ...testimonial, image: imageUrl };

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
      await supabase.from(table).delete().eq('id', confirmDelete.id);
      await fetchData();
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
        <div className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-fuzzi-blue animate-spin" />
            <span className="font-black text-xs uppercase tracking-widest text-fuzzi-blue">Sincronizando...</span>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <section id="inicio" className="container mx-auto px-4 pt-24 min-h-[90vh] md:min-h-screen">
          <Hero theme={theme} setView={setView} heroImage={heroImage} isAdmin={isAdminAuthenticated} onHeroImageChange={handleHeroChange} />
        </section>
        <section id="diferenciais" className="py-10 md:py-24"><Features theme={theme} /></section>
        <section id="produtos" className="container mx-auto px-4 py-10 md:py-20">
          <div className="mb-12 text-center md:text-left">
            <span className="text-fuzzi-blue font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Nossa Vitrine</span>
            <h2 className="text-4xl md:text-6xl font-black">Projetos de <span className="text-fuzzi-blue">Alto Padrão</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} theme={theme} isAdmin={isAdminAuthenticated} onEdit={() => { setCurrentProduct(p); setIsEditing(true); setIsAdminProductOpen(true); }} onDelete={(id) => setConfirmDelete({isOpen:true, type:'product', id})} onSelect={setSelectedProduct} />
            ))}
          </div>
        </section>
        <section id="catalogo" className="py-10 md:py-24">
          <div className="container mx-auto px-4">
            <div className={`relative overflow-hidden rounded-[3rem] border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                <div className="p-8 md:p-16 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuzzi-blue text-white text-[10px] font-black uppercase rounded-full"><FileText className="w-4 h-4"/> Catálogo Técnico</div>
                  <h2 className="text-3xl md:text-5xl font-black">{mainCatalog?.title}</h2>
                  <p className="opacity-70">Confira as especificações técnicas e opções de acabamentos.</p>
                  <div className="flex gap-4">
                    <a href={mainCatalog?.pdfUrl} target="_blank" className="px-8 py-4 bg-fuzzi-blue text-white font-black rounded-xl shadow-lg">Acessar PDF</a>
                  </div>
                </div>
                <div className="hidden lg:block h-full"><img src={mainCatalog?.coverImage} className="w-full h-full object-cover"/></div>
              </div>
            </div>
          </div>
        </section>
        <section id="depoimentos" className="py-10"><Testimonials theme={theme} testimonials={testimonials} isAdmin={isAdminAuthenticated} onEdit={(t)=>{setCurrentTestimonial(t);setIsAdminTestimonialOpen(true)}} onDelete={(id)=>setConfirmDelete({isOpen:true, type:'testimonial', id})} /></section>
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
