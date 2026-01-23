
import { Product, Testimonial, CatalogPDF } from './types';

export const DEFAULT_TESTIMONIAL_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';
export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Janela Integrada Automatizada',
    description: 'Janela de alumínio com persiana integrada e acionamento por controle remoto. Acabamento premium em pintura eletrostática preta e isolamento termoacústico. Sistema anti-ruído perfeito para dormitórios.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Janelas',
    featured: true
  },
  {
    id: '2',
    name: 'Porta de Correr 3 Folhas',
    description: 'Porta de correr de alto padrão com trilhos embutidos e vedação acústica superior. Ideal para varandas e salas de estar de luxo. Vidros temperados de 10mm e roldanas blindadas.',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Portas',
    featured: true
  },
  {
    id: '3',
    name: 'Portão Basculante Alumínio',
    description: 'Portão leve e resistente em alumínio, com design ripado moderno. Inclui motor de alta performance e sistema de segurança anti-esmagamento. Pintura amadeirada opcional.',
    images: [
      'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1623940228318-77c85856c666?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Portões',
    featured: true
  }
];

export const INITIAL_PDF_CATALOGS: CatalogPDF[] = [
  {
    id: 'pdf_1',
    title: 'Catálogo de Esquadrias',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    pdfUrl: '#',
    category: 'Principal'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "Carlos Lima",
    city: "Sumaré, SP",
    text: "Janelas impecáveis! O acabamento é de primeira e o atendimento foi excelente desde o primeiro contato. Valorizou muito meu apartamento.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    service: "Janelas de Alumínio"
  },
  {
    id: '2',
    name: "Mariana Souza",
    city: "Nova Odessa, SP",
    text: "Colocamos o portão basculante e ficou lindo. Muito silencioso e seguro. A equipe de instalação foi muito cuidadosa e limpa.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1628592102171-39a2d46f8519?auto=format&fit=crop&q=80&w=800",
    service: "Portão Automático"
  },
  {
    id: '3',
    name: "Ricardo Mendes",
    city: "Campinas, SP",
    text: "Fizemos toda a fachada da empresa com a Fuzzi. Material de extrema qualidade e um pós-venda que realmente funciona. Recomendo.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    service: "Fachada Glazing"
  }
];

export const WHATSAPP_NUMBER = '+5519984462287';
