
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
      <div className="text-center mb-10 md:mb-16">
        <h2 className={`text-3xl md:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Por que escolher a <br className="md:hidden" /> <span className="text-fuzzi-blue">Fuzzi?</span>
        </h2>
        <p className={`max-w-2xl mx-auto text-sm md:text-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Combinamos tradição em esquadrias com as tecnologias mais modernas do mercado para entregar excelência.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {FEATURES.map((feature, index) => (
          <div 
            key={index}
            className={`group p-5 md:p-8 rounded-3xl md:rounded-[2rem] border transition-[transform,border-color,background-color] duration-300 will-change-transform hover:-translate-y-1 flex flex-col ${
              theme === 'dark' 
                ? 'bg-slate-900/50 border-slate-800 hover:border-fuzzi-blue/50 hover:bg-slate-900' 
                : 'bg-white border-fuzzi-blue/5 hover:border-fuzzi-blue/20 shadow-sm hover:shadow-xl hover:shadow-fuzzi-blue/5'
            }`}
          >
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-transform duration-500 group-hover:rotate-6 will-change-transform ${
              theme === 'dark' ? 'bg-fuzzi-blue/10 text-fuzzi-blue' : 'bg-fuzzi-blue/5 text-fuzzi-blue'
            }`}>
              <feature.icon className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            
            <h3 className={`text-sm md:text-2xl font-black mb-2 md:mb-3 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {feature.title}
            </h3>
            
            <p className={`leading-relaxed text-xs md:text-lg flex-grow ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {feature.description}
            </p>
            
            <div className={`mt-4 md:mt-6 h-1 w-8 group-hover:w-12 transition-[width] duration-300 rounded-full bg-fuzzi-blue`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
