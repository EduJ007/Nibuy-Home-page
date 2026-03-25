import React from 'react';
import { Star, MapPin, CheckCircle2, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const navigate = useNavigate();

  const getStoreInfo = (link?: string) => {
    if (link?.includes('shopee')) return { name: 'Shopee', color: 'text-[#ee4d2d]' };
    if (link?.includes('mercadolivre')) return { name: 'Mercado Livre', color: 'text-[#333]' };
    if (link?.includes('amazon')) return { name: 'Amazon', color: 'text-[#232f3e]' };
    return { name: 'Oficial', color: 'text-gray-500' };
  };

  const store = getStoreInfo(product.link);

  // Função para navegar para os detalhes do produto
  const handleCardClick = () => {
    navigate(`/produto/${product.externalId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-sm overflow-hidden transition-all duration-200 ease-in-out border border-transparent hover:border-[#ee4d2d] hover:shadow-lg flex flex-col h-full cursor-pointer hover:-translate-y-1"
    >
      
      {/* SELO DE DESCONTO (AMARELO) */}
      {product.discount && (
        <div className="absolute top-0 right-0 z-20 bg-[#ffe910] text-[#ee4d2d] text-[10px] font-bold px-1.5 py-1 flex flex-col items-center leading-tight">
          <span>{product.discount}</span>
          <span className="text-[8px] uppercase">OFF</span>
        </div>
      )}

      {/* Badge Oferta Relâmpago */}
      {product.isFlashSale && (
        <div className="absolute top-2 left-2 z-20 bg-[#ee4d2d] text-white text-[8px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-sm">
          <span className="animate-pulse">⚡</span> RELÂMPAGO
        </div>
      )}

      {/* ÁREA DA IMAGEM */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-0">
        <img 
          src={product.img} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        {/* Loja e Oficial */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className={`${store.color} text-[9px] font-black uppercase tracking-tight italic bg-gray-100 px-1 rounded-sm`}>
            {store.name}
          </span>
          {product.isOfficial && (
            <div className="flex items-center gap-0.5 text-[#ee4d2d] text-[9px] font-bold">
               <CheckCircle2 size={10} className="fill-current text-white bg-[#ee4d2d] rounded-full" />
               Oficial
            </div>
          )}
        </div>

        {/* Nome do Produto */}
        <h3 className="text-gray-700 text-[12px] md:text-[13px] leading-snug line-clamp-2 mb-2 h-[34px] group-hover:text-[#ee4d2d] transition-colors">
          {product.name}
        </h3>

        {/* Preços */}
        <div className="mt-auto mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#ee4d2d] text-lg md:text-xl font-medium leading-none">
              {product.price}
            </span>
            {product.discount && (
               <span className="bg-[#ffeee8] text-[#ee4d2d] text-[10px] px-1 font-bold">-{product.discount}</span>
            )}
          </div>
          {product.oldPrice && (
            <p className="text-gray-400 text-[11px] line-through">
              {product.oldPrice}
            </p>
          )}
        </div>

        {/* Avaliação e Vendas */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50 text-[10px] md:text-[11px]">
           <div className="flex items-center gap-0.5 text-[#ee4d2d]">
              <Star size={12} fill="currentColor" />
              <span className="font-bold text-gray-700">{product.rating || '4.9'}</span>
           </div>
           <span className="text-gray-400">{product.sold} vendidos</span>
        </div>

        {/* Botão de ação rápida (Estilo Mobile Shopee) */}
        <div className="mt-3 flex gap-1">
          <button className="flex-1 bg-[#ee4d2d] text-white text-[11px] font-bold py-2 rounded-sm hover:bg-[#d73211] transition-all uppercase flex items-center justify-center gap-1">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;