
import React, { useEffect, useState, useRef } from 'react';
import { Users, Award, ShieldCheck, MapPin } from 'lucide-react';
import { Theme } from '../types';

interface StatItemProps {
  icon: React.ElementType;
  value?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  theme: Theme;
  isLast?: boolean;
  isText?: boolean;
  textValue?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, value, prefix = "", suffix = "", label, theme, isLast, isText, textValue }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !isText && value !== undefined) {
      let start = 0;
      const end = value;
      // Ajuste na velocidade para números maiores como 7000
      const steps = 60; 
      const increment = end / steps;
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isVisible, value, isText]);

  // Formata o número com ponto para milhares (ex: 7.000)
  const formattedCount = count.toLocaleString('pt-BR');

  return (
    <div 
      ref={domRef}
      className="group relative flex flex-col items-center flex-1"
    >
      {/* Linha Conectora (Timeline) */}
      {!isLast && (
        <div className={`absolute top-6 left-1/2 w-full h-[1px] -z-0 opacity-20 hidden md:block ${theme === 'dark' ? 'bg-fuzzi-blue' : 'bg-slate-300'}`}></div>
      )}

      {/* Conteúdo */}
      <div className="flex flex-col items-center text-center space-y-3 relative z-10 transition-transform duration-500 group-hover:scale-110">
        <div className="p-3 rounded-2xl bg-fuzzi-blue/10 text-fuzzi-blue group-hover:bg-fuzzi-blue group-hover:text-white transition-all duration-500 shadow-sm ring-4 ring-transparent group-hover:ring-fuzzi-blue/20">
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        
        <div className="space-y-0.5">
          <div className={`text-xl md:text-3xl font-black tracking-tighter transition-colors duration-500 whitespace-nowrap ${theme === 'dark' ? 'text-white group-hover:text-fuzzi-blue' : 'text-slate-900 group-hover:text-fuzzi-blue'}`}>
            {isText ? textValue : `${prefix}${formattedCount}${suffix}`}
          </div>
          <div className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity duration-500 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {label}
          </div>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-16 h-16 bg-fuzzi-blue/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>
    </div>
  );
};

interface StatsProps {
  theme: Theme;
}

const Stats: React.FC<StatsProps> = ({ theme }) => {
  return (
    <div className="w-full py-4">
      <div className="flex flex-row items-start justify-between md:gap-4">
        <StatItem theme={theme} icon={Users} value={7000} prefix="+" label="Projetos entregues" />
        <StatItem theme={theme} icon={Award} value={22} suffix=" Anos" label="no mercado" />
        <StatItem theme={theme} icon={ShieldCheck} value={100} suffix="%" label="Alumínio" />
        <StatItem theme={theme} icon={MapPin} isText={true} textValue="Sumaré" label="e região" isLast={true} />
      </div>
    </div>
  );
};

export default Stats;
