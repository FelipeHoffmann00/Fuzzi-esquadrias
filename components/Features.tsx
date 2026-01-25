
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
    description: "Materiais de alta durabilidade e acabamento impecável em todos os nossos produtos."
  },
  {
    icon: PencilRuler,
    title: "Projetos Sob Medida",
    description: "Soluções personalizadas que se adaptam perfeitamente ao seu espaço."
  },
  {
    icon: Hammer,
    title: "Instalação Profissional",
    description: "Equipe própria e especializada para garantir a perfeita instalação técnica."
  },
  {
    icon: Clock,
    title: "Entrega no Prazo",
    description: "Compromisso real com cronogramas e transparência total em todas as etapas."
  },
  {
    icon: ThumbsUp,
    title: "Garantia Estendida",
    description: "Oferecemos garantia superior ao mercado para o seu investimento."
  },
  {
    icon: Ruler,
    title: "Medição Precisa",
    description: "Avaliação técnica detalhada para garantir o encaixe milimétrico."
  }
];

interface FeaturesProps {
  theme: Theme;
}

const Features: React.FC<FeaturesProps> = ({ theme }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
      {FEATURES.map((feature, index) => (
        <div 
          key={index}
          className={`group p-6 md:p-10 rounded-[1.8rem] md:rounded-[3rem] transition-all duration-500 will-change-transform hover:-translate-y-2 flex flex-col items-start text-left min-h-[250px] h-full justify-between ${
            theme === 'dark' 
              ? 'bg-slate-900/40 border border-slate-800 hover:border-fuzzi-blue/40 hover:bg-slate-900 shadow-2xl' 
              : 'bg-white border border-slate-100 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.08)] hover:shadow-xl'
          }`}
        >
          <div className="w-full flex-1 flex flex-col">
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
              theme === 'dark' ? 'bg-fuzzi-blue/10 text-fuzzi-blue' : 'bg-fuzzi-blue/10 text-fuzzi-blue shadow-lg shadow-fuzzi-blue/5'
            }`}>
              <feature.icon className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            
            <h3 className={`text-[15px] md:text-2xl font-black mb-2 md:mb-3 leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {feature.title}
            </h3>
            
            <p className={`leading-snug md:leading-relaxed text-[14px] md:text-base font-medium opacity-60`}>
              {feature.description}
            </p>
          </div>
          
          <div className={`mt-4 md:mt-8 h-1 w-6 md:h-1.5 md:w-10 group-hover:w-12 md:group-hover:w-20 transition-[width] duration-500 rounded-full bg-fuzzi-blue shadow-[0_0_8px_rgba(0,207,255,0.4)]`}></div>
        </div>
      ))}
    </div>
  );
};

export default Features;
