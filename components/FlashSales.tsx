import React, { useState, useEffect, useRef } from 'react';
import { productsData } from '../products';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Importe as setinhas

const FlashSales: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 24, m: 0, s: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer (Mantive o seu original)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (h === 0 && m === 0 && s === 0) return { h: 24, m: 0, s: 0 };
        if (s > 0) s--;
        else if (m > 0) { s = 59; m--; }
        else if (h > 0) { s = 59; m = 59; h--; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  // Função para rodar o carrossel para o lado
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const flashSaleProducts = productsData.filter(p => p.isFlashSale);

  return (
    <section className="bg-white mt-4 rounded-sm shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header com Timer */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-[#ee4d2d] font-bold text-xl uppercase tracking-tight italic">Ofertas Relâmpago</h2>
          <div className="flex gap-1 items-center">
            <span className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold text-sm">{format(timeLeft.h)}</span>
            <span className="font-bold">:</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold text-sm">{format(timeLeft.m)}</span>
            <span className="font-bold">:</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded-sm font-bold text-sm">{format(timeLeft.s)}</span>
          </div>
        </div>
        <button className="text-[#ee4d2d] text-sm font-medium hover:underline">Ver Tudo &gt;</button>
      </div>

      {/* Container do Carrossel com as Setas */}
      <div className="relative group p-4">
        {/* Seta Esquerda */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hidden group-hover:flex hover:bg-white transition-all text-gray-600 border border-gray-100"
        >
          <ChevronLeft size={24} />
        </button>

        {/* LISTA DE PRODUTOS COM SCROLL */}
<div 
  ref={scrollRef}
  className="flex overflow-x-auto scrollbar-hide gap-3 px-4 pb-4 snap-x snap-mandatory"
  style={{ scrollBehavior: 'smooth' }}
>
  {flashSaleProducts.map((p) => (
    /* 1. Transformamos a div principal em um link <a> */
    <a 
      key={p.id} 
      href={p.link || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-[170px] md:w-[190px] flex-shrink-0 cursor-pointer snap-start group bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 block"
    >
      {/* Container da Imagem */}
      <div className="relative aspect-square bg-white mb-2 overflow-hidden border border-gray-100 group-hover:border-transparent transition-colors">
        <img 
          src={p.img} 
          alt={p.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Selo % OFF */}
        <div className="absolute top-0 right-0 bg-[#ffe910] text-[#ee4d2d] text-[10px] font-bold px-1 py-0.5 z-10">
          60% OFF
        </div>
      </div>

      {/* Preço e Barra de Progresso */}
      <div className="text-center px-1">
        <div className="h-8 flex items-center justify-center">
          <span className="text-lg font-bold text-[#ee4d2d]">{p.price}</span>
        </div>
        
        <div className="mt-1 w-full bg-[#ffbdab] h-4 rounded-full relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-[#ee4d2d] rounded-full" style={{ width: '85%' }}></div>
          <span className="absolute inset-0 text-[9px] font-bold text-white flex items-center justify-center uppercase tracking-tighter">
             QUASE ESGOTADO
          </span>
        </div>
      </div>
    </a>
  ))}
</div>

        {/* Seta Direita */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hidden group-hover:flex hover:bg-white transition-all text-gray-600 border border-gray-100"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default FlashSales;