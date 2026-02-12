import React, { useState, useEffect, useRef } from 'react';
import { productsData } from '../products';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const FlashSales: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 24, m: 0, s: 0 });
  const [randomProducts, setRandomProducts] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allFlashSales = productsData.filter(p => p.isFlashSale);
    const shuffled = [...allFlashSales]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    
    setRandomProducts(shuffled);

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

  const parsePrice = (priceStr: string) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  };

  return (
    /* Adicionado mx-auto e w-[95%] para dar respiro nas laterais do celular */
    <section className="bg-white mt-20 md:mt-20 w-[95%] md:w-[98%] max-w-[1500px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">
      
      {/* Ajuste no Header: Usando flex-wrap e items-center para alinhar o Ver Tudo corretamente */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-gray-300 bg-gray-50/20">
        <div className="flex flex-wrap items-center gap-2 md:gap-6">
          <h2 className="text-[#ff5722] font-black text-sm md:text-2xl uppercase italic tracking-tighter shrink-0">
            Ofertas Relâmpago
          </h2>
          <div className="flex gap-1 items-center scale-90 md:scale-100 origin-left">
            <div className="bg-black text-white px-2 py-0.5 md:py-1 rounded-md font-bold text-[10px] md:text-sm">{format(timeLeft.h)}</div>
            <span className="font-bold text-xs">:</span>
            <div className="bg-black text-white px-2 py-0.5 md:py-1 rounded-md font-bold text-[10px] md:text-sm">{format(timeLeft.m)}</div>
            <span className="font-bold text-xs">:</span>
            <div className="bg-black text-white px-2 py-0.5 md:py-1 rounded-md font-bold text-[10px] md:text-sm">{format(timeLeft.s)}</div>
          </div>
        </div>
        
        {/* Ver Tudo alinhado à direita corretamente */}
        <a href="https://nibuy-produtos.vercel.app/" className="text-blue-600 hover:text-blue-800 font-black text-[10px] md:text-[13px] uppercase tracking-widest transition-colors shrink-0">
          Ver Tudo ›
        </a>
      </div>

      <div className="relative group">
        {/* Padding lateral no container do scroll para os cards não colarem na borda ao deslizar */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-6 border-l border-gray-50 scrollbar-hide snap-x snap-mandatory px-2 md:px-0">
          {randomProducts.map((p) => {
            const vAtual = parsePrice(p.price);
            const vAntigo = p.oldPrice ? parsePrice(p.oldPrice) : vAtual * 2.5;
            const desconto = vAntigo > vAtual ? Math.round(((vAntigo - vAtual) / vAntigo) * 100) : 0;
            const totalSold = p.sold || '0';

            return (
              <div 
                key={p.id} 
                className="w-[170px] md:w-auto flex-shrink-0 border-r border-b border-gray-150 p-4 md:p-6 transition-colors duration-200 hover:bg-gray-50/50 relative group/item snap-start"
              >
                <div className="relative aspect-square rounded-xl md:rounded-2xl mb-3 md:mb-4 overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105" />
                  <div className="absolute top-0 right-0 bg-[#ffe910] text-[#ff5722] text-[10px] md:text-[11px] font-black px-2 py-1 rounded-bl-xl md:rounded-bl-2xl shadow-sm z-10">
                    -{desconto}%
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 line-through text-[10px] md:text-[11px]">
                    {p.oldPrice || `R$ ${(vAtual * 2.5).toFixed(2).replace('.', ',')}`}
                  </span>
                  
                  <div className="flex items-baseline mb-1.5 md:mb-2">
                    <span className="text-lg md:text-xl font-black text-[#ff5722] italic tracking-tighter leading-none">
                      {p.price}
                    </span>
                  </div>
                  
                  <div className="w-full bg-[#ff5722]/20 h-3 md:h-4 rounded-full relative overflow-hidden mb-3 md:mb-4">
                    <div className="absolute left-0 top-0 h-full bg-[#ff5722] w-[85%] rounded-full"></div>
                    <span className="absolute inset-0 text-[7px] md:text-[8px] font-black text-white flex items-center justify-center uppercase">
                       {totalSold} vendidos
                    </span>
                  </div>

                  <a 
                    href={p.link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-gray-900 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#ff5722] transition-all duration-300 group/btn"
                  >
                    Visualizar <ExternalLink size={10} className="group-hover/btn:translate-x-1 transition-transform"/>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlashSales;