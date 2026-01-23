
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
      <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Por que escolher a <span className="text-fuzzi-blue">Fuzzi?</span>
        </h2>
        <p className={`max-w-2xl mx-auto text-lg md:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Combinamos tradição em esquadrias com as tecnologias mais modernas do mercado para entregar excelência.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, index) => (
          <div 
            key={index}
            className={`group p-8 rounded-[2rem] border transition-[transform,border-color,background-color] duration-300 will-change-transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-slate-800 hover:border-fuzzi-blue/50 hover:bg-slate-900' 
                : 'bg-white border-fuzzi-blue/5 hover:border-fuzzi-blue/20 shadow-sm hover:shadow-xl hover:shadow-fuzzi-blue/5'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:rotate-6 will-change-transform ${
              theme === 'dark' ? 'bg-fuzzi-blue/10 text-fuzzi-blue' : 'bg-fuzzi-blue/5 text-fuzzi-blue'
            }`}>
              <feature.icon className="w-7 h-7" />
            </div>
            
            <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {feature.title}
            </h3>
            
            <p className={`leading-relaxed text-base md:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {feature.description}
            </p>
            
            <div className={`mt-6 h-1 w-0 group-hover:w-12 transition-[width] duration-300 rounded-full bg-fuzzi-blue`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
