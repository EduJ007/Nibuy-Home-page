import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../products';

const FlashSales: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  
  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES_LIMIT = 3; 

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
        .slice(0, ITEMS_PER_PAGE * TOTAL_PAGES_LIMIT);

      const start = currentPage * ITEMS_PER_PAGE;
      setPaginatedProducts(shuffled.slice(start, start + ITEMS_PER_PAGE));
    };

    updateTimerAndProducts();
    const interval = setInterval(updateTimerAndProducts, 1000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="bg-white mt-20 md:mt-20 w-[95%] md:w-[95%] max-w-[1600px] mx-auto md:rounded-lg shadow-sm overflow-hidden border-b md:border border-gray-200">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 md:py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 md:gap-6">
          <h2 className="text-[#ff5722] text-lg md:text-2xl font-black uppercase italic tracking-tighter">
            Oferta <span className="text-[#ff5722]">Relâmpago</span>
          </h2>

          <div className="flex gap-1 items-center">
            <span className="bg-black text-white px-1.5 py-0.5 rounded font-bold text-sm">{format(timeLeft.h)}</span>
            <span className="font-bold text-black">:</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded font-bold text-sm">{format(timeLeft.m)}</span>
            <span className="font-bold text-black">:</span>
            <span className="bg-black text-white px-1.5 py-0.5 rounded font-bold text-sm">{format(timeLeft.s)}</span>
          </div>
        </div>

        <button onClick={() => navigate("/Lista-produtos?sort=flash")} className="text-[#ff5722] font-medium text-xs md:text-[16px] flex items-center">
          Ver Tudo <span className="ml-1 text-lg">›</span>
        </button>
      </div>

      {/* ÁREA DOS PRODUTOS - Scroll horizontal no mobile */}
      <div className="relative px-2 md:px-4 py-4">
        <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-2 md:gap-3 no-scrollbar snap-x">
          {paginatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => { navigate(`/produto/${p.externalId}`); window.scrollTo(0,0); }} 
              className="min-w-[160px] md:min-w-0 flex flex-col bg-white rounded-sm p-1 border border-transparent hover:border-[#ff5722] transition-all cursor-pointer group snap-start"
            >
              <div className="relative aspect-square mb-2 bg-gray-50 overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute top-0 right-0 bg-[#ffe910]/90 text-[#ff5722] text-[12px] font-black px-1.5 py-0.5 rounded-bl-md">
                  -{p.discount || '20%'}
                </div>
              </div>

              <div className="flex flex-col items-center mt-auto">
                <span className="text-[#ff5722] text-lg font-bold leading-none mb-2">{p.price}</span>
                
                {/* BARRA DE VENDIDOS */}
                <div className="w-full bg-[#ff5722] h-5 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-[#ee4d2d] w-[70%] rounded-full"></div>
                  <span className="absolute inset-0 text-[12px] font-bold text-white flex items-center justify-center uppercase ">
                    {p.sold} Vendidos
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