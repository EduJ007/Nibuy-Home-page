import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../products';
import { Zap } from 'lucide-react';

const FlashSales: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const ITEMS_TO_SHOW = 6;

  useEffect(() => {
    const updateTimerAndProducts = () => {
      const now = new Date();
      const brasiliaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
      const nextReset = new Date(brasiliaTime);
      nextReset.setHours(24, 0, 0, 0);
      const diff = nextReset.getTime() - brasiliaTime.getTime();
      
      setTimeLeft({
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });

      const dateSeed = brasiliaTime.getFullYear() * 10000 + (brasiliaTime.getMonth() + 1) * 100 + brasiliaTime.getDate();
      const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
      };

      const allFlashSales = productsData.filter(p => p.isFlashSale);
      const shuffled = [...allFlashSales]
        .sort((a, b) => seededRandom(Number(a.id) + dateSeed) - seededRandom(Number(b.id) + dateSeed))
        .slice(0, ITEMS_TO_SHOW);

      setPaginatedProducts(shuffled);
    };

    updateTimerAndProducts();
    const interval = setInterval(updateTimerAndProducts, 1000);
    return () => clearInterval(interval);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="bg-white mt-24 w-full max-w-[1600px] mx-auto md:rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
      
      {/* HEADER DINÂMICO */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-gradient-to-r from-[#ff5722] to-[#ff8a50]">
        <div className="flex items-center gap-4 mb-3 md:mb-0">
          <div className="bg-white p-2 rounded-lg text-[#ff5722] animate-pulse">
            <Zap size={24} fill="currentColor" />
          </div>
          <h2 className="text-white text-xl md:text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            Ofertas <span className="bg-white text-[#ff5722] px-2 rounded">Relâmpago</span>
          </h2>

          <div className="flex gap-2 items-center ml-2">
            <span className="bg-black/20 text-white px-2 py-1 rounded-md font-mono font-bold text-lg backdrop-blur-sm border border-white/20">{format(timeLeft.h)}</span>
            <span className="font-bold text-white animate-bounce">:</span>
            <span className="bg-black/20 text-white px-2 py-1 rounded-md font-mono font-bold text-lg backdrop-blur-sm border border-white/20">{format(timeLeft.m)}</span>
            <span className="font-bold text-white animate-bounce">:</span>
            <span className="bg-black/20 text-white px-2 py-1 rounded-md font-mono font-bold text-lg backdrop-blur-sm border border-white/20">{format(timeLeft.s)}</span>
          </div>
        </div>

        <button onClick={() => navigate("/Lista-produtos?sort=flash")} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-5 rounded-full border border-white/30 transition-all text-sm uppercase tracking-widest">
          Ver Todas as Ofertas
        </button>
      </div>

      {/* ÁREA DOS PRODUTOS */}
      <div className="px-4 py-6 bg-orange-50/30">
        <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-4 no-scrollbar snap-x">
          {paginatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => { navigate(`/produto/${p.externalId}`); window.scrollTo(0,0); }} 
              className="min-w-[180px] md:min-w-0 flex flex-col bg-white rounded-xl p-2 shadow-sm border border-transparent hover:border-[#ff5722] transition-all cursor-pointer group snap-start relative overflow-hidden"
            >
              <div className="relative aspect-square mb-3 bg-white rounded-lg overflow-hidden border border-gray-50">
                <img src={p.img} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-0 right-0 bg-[#ffe910] text-[#ff5722] text-[12px] font-black px-2 py-1 rounded-bl-xl shadow-md">
                  {p.discount || '20% OFF'}
                </div>
              </div>

              <div className="flex flex-col items-center mt-auto px-1">
                <span className="text-[#ff5722] text-2xl font-black italic tracking-tighter mb-3">{p.price}</span>
                
                {/* BARRA DE VENDIDOS ESTILO SHOPEE */}
                <div className="w-full bg-[#ffbdad] h-5 rounded-full relative overflow-hidden border border-[#ff5722]/20">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#ff5722] to-[#ee4d2d] w-[75%] rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.1)]"></div>
                  <span className="absolute inset-0 text-[10px] font-black text-white flex items-center justify-center uppercase tracking-tighter">
                    {p.sold || 'QUASE ESGOTADO'} Vendidos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSales;