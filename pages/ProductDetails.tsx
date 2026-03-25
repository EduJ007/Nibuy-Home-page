import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ChevronRight, Check, Minus, Plus, X, 
  Truck, ExternalLink, Store, Heart, Info, MessageSquare, User, Send, Lock
} from 'lucide-react';
import { productsData, Product } from '../products';

const ProductDetails: React.FC = () => {
  const { externalId } = useParams<{ externalId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState('');
  const [selectedVars, setSelectedVars] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para o sistema de comentários
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Altere para true para testar o campo aberto
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(5);

  useEffect(() => {
    const found = productsData.find(p => p.externalId === externalId);
    if (found) {
      setProduct(found);
      setActiveImg(found.img);
      const initial: Record<string, string> = {};
      if (found.variations && found.variations.length > 0) {
        found.variations.forEach(v => {
          if (v.options && v.options.length > 0) initial[v.name] = v.options[0];
        });
      }
      setSelectedVars(initial);
      window.scrollTo(0, 0);
    }
  }, [externalId]);

  const formatLiked = (num: number) => {
    if (!num) return "0";
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.', ',') + 'mil';
    return num.toString();
  };

  const totalPrice = useMemo(() => {
    if (!product) return "R$ 0,00";
    const basePrice = parseFloat(product.price.replace('R$', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(basePrice * quantity);
  }, [product, quantity]);

  if (!product) return null;

  const allMedia = Array.from(new Set([product.img, ...(product.gallery || [])]));
  const hasVariations = product.variations && product.variations.length > 0;

  const handleBuyNow = () => {
    if (product.link) window.open(product.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-200 pb-24 md:pb-10 pt-2 md:pt-4 mt-20 md:mt-28 text-[14px]">
      
      {/* MODAL DE GALERIA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white hover:text-[#ff5722]"><X size={40} /></button>
          <div className="w-full max-w-4xl flex flex-col items-center gap-6">
            <img src={activeImg} className="max-h-[70vh] object-contain" alt="Zoom" />
            <div className="flex gap-2 overflow-x-auto p-2 no-scrollbar max-w-full">
              {allMedia.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 object-cover cursor-pointer border-2 ${activeImg === img ? 'border-[#ff5722]' : 'border-transparent opacity-50'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto md:px-4">
        
        {/* CAMINHO DO PRODUTO */}
        <nav className="flex items-center gap-2 px-4 md:px-0 py-3 text-[13px] text-gray-500">
          <Link to="/" className="text-[blue] hover:text-[#ff5722]">Início</Link>
          <ChevronRight size={12} />
          <span className="hover:text-[#ff5722] cursor-pointer">{product.category}</span>
          <ChevronRight size={12} className="hidden md:block" />
          <span className="hidden md:block truncate text-gray-400">{product.name}</span>
        </nav>

        <div className="bg-white shadow-sm flex flex-col md:flex-row p-0 md:p-5 gap-0 md:gap-8">
          
          {/* GALERIA ESQUERDA */}
          <div className="w-full md:w-[450px] flex-shrink-0">
            <div className="relative aspect-square cursor-pointer overflow-hidden" onClick={() => setIsModalOpen(true)}>
              <img src={activeImg} className="w-full h-full object-contain p-4 transition-transform hover:scale-105" />
            </div>
            <div className="flex gap-2 p-4 md:p-0 md:mt-4 overflow-x-auto no-scrollbar">
              {allMedia.map((img, i) => (
                <div key={i} className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 ${activeImg === img ? 'border-[#ff5722]' : 'border-transparent'}`} 
                  onClick={() => { setActiveImg(img); setIsModalOpen(true); }}>
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="hidden md:flex items-center justify-center gap-2 mt-6">
                <Heart size={20} className="text-[#ff424e]" fill="#ff424e" />
                <span className="text-gray-700 font-medium">Favoritado ({formatLiked(product.likedCount)})</span>
            </div>
          </div>

          {/* INFORMAÇÕES DIREITA */}
          <div className="flex-1 p-4 md:p-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-[#ff5722] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase italic">Indicado</span>
                {product.isOfficialShop && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase">Shopee Mall</span>}
                {product.freeShipping && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase flex items-center gap-0.5"><Truck size={12}/> Frete Grátis</span>}
            </div>

            <h1 className="text-lg md:text-xl font-bold mb-3 text-gray-800 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-5 flex-wrap text-sm border-b border-gray-50 pb-4">
              <div className="flex items-center gap-1 text-[#ff5722] font-bold border-b border-[#ff5722]">{product.rating} <Star size={14} fill="currentColor" /></div>
              <div className="text-gray-500 border-x px-4 border-gray-200"><span className="font-bold text-gray-800 border-b border-gray-800">{product.ratingCount}</span> Avaliações</div>
              <div className="text-gray-500 border-r pr-4 border-gray-200"><span className="font-bold text-gray-800">{product.sold} </span>Vendidos</div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Heart size={16} className="text-[#ff424e]" fill="#ff424e" />
                <span>{formatLiked(product.likedCount)}</span>
              </div>
            </div>

            <div className="bg-[#fafafa] p-4 md:p-5 mb-6 rounded-sm">
              {product.oldPrice && <div className="text-gray-400 line-through text-sm mb-1">{product.oldPrice}</div>}
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1 text-[#ff5722]">
                  <span className="text-lg font-bold">R$</span>
                  <span className="text-3xl md:text-4xl font-black">{totalPrice.replace('R$', '').trim()}</span>
                </div>
                {product.discount && (
                  <span className="bg-[#ff5722] text-white text-[16px] font-bold px-1 rounded-sm uppercase">{product.discount} OFF</span>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm flex gap-3 items-start">
                <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-[12px] leading-tight">
                  Para conferir frete e todas as informações, acesse o site oficial clicando em <strong>Comprar Agora</strong>.
                </p>
              </div>
            </div>

            {hasVariations && (
              <div className="space-y-6 mb-8">
                {product.variations?.map((v, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-gray-500 w-24 text-sm font-medium capitalize">{v.name}</span>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {v.options.map((opt, idx) => (
                        <button key={idx} onClick={() => { setSelectedVars(p => ({ ...p, [v.name]: opt })); if (v.images?.[idx]) setActiveImg(v.images[idx]); }}
                          className={`px-3 py-1.5 border text-sm relative rounded-sm transition-all ${selectedVars[v.name] === opt ? 'border-[#ff5722] text-[#ff5722] bg-[#fff5f2]' : 'border-gray-200 bg-white hover:border-[#ff5722]'}`}>
                          {opt}
                          {selectedVars[v.name] === opt && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#ff5722] flex items-center justify-center rounded-tl-sm"><Check size={8} className="text-white"/></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-8">
              <span className="text-gray-500 w-24 text-sm font-medium">Quantidade</span>
              <div className="flex items-center">
                <div className="flex items-center bg-white border border-gray-200">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center"><Minus size={14} /></button>
                  <input type="text" value={quantity} readOnly className="w-10 h-9 text-center font-bold text-sm" />
                  <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 flex items-center justify-center border-l border-gray-200"><Plus size={14} /></button>
                </div>
                <span className="ml-4 text-gray-400 text-xs">{product.stock} peças disponíveis</span>
              </div>
            </div>

            <button onClick={handleBuyNow} className="w-full bg-[#ff5722] text-white py-4 rounded-sm font-bold text-base hover:brightness-110 shadow-lg flex items-center justify-center gap-2 uppercase active:scale-95 transition-all">
              <ExternalLink size={20} /> COMPRAR AGORA NO SITE OFICIAL
            </button>
          </div>
        </div>

        {/* LOJA */}
        <div className="mt-4 bg-white p-4 md:p-6 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border bg-gray-50 overflow-hidden flex-shrink-0">
                {product.shopImg ? <img src={product.shopImg} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#ff5722]"><Store size={30} /></div>}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 leading-none mb-1">{product.shopName}</h3>
                <p className="text-xs text-gray-400">{product.location} • ⭐ {product.shopRating?.toFixed(1)}</p>
                <button onClick={handleBuyNow} className="mt-2 border border-gray-200 px-4 py-1 text-[11px] font-bold rounded-sm text-gray-500 uppercase">Ver Loja</button>
            </div>
        </div>

        {/* DESCRIÇÃO */}
        <div className="mt-4 bg-white p-4 md:p-6 shadow-sm">
            <div className="bg-[#fafafa] p-3 text-sm font-bold mb-6 uppercase border-l-4 border-[#ff5722]">Descrição do produto</div>
            <div className="px-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line mb-10">{product.description}</div>

            {/* AVALIAÇÕES DETALHADAS */}
            <div className="bg-[#fafafa] p-3 text-sm font-bold mb-6 uppercase border-l-4 border-[#ff5722]">Avaliações Detalhadas</div>
            <div className="flex flex-col md:flex-row items-center gap-10 bg-orange-50/20 p-8 rounded-sm mb-10">
                <div className="text-center">
                    <div className="text-[#ff5722] text-5xl font-black">{product.rating} <span className="text-sm text-gray-400 font-normal">de 5</span></div>
                    <div className="flex text-[#ff5722] justify-center mt-3">
                        {[...Array(5)].map((_, i) => <Star key={i} size={22} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                    </div>
                </div>
                <div className="flex-1 w-full space-y-3 max-w-md">
                    {product.ratingDetailed?.map((count, i) => {
                        const stars = 5 - i;
                        const total = product.ratingDetailed.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        return (
                            <div key={i} className="flex items-center gap-3 text-[12px]">
                                <span className="w-16 text-gray-500 font-bold">{stars} Estrelas</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#ff5722]" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="w-12 text-gray-400 text-right">{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;