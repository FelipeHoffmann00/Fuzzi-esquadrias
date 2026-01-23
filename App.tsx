
import React, { useState, useEffect } from 'react';
import { Product, Testimonial, Theme, View, CatalogPDF } from './types';
import { INITIAL_PRODUCTS, INITIAL_TESTIMONIALS, INITIAL_PDF_CATALOGS, WHATSAPP_NUMBER } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import AdminModal from './components/AdminModal';
import TestimonialModal from './components/TestimonialModal';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import Features from './components/Features';
import ProductDetail from './components/ProductDetail'; 
import ProductCard from './components/ProductCard'; 
import WhatsAppIcon from './components/WhatsAppIcon';
import ConfirmModal from './components/ConfirmModal'; // Importado
import { FileText, ExternalLink } from 'lucide-react';

const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pdfCatalogs, setPdfCatalogs] = useState<CatalogPDF[]>([]);
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  
  const [isAdminProductOpen, setIsAdminProductOpen] = useState(false);
  const [isAdminTestimonialOpen, setIsAdminTestimonialOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Estado para controle da exclusão
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'product' | 'testimonial' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  // Carregamento Inicial
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('fuzzi_products');
      setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);

      const savedTestimonials = localStorage.getItem('fuzzi_testimonials');
      setTestimonials(savedTestimonials ? JSON.parse(savedTestimonials) : INITIAL_TESTIMONIALS);

      const savedPDFs = localStorage.getItem('fuzzi_pdfs');
      setPdfCatalogs(savedPDFs ? JSON.parse(savedPDFs) : INITIAL_PDF_CATALOGS);

      const savedHero = localStorage.getItem('fuzzi_hero_image');
      if (savedHero) setHeroImage(savedHero);

      const savedTheme = localStorage.getItem('fuzzi_theme') as Theme;
      if (savedTheme) setTheme(savedTheme);

      const auth = localStorage.getItem('fuzzi_admin_auth');
      if (auth === 'true') setIsAdminAuthenticated(true);
    } catch (e) {
      console.warn("Erro ao carregar dados. Iniciando com dados padrão.", e);
      setProducts(INITIAL_PRODUCTS);
      setTestimonials(INITIAL_TESTIMONIALS);
      setPdfCatalogs(INITIAL_PDF_CATALOGS);
    }
  }, []);

  // Persistência Automática
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem('fuzzi_products', JSON.stringify(products));
        localStorage.setItem('fuzzi_testimonials', JSON.stringify(testimonials));
        localStorage.setItem('fuzzi_hero_image', heroImage);
      } catch (e) {
        console.error("Erro ao salvar dados localmente:", e);
      }
    };
    const timeout = setTimeout(saveData, 500);
    return () => clearTimeout(timeout);
  }, [products, testimonials, heroImage]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('fuzzi_theme', newTheme);
  };

  const handleAdminToggle = () => {
    if (isAdminAuthenticated) {
      setIsAdminAuthenticated(false);
      localStorage.removeItem('fuzzi_admin_auth');
      setIsLoginOpen(false);
    } else {
      setIsLoginOpen(!isLoginOpen);
    }
  };

  const onLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('fuzzi_admin_auth', 'true');
    setIsLoginOpen(false);
  };

  const handleSaveProduct = (product: Product) => {
    if (!product.featured) {
      const originalProduct = products.find(p => p.id === product.id);
      if (originalProduct?.featured) {
        const featuredCount = products.filter(p => p.featured).length;
        if (featuredCount <= 1) {
          alert("A vitrine precisa de pelo menos um destaque. Marque outro produto como destaque antes de remover este.");
          return;
        }
      }
    }

    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      return exists ? prev.map(p => p.id === product.id ? product : p) : [product, ...prev];
    });
    setIsAdminProductOpen(false);
    setIsEditing(false);
  };

  // Solicita a exclusão do produto (abre modal)
  const handleDeleteProductRequest = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    const featuredCount = products.filter(p => p.featured).length;
    
    // REGRA DE SEGURANÇA: Impedir exclusão do único destaque
    if (productToDelete?.featured && featuredCount <= 1) {
        alert("Este é o único produto em destaque. A vitrine não pode ficar vazia.");
        return;
    }

    setConfirmDelete({ isOpen: true, type: 'product', id });
  };

  const handleSaveTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => {
      const exists = prev.find(t => t.id === testimonial.id);
      if (!exists && prev.length >= 5) {
        alert("Limite atingido! Máximo 5 depoimentos.");
        return prev;
      }
      return exists ? prev.map(t => t.id === testimonial.id ? testimonial : t) : [testimonial, ...prev];
    });
    setIsAdminTestimonialOpen(false);
  };

  // Solicita a exclusão do depoimento (abre modal)
  const handleDeleteTestimonialRequest = (id: string) => {
    if (testimonials.length <= 1) {
      alert("A vitrine precisa de pelo menos um depoimento.");
      return;
    }
    setConfirmDelete({ isOpen: true, type: 'testimonial', id });
  };

  // Executa a exclusão confirmada
  const executeDelete = () => {
    if (confirmDelete.type === 'product' && confirmDelete.id) {
      setProducts(prev => prev.filter(p => p.id !== confirmDelete.id));
      if (selectedProduct?.id === confirmDelete.id) {
        setSelectedProduct(null);
      }
    } else if (confirmDelete.type === 'testimonial' && confirmDelete.id) {
      setTestimonials(prev => prev.filter(t => t.id !== confirmDelete.id));
    }
    
    // Fecha o modal e limpa o estado
    setConfirmDelete({ isOpen: false, type: null, id: null });
  };

  const mainCatalog = pdfCatalogs[0] || INITIAL_PDF_CATALOGS[0];
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

  // Cálculo prévio de destaques para passar para o card
  const featuredCount = products.filter(p => p.featured).length;

  return (
    <div className={`min-h-screen transition-theme flex flex-col overflow-x-hidden ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-fuzzi-light text-slate-900'}`}>
      <Header 
        theme={theme} 
        view={view}
        setView={setView}
        toggleTheme={toggleTheme} 
        openAdminProduct={() => { setCurrentProduct(null); setIsEditing(false); setIsAdminProductOpen(true); }} 
        openAdminPDF={() => {}} 
        openAdminTestimonial={() => { 
          if (testimonials.length >= 5) {
            alert("Limite atingido! Remova um antigo para adicionar novo.");
            return;
          }
          setCurrentTestimonial(null); 
          setIsAdminTestimonialOpen(true); 
        }}
        isAdmin={isAdminAuthenticated}
        testimonialsCount={testimonials.length}
      />
      
      <main className="flex-grow">
        <div className="flex flex-col">
          <section id="inicio" className="min-h-screen flex flex-col justify-center container mx-auto px-4 pt-24">
            <Hero theme={theme} setView={setView} heroImage={heroImage} isAdmin={isAdminAuthenticated} onHeroImageChange={setHeroImage} />
          </section>

          <section id="diferenciais" className="min-h-screen flex flex-col justify-center bg-fuzzi-blue/5 dark:bg-slate-900/20 py-20">
            <Features theme={theme} />
          </section>
          
          <section id="produtos" className="min-h-screen flex flex-col justify-center container mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-16">
              <div className="max-w-xl text-center md:text-left">
                <span className="text-fuzzi-blue font-black uppercase tracking-[0.3em] text-[10px] block mb-4">Nossa Vitrine</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Projetos de <span className="text-fuzzi-blue">Alto Padrão</span></h2>
              </div>
              <p className={`max-w-md text-sm md:text-base text-center md:text-left ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                Cada peça é desenvolvida sob medida, unindo tecnologia de ponta e acabamento artesanal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  theme={theme} 
                  onEdit={() => { setCurrentProduct(p); setIsEditing(true); setIsAdminProductOpen(true); }} 
                  onDelete={handleDeleteProductRequest}
                  onSelect={(prod) => setSelectedProduct(prod)}
                  isAdmin={isAdminAuthenticated}
                  isDeleteDisabled={p.featured && featuredCount <= 1}
                />
              ))}
            </div>
          </section>

          <section id="catalogo" className="min-h-screen flex flex-col justify-center py-24 relative overflow-hidden bg-fuzzi-blue/5 dark:bg-slate-900/20">
              <div className="container mx-auto px-4">
                <div className={`relative overflow-hidden rounded-[4rem] border transition-theme ${
                  theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-fuzzi-blue/10 shadow-2xl shadow-fuzzi-blue/5'
                }`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                    <div className="p-12 lg:p-24 space-y-8">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuzzi-blue text-white text-[10px] font-black uppercase tracking-widest">
                        <FileText className="w-4 h-4" /> Especificações Técnicas
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black leading-tight">
                        {mainCatalog?.title || 'Catálogo de Esquadrias'}
                      </h2>
                      <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Confira todos os detalhes técnicos, acabamentos e tipologias disponíveis em nossa linha premium. Um material completo para arquitetos e clientes exigentes.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        <a href={mainCatalog?.pdfUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-10 py-5 bg-fuzzi-blue text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-fuzzi-blue/20 active:scale-95 text-lg">
                          <ExternalLink className="w-6 h-6" /> Acessar Catálogo
                        </a>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-3 px-10 py-5 font-black rounded-2xl border-2 transition-all duration-300 active:scale-95 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white text-lg ${theme === 'dark' ? 'border-slate-800 text-white' : 'border-fuzzi-blue/10 text-fuzzi-blue shadow-sm bg-white'}`}>
                          <WhatsAppIcon className="w-6 h-6 text-[#25D366] group-hover:text-white transition-colors" />
                          Falar com um vendedor
                        </a>
                      </div>
                    </div>
                    <div className="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden bg-slate-100 group">
                      <img src={mainCatalog?.coverImage} alt="Capa do Catálogo" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 lg:from-slate-900/80 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
          </section>

          <section id="depoimentos" className="min-h-screen flex flex-col justify-center py-20">
            <Testimonials 
              theme={theme} 
              testimonials={testimonials} 
              isAdmin={isAdminAuthenticated}
              onEdit={(t) => { setCurrentTestimonial(t); setIsAdminTestimonialOpen(true); }}
              onDelete={handleDeleteTestimonialRequest}
            />
          </section>
        </div>
      </main>

      <Footer theme={theme} isAdmin={isAdminAuthenticated} isLoginOpen={isLoginOpen} onAdminToggle={handleAdminToggle} onLogin={onLoginSuccess} setIsLoginOpen={setIsLoginOpen} setView={setView} />

      {/* Modais */}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          theme={theme} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {isAdminProductOpen && (
        <AdminModal theme={theme} onClose={() => setIsAdminProductOpen(false)} onSave={handleSaveProduct} editProduct={currentProduct} isEditing={isEditing} />
      )}
      {isAdminTestimonialOpen && (
        <TestimonialModal theme={theme} onClose={() => setIsAdminTestimonialOpen(false)} onSave={handleSaveTestimonial} editTestimonial={currentTestimonial} />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        theme={theme}
        isOpen={confirmDelete.isOpen}
        title="Tem certeza?"
        message={confirmDelete.type === 'product' 
          ? "Esta ação excluirá o produto permanentemente. Isso não pode ser desfeito." 
          : "Esta ação excluirá o depoimento permanentemente. Isso não pode ser desfeito."
        }
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
};

export default App;
