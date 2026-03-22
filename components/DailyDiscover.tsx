import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Importa o hook
import { productsData } from '../products';

const DailyDiscover: React.FC = () => {
  const navigate = useNavigate(); // 2. Inicializa o hook

  const calculateDiscount = (priceStr: string, oldPriceStr?: string) => {
    if (!oldPriceStr) return null;
    const price = parseFloat(priceStr.replace(/[^\d,]/g, '').replace(',', '.'));
    const oldPrice = parseFloat(oldPriceStr.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(price) || isNaN(oldPrice)) return null;
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
    return discount > 0 ? `${discount}%` : null;
  };

  const discoverProducts = useMemo(() => {
    // Filtra produtos que não são flash sale para a descoberta diária
    const baseProducts = productsData.filter(p => p.isFlashSale === false);
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    let shuffled = [...baseProducts];
    let seed = dateSeed;
    
    // Algoritmo de embaralhamento baseado na data (muda todo dia)
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      const j = Math.floor(rnd * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 24);
  }, []);

  const handleSeeMore = () => {
    // 3. Navegação interna suave
    navigate('/Lista-produtos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mt-24">
      <div className="bg-white border-b-4 border-[#ff5722] py-4 mb-4 shadow-sm">
        <h2 className="text-center text-[#ff5722] uppercase font-bold text-lg tracking-widest">
          Descobertas do Dia
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 px-2 md:px-0">
        {discoverProducts.map((item) => {
          const discountLabel = calculateDiscount(item.price, item.oldPrice);

          return (
            <div 
              key={item.id} 
              onClick={() => item.link && window.open(item.link, '_blank')}
              className="bg-white rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col border border-transparent hover:border-[#ff5722] overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                
                {discountLabel && (
                  <div className="absolute top-0 right-0 bg-[#ffe910] text-[#ee4d2d] text-[10px] font-bold px-1 py-0.5 flex flex-col items-center leading-tight">
                    <span>{discountLabel}</span>
                    <span className="text-[8px] uppercase">OFF</span>
                  </div>
                )}
              </div>
              
              <div className="p-2 flex flex-col flex-1">
                <h3 className="text-[11.5px] text-gray-800 line-clamp-2 mb-2 group-hover:text-[#ee4d2d] h-8">{item.name}</h3>
                <div className="mt-auto">
                  <div className="flex flex-col mb-1">
                    {item.oldPrice && <span className="text-[12px] text-gray-400 line-through">{item.oldPrice}</span>}
                    <span className="mt-0.5 text-lg text-[#ee4d2d] font-bold leading-none">{item.price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[12px] text-gray-500">
                     <div className="flex items-center gap-0.5">
                       <Star size={14} fill="#ffcc00" color="#ffcc00" />
                       <span>{item.rating}</span>
                     </div>
                     <span>{item.sold} Vendidos</span>
                  </div>
                  <div className="text-[12px] text-gray-400 mt-4 text-right">{item.location}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-16 pb-8">
        <button
          onClick={handleSeeMore} // 4. Usa a nova função de navegação
          className="px-20 py-3 bg-white border border-gray-300 text-gray-600 font-medium text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm rounded-sm active:scale-95"
        >
          Veja Mais
        </button>
      </div>

    </section>
  );
};

export default DailyDiscover;