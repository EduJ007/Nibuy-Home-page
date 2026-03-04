import React, { useState, useEffect } from 'react';
import { productsData } from '../products';
import { ExternalLink } from 'lucide-react';
import { auth } from '../firebase';

const protectedRedirect = (url: string) => {
  if (auth.currentUser) {
    window.location.href = url;
  } else {
    window.dispatchEvent(new Event('showNibuyWarning'));
  }
};

const FlashSales: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [randomProducts, setRandomProducts] = useState<any[]>([]);

  // Função de Semente para os produtos não mudarem no F5, apenas quando o cronómetro zerar
  const getSeedProducts = (seed: number) => {
    const allFlashSales = productsData.filter(p => p.isFlashSale);
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    return [...allFlashSales]
      .sort((a, b) => seededRandom(a.id + seed) - seededRandom(b.id + seed))
      .slice(0, 8);
  };

  useEffect(() => {
    const updateTimerAndProducts = () => {
      // Horário de Brasília
      const now = new Date();
      const brasiliaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
      
      // Reset à meia-noite
      const nextReset = new Date(brasiliaTime);
      nextReset.setHours(24, 0, 0, 0); 

      const diff = nextReset.getTime() - brasiliaTime.getTime();

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({ h, m, s });

      // Produtos mudam apenas quando o dia mudar em Brasília
      const dateSeed = brasiliaTime.getFullYear() * 10000 + (brasiliaTime.getMonth() + 1) * 100 + brasiliaTime.getDate();
      setRandomProducts(getSeedProducts(dateSeed));
    };

    updateTimerAndProducts();
    const interval = setInterval(updateTimerAndProducts, 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  const parsePrice = (priceStr: string) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  };

  return (
    <section className="bg-white mt-12 md:mt-20 w-[93%] md:w-[98%] max-w-[1500px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">
      
      {/* HEADER ORIGINAL */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-gray-300 bg-gray-50/20">
        <div className="flex flex-wrap items-center gap-2 md:gap-6">
          <h2 className="text-[#ff5722] font-black text-xl md:text-2xl uppercase italic tracking-tighter shrink-0">
            Ofertas Relâmpago
          </h2>
          <div className="flex gap-1 items-center scale-90 md:scale-100 origin-left">
            <div className="bg-black text-white px-2 py-0.5 md:py-1 rounded-md font-bold text-[14px] md:text-sm">{format(timeLeft.h)}</div>
            <span className="font-bold text-xs">:</span>
            <div className="bg-black text-white px-2 py-0.5 md:py-1 rounded-md font-bold text-[14px] md:text-sm">{format(timeLeft.m)}</div>
            <span className="font-bold text-xs">:</span>
            <div className="bg-black text-white px-2 py-0.5 md:py-1 rounded-md font-bold text-[14px] md:text-sm">{format(timeLeft.s)}</div>
          </div>
        </div>
        <button onClick={() => protectedRedirect("https://nibuy-produtos.vercel.app/")} className="text-blue-600 font-black text-[14px] md:text-[13px] uppercase tracking-widest shrink-0">
          Ver Tudo ›
        </button>
      </div>

      {/* GRID ORIGINAL COM O ESTILO DOS CARDS VOLTADO */}
      <div className="relative group">
        <div className="flex md:grid md:grid-cols-6 overflow-x-auto md:overflow-hidden border-l border-gray-50 scrollbar-hide snap-x snap-mandatory px-2 md:px-0">
          {randomProducts.map((p, index) => {
            const vAtual = parsePrice(p.price);
            const vAntigo = p.oldPrice ? parsePrice(p.oldPrice) : vAtual * 2.5;
            const valorDesconto = vAntigo > vAtual ? Math.round(((vAntigo - vAtual) / vAntigo) * 100) : 0;
            
            return (
              <div key={p.id} className={`w-[210px] md:w-auto flex-shrink-0 border-r border-b border-gray-150 p-5 md:p-7 transition-colors duration-200 hover:bg-gray-50/50 relative group/item snap-start ${index >= 6 ? 'md:hidden' : ''}`}>
                
                {/* Imagem com Badge de Desconto */}
                <div className="relative aspect-square rounded-xl md:rounded-2xl mb-3 md:mb-4 overflow-hidden bg-gray-50 border border-gray-100">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105" />
                  <div className="absolute top-0 right-0 bg-[#ffe910] text-[#ff5722] text-[10px] md:text-[11px] font-black px-2 py-1 rounded-bl-xl md:rounded-bl-2xl shadow-sm z-10">
                    -{valorDesconto}%
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 line-through text-[10px] md:text-[11px]">
                    {p.oldPrice || `R$ ${vAntigo.toFixed(2).replace('.', ',')}`}
                  </span>
                  <div className="flex items-baseline mb-1.5 md:mb-2">
                    <span className="text-xl md:text-2xl font-black text-[#ff5722] italic tracking-tighter leading-none">
                      {p.price}
                    </span>
                  </div>

                  {/* Barrinha de Progresso Original */}
                  <div className="w-full bg-[#ff5722]/20 h-3 md:h-4 rounded-full relative overflow-hidden mb-3 md:mb-4">
                    <div className="absolute left-0 top-0 h-full bg-[#ff5722] w-[85%] rounded-full"></div>
                    <span className="absolute inset-0 text-[7px] md:text-[8px] font-black text-white flex items-center justify-center uppercase">
                       {p.sold || '85%'} vendidos
                    </span>
                  </div>

                  {/* Botão de Visualizar */}
                  <button 
                    onClick={() => protectedRedirect(p.link || '#')} 
                    className="w-full py-2 bg-gray-900 text-white rounded-lg md:rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#ff5722] transition-all border-none cursor-pointer"
                  >
                    Visualizar <ExternalLink size={10} />
                  </button>
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