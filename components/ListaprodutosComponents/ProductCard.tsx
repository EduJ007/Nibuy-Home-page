import React from 'react';
import { Star, CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const navigate = useNavigate();

  const getStoreInfo = (link?: string) => {
    if (link?.includes('shopee')) {
      return { name: 'Shopee', color: 'text-[#ee4d2d]', bg: 'bg-[#ee4d2d]/10' };
    }
    if (link?.includes('temu')) {
      return { name: 'Temu', color: 'text-[#fb6406]', bg: 'bg-[#fb6406]/10' };
    }
    if (link?.includes('mercadolivre')) {
      return { name: 'Mercado Livre', color: 'text-[#2d3277]', bg: 'bg-[#fff159]' };
    }
    if (link?.includes('amazon')) {
      return { name: 'Amazon', color: 'text-[#232f3e]', bg: 'bg-gray-200' };
    }
    return { name: 'Oficial', color: 'text-[#ff5722]', bg: 'bg-orange-50' };
  };

  const store = getStoreInfo(product.link);

  const handleCardClick = () => {
    navigate(`/produto/${product.externalId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 ease-in-out border border-gray-100 hover:border-[#ff5722]/30 shadow-sm hover:shadow-xl flex flex-col h-full cursor-pointer hover:-translate-y-1"
    >
      
      {/* SELO DE DESCONTO */}
      {product.discount && (
        <div className="absolute top-0 right-0 z-20 bg-[#ffe910] text-[#ff5722] text-[11px] font-black px-2 py-1 rounded-bl-xl shadow-sm">
          {product.discount} OFF
        </div>
      )}

      {/* Badge Oferta Relâmpago */}
      {product.isFlashSale && (
        <div className="absolute top-2 left-2 z-20 bg-[#ff5722] text-white text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md animate-bounce">
          ⚡ RELÂMPAGO
        </div>
      )}

      {/* ÁREA DA IMAGEM - Fixamos o tamanho para evitar pulos */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-0 shrink-0">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-contain rounded-lg" 
        />
      </div>
      
      {/* CONTEÚDO DO CARD */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Loja e Badge Oficial */}
        <div className="flex items-center justify-between mb-2">
          <span className={`${store.color} ${store.bg} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md`}>
            {store.name}
          </span>
          {product.isOfficial && (
            <div className="flex items-center gap-0.5 text-[#ff5722] text-[10px] font-bold">
               <CheckCircle2 size={12} className="fill-[#ff5722] text-white" />
               <span className="italic">Oficial</span>
            </div>
          )}
        </div>

        {/* Nome do Produto - AJUSTE AQUI: altura fixa (h-10 ou h-11) e line-clamp */}
       <div className="h-[40px] mb-2"> {/* Container com altura fixa (20px por linha) */}
              <h3 className="text-gray-700 text-[13px] leading-[20px] font-medium line-clamp-2 overflow-hidden group-hover:text-[#ff5722] transition-colors">
                {product.name}
              </h3>
            </div>

        {/* Área de Preços e Ação - Empurrada para o fundo com mt-auto */}
        <div className="mt-auto pt-2">
          <div className="h-4 flex items-center mb-0.5">
            {product.oldPrice && (
              <span className="text-[12px] text-gray-400 line-through">
                {product.oldPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[#ff5722] text-[22px] md:text-[26px] font-black tracking-tighter leading-none">
              {product.price}
            </span>
          </div>

          {/* Avaliação e Vendas */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50 text-[11px]">
             <div className="flex items-center gap-1">
                <Star size={16} fill="#ffcc00" className="text-[#ffcc00]" />
                <span className="font-black text-gray-700 text-[14px]">{product.rating || '4.9'}</span>
             </div>
             <span className="text-gray-400 font-medium text-[12px]">{product.sold || '1k+'} vendidos</span>
          </div>

          {/* Botão de ação */}
          <button className="mt-3 w-full bg-[#ff5722] text-white text-[11px] font-black py-2.5 rounded-xl hover:bg-[#e64a19] transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:shadow-orange-200">
            Ver Oferta
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;