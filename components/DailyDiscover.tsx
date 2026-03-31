import React, { useMemo } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../products';

const DailyDiscover: React.FC = () => {
  const navigate = useNavigate();

  const discoverProducts = useMemo(() => {
    const baseProducts = productsData.filter(p => !p.isFlashSale); 
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    let shuffled = [...baseProducts];
    let seed = dateSeed;
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      const j = Math.floor(rnd * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 30);
  }, []);

  return (
    <section className="mt-20  px-4 max-w-[1625px] mx-auto">
      {/* HEADER ESTILIZADO */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-8 w-1.5 bg-[#ff5722] rounded-full"></div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
          Descobertas <span className="text-[#ff5722]">do Dia</span>
        </h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {discoverProducts.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              navigate(`/produto/${item.externalId}`);
              window.scrollTo(0, 0);
            }}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col border border-gray-100 hover:border-[#ff5722]/30 relative overflow-hidden hover:-translate-y-1"
          >
            {/* SELO DE DESCONTO */}
            {item.discount && (
              <div className="absolute top-0 right-0 z-20 bg-[#ffe910] text-[#ff5722] text-[11px] font-black px-2 py-1 rounded-bl-xl shadow-sm">
                {item.discount} OFF
              </div>
            )}

            {/* IMAGEM */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 p-2">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
            
            {/* CONTEÚDO */}
            <div className="p-3 flex flex-col flex-1">
              <h3 className="text-[13px] text-gray-600 line-clamp-2 mb-2 h-10 leading-tight font-medium group-hover:text-[#ff5722]">
                {item.name}
              </h3>
              
              <div className="mt-auto">
                <div className="h-4">
                  {item.oldPrice && (
                    <span className="text-[11px] text-gray-400 line-through">
                      {item.oldPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl text-[#ff5722] font-black italic tracking-tighter">
                    {item.price}
                  </span>
                  <div className="bg-orange-50 p-1.5 rounded-lg text-[#ff5722] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingCart size={16} />
                  </div>
                </div>

                {/* FOOTER DO CARD */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-50">
                   <div className="flex items-center gap-1">
                     <Star size={10} fill="#ffcc00" className="text-[#ffcc00]" />
                     <span className="font-bold text-gray-700">{item.rating || '4.8'}</span>
                   </div>
                   <span className="text-gray-400 font-medium">{item.sold || '1mil+'} vendidos</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 pb-10">
        <button
          onClick={() => navigate('/Lista-produtos')}
          className="group flex items-center gap-3 px-12 py-4 bg-[#ff5722] text-white font-black text-sm uppercase rounded-full shadow-lg hover:shadow-[#ff5722]/40 transition-all hover:scale-105 active:scale-95"
        >
          Explorar Mais Produtos
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </section>
  );
};

export default DailyDiscover;