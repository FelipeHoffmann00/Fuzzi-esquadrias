
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  featured: boolean;
}

// Added Testimonial interface to fix export error
export interface Testimonial {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  image: string;
  service: string;
}

export interface CatalogPDF {
  id: string;
  title: string;
  coverImage: string;
  pdfUrl: string;
  // Added category property to fix property not found error in Catalog.tsx
  category?: string;
}

export type Theme = 'light' | 'dark';
export type View = 'home';