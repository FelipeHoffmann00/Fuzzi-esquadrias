
import React from 'react';
import { ShieldCheck, PencilRuler, Hammer, Clock, ThumbsUp, Ruler } from 'lucide-react';
import { Theme } from '../types';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Qualidade Premium",
    description: "Materiais de alta durabilidade e acabamento impecável em todos os nossos produtos de alumínio."
  },
  {
    icon: PencilRuler,
    title: "Projetos Sob Medida",
    description: "Soluções personalizadas que se adaptam perfeitamente ao seu espaço, arquitetura e necessidades."
  },
  {
    icon: Hammer,
    title: "Instalação Profissional",
    description: "Equipe própria e especializada para garantir a perfeita instalação técnica e funcionamento."
  },
  {
    icon: Clock,
    title: "Entrega no Prazo",
    description: "Compromisso real com cronogramas e transparência total em todas as etapas do seu projeto."
  },
  {
    icon: ThumbsUp,
    title: "Garantia Estendida",
    description: "Oferecemos garantia superior ao mercado, assegurando a tranquilidade do seu investimento."
  },
  {
    icon: Ruler,
    title: "Medição Precisa",
    description: "Avaliação técnica detalhada com equipamentos de ponta para garantir o encaixe milimétrico."
  }
];

interface FeaturesProps {
  theme: Theme;
}

const Features: React.FC<FeaturesProps> = ({ theme }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-10 md:mb-12">
        <h2 className={`text-3xl md:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Por que escolher a <br className="md:hidden" /> <span className="text-fuzzi-blue">Fuzzi?</span>
        </h2>
        <p className={`max-w-2xl mx-auto text-sm md:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Combinamos tradição em esquadrias com as tecnologias mais modernas do mercado para entregar excelência.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {FEATURES.map((feature, index) => (
          <div 
            key={index}
            className={`group p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] transition-all duration-500 will-change-transform hover:-translate-y-3 flex flex-col ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border border-slate-800 hover:border-fuzzi-blue/50 hover:bg-slate-900 shadow-2xl shadow-black/20' 
                : 'bg-white border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] text-slate-900'
            }`}
          >
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center mb-5 md:mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 will-change-transform ${
              theme === 'dark' ? 'bg-fuzzi-blue/10 text-fuzzi-blue' : 'bg-fuzzi-blue/10 text-fuzzi-blue shadow-lg shadow-fuzzi-blue/10'
            }`}>
              <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            
            <h3 className={`text-base md:text-2xl font-black mb-3 md:mb-4 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {feature.title}
            </h3>
            
            <p className={`leading-relaxed text-xs md:text-lg flex-grow font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {feature.description}
            </p>
            
            <div className={`mt-6 md:mt-8 h-1 w-8 group-hover:w-16 transition-[width] duration-500 rounded-full bg-fuzzi-blue`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
