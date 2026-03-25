import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
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
    <section className="mt-20 md:mt-16 px-2 md:px-1 max-w-[1630px] mx-auto">
      {/* HEADER NIBUY */}
      <div className="bg-white border-b-4 border-[#ff5722] py-4 mb-6 shadow-sm  top-[70px] md:top-[120px] z-30">
        <h2 className="text-center text-[#ff5722] uppercase font-black text-lg md:text-xl tracking-widest">
          Descobertas do Dia
        </h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {discoverProducts.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              navigate(`/produto/${item.externalId}`);
              window.scrollTo(0, 0);
            }}
            className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col border border-transparent hover:border-[#ff5722] relative"
          >
            {/* SELO DE DESCONTO AMARELO (IGUAL À FOTO) */}
            {item.discount && (
              <div className="absolute top-0 right-0 z-20 bg-[#ffe910] text-[#ff5722] text-[10px] md:text-[12px] font-bold px-1.5 py-1 flex flex-col items-center leading-tight">
                <span>{item.discount}</span>
                <span className="text-[8px] md:text-[9px]">OFF</span>
              </div>
            )}

            {/* IMAGEM COM PADDING PARA NÃO COLAR NA BORDA */}
            <div className="relative aspect-square overflow-hidden bg-white ">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            {/* CONTEÚDO */}
            <div className="p-2 md:p-3 flex flex-col flex-1">
              {/* TÍTULO: Aumentei para line-clamp-2 e altura fixa para alinhar tudo */}
              <h3 className="text-[12px] md:text-[13px] text-gray-700 line-clamp-2 mb-2 h-8 md:h-9 leading-tight group-hover:text-[#ff5722]">
                {item.name}
              </h3>
              
              <div className="mt-auto">
                {/* PREÇO ANTIGO: Cinza e riscado */}
                <div className="h-4 flex items-center mb-0.5">
                  {item.oldPrice && (
                    <span className="text-[11px] md:text-[12px] text-gray-400 line-through">
                      {item.oldPrice}
                    </span>
                  )}
                </div>

                {/* PREÇO ATUAL: Laranja Nibuy, Bold e Italic como na foto */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[18px] md:text-[22px] text-[#ff5722] font-bold italic tracking-tighter leading-none">
                    {item.price}
                  </span>
                </div>

                {/* RATING E VENDIDOS: Estrela amarela e texto discreto */}
                <div className="flex items-center justify-between text-[11px] md:text-[12px] text-gray-500 pt-1 border-t border-gray-50">
                   <div className="flex items-center gap-1">
                     <Star size={12} fill="#ffcc00" className="text-[#ffcc00]" />
                     <span className="font-bold text-gray-800">{item.rating || '4.8'}</span>
                   </div>
                   <span className="text-gray-400">{item.sold || '1mil+'} Vendidos</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 pb-10">
        <button
          onClick={() => navigate('/Lista-produtos')}
          className="w-full md:w-auto md:px-24 py-3 bg-white border border-gray-200 text-gray-500 font-bold text-sm uppercase hover:border-[#ff5722] hover:text-[#ff5722] transition-all rounded-sm shadow-sm active:scale-95"
        >
          Veja Mais
        </button>
      </div>
    </section>
  );
};

export default DailyDiscover;