import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { productsData } from '../products';

const DailyDiscover: React.FC = () => {
  const calculateDiscount = (priceStr: string, oldPriceStr?: string) => {
    if (!oldPriceStr) return null;
    const price = parseFloat(priceStr.replace(/[^\d,]/g, '').replace(',', '.'));
    const oldPrice = parseFloat(oldPriceStr.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(price) || isNaN(oldPrice)) return null;
    const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
    return discount > 0 ? `${discount}%` : null;
  };

  const discoverProducts = useMemo(() => {
    const baseProducts = productsData.filter(p => p.isFlashSale === false);
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
    return shuffled.slice(0, 24);
  }, []);

  return (
    <section className="mt-6">
      {/* TÍTULO AJUSTADO: REMOVI O 'sticky' E O 'top-[120px]' */}
      <div className="bg-white border-b-4 border-[#ee4d2d] py-4 mb-4 shadow-sm">
        <h2 className="text-center text-[#ee4d2d] uppercase font-bold text-lg tracking-widest">
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
              className="bg-white rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col border border-transparent hover:border-[#ee4d2d] overflow-hidden"
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
                <h3 className="text-xs text-gray-800 line-clamp-2 mb-2 group-hover:text-[#ee4d2d] h-8">{item.name}</h3>
                <div className="mt-auto">
                  <div className="flex flex-col mb-1">
                    {item.oldPrice && <span className="text-[10px] text-gray-400 line-through">{item.oldPrice}</span>}
                    <span className="text-lg text-[#ee4d2d] font-medium leading-none">{item.price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500">
                     <div className="flex items-center gap-0.5">
                       <Star size={10} fill="#ffcc00" color="#ffcc00" />
                       <span>{item.rating}</span>
                     </div>
                     <span>{item.sold}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 text-right">{item.location}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DailyDiscover;