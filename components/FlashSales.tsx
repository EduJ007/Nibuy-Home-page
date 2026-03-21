import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importa o hook
import { productsData } from '../products';

const FlashSales: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [paginatedProducts, setPaginatedProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate(); // 2. Inicializa o hook
  
  const ITEMS_PER_PAGE = 6;
  const TOTAL_PAGES_LIMIT = 3; 

  // Função de redirecionamento ajustada
  const handleRedirect = (url: string) => {
    if (!url) return;

    if (url.startsWith('http')) {
      // Se for link externo (Amazon/Shopee), abre em nova aba
      window.open(url, "_blank");
    } else {
      // Se for link interno (ex: /Lista-produtos), usa o navigate
      navigate(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const updateTimerAndProducts = () => {
      const now = new Date();
      const brasiliaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );

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
        .sort((a, b) => seededRandom(a.id + dateSeed) - seededRandom(b.id + dateSeed))
        .slice(0, ITEMS_PER_PAGE * TOTAL_PAGES_LIMIT);

      const start = currentPage * ITEMS_PER_PAGE;
      setPaginatedProducts(shuffled.slice(start, start + ITEMS_PER_PAGE));
    };

    updateTimerAndProducts();
    const interval = setInterval(updateTimerAndProducts, 1000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const format = (n: number) => n.toString().padStart(2, '0');
  
  const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
  };

  return (
    <section className="bg-white mt-12 md:mt-20 w-[93%] max-w-[1500px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-gray-300 bg-gray-50/20">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <h2 className="text-[#ff5722] text-[24px] font-black uppercase tracking-tighter">
            Oferta Relâmpago
          </h2>

          <div className="flex gap-1 items-center scale-90 md:scale-110 origin-left">
            <div className="bg-black text-white px-2 py-1 rounded-md font-bold text-sm">{format(timeLeft.h)}</div>
            <span className="font-bold text-xs">:</span>
            <div className="bg-black text-white px-2 py-1 rounded-md font-bold text-sm">{format(timeLeft.m)}</div>
            <span className="font-bold text-xs">:</span>
            <div className="bg-black text-white px-2 py-1 rounded-md font-bold text-sm">{format(timeLeft.s)}</div>
          </div>
        </div>

        <button
          onClick={() => handleRedirect("/Lista-produtos?sort=flash")} // 3. Rota interna com filtro
          className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline"
        >
          Ver Tudo ›
        </button>
      </div>

      {/* ÁREA DOS PRODUTOS */}
      <div className="relative px-4 md:px-12 py-6">
        
        <button 
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 items-center justify-center hover:bg-gray-100 text-black disabled:hidden shadow-[0_0_6px_rgba(0,0,0,0.25)] z-10"
        >
          ❮
        </button>

        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 overflow-x-auto md:overflow-visible min-h-[320px] pb-2">
          {paginatedProducts.map((p) => {
            const vAtual = parsePrice(p.price);
            const vAntigo = p.oldPrice ? parsePrice(p.oldPrice) : vAtual * 1.3;
            const valorDesconto = vAntigo > vAtual ? Math.round(((vAntigo - vAtual) / vAntigo) * 100) : 15;

            return (
              <div
                key={p.id}
                onClick={() => handleRedirect(p.link || '#')} // 4. Abre o link externo do produto
                className="min-w-[210px] md:min-w-0 w-full flex flex-col bg-white rounded-lg p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-200 hover:border-[#ff5722]"
              >
                <div className="relative flex items-center justify-center h-44 mb-3">
                  <img src={p.img} alt={p.name} className="max-h-full object-contain rounded-lg" />
                  <div className="absolute top-0 right-1 bg-[#ffe910] text-[#ff5722] text-[10px] font-black px-2 py-0.5 rounded-bl-xl">
                    -{valorDesconto}%
                  </div>
                </div>

                <span className="text-gray-400 line-through text-[14px]">
                  {p.oldPrice || `R$ ${vAntigo.toFixed(2).replace('.', ',')}`}
                </span>
                <span className="block text-[24px] font-extrabold text-[#ff5722] tracking-tight">
                  {p.price}
                </span>

                <div className="w-full bg-gray-100 h-6 rounded-full relative overflow-hidden mt-auto">
                  <div className="absolute left-0 top-0 h-full bg-[#ff5722] w-[85%] rounded-full transition-all duration-500"></div>
                  <span className="absolute inset-0 text-[10px] font-black text-white flex items-center justify-center uppercase drop-shadow-sm">
                    {p.sold || '85%'} vendidos
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          disabled={currentPage >= TOTAL_PAGES_LIMIT - 1}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 items-center justify-center hover:bg-gray-100 shadow-[0_0_6px_rgba(0,0,0,0.25)] z-10 disabled:hidden"
        >
            ❯
        </button>
      </div>
    </section>
  );
};

export default FlashSales;