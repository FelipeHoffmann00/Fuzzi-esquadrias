
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  featured: boolean;
}

export interface CatalogPDF {
  id: string;
  title: string;
  coverImage: string;
  pdfUrl: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  image: string;
  service: string;
}

export type Theme = 'light' | 'dark';
export type View = 'home';
