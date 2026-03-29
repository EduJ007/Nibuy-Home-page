import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ChevronRight, Minus, Plus, X, 
  Truck, ExternalLink, Info, ShoppingBag
} from 'lucide-react';
import { productsData, Product } from '../products';
import ProductCard from '../components/ListaprodutosComponents/ProductCard'; // Importe seu card de produto

const ProductDetails: React.FC = () => {
  const { externalId } = useParams<{ externalId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  const found = productsData.find(p => p.externalId === externalId);
  if (found) {
    setProduct(found);
    setActiveImg(found.img);
    setQuantity(1);
    // ISSO AQUI É ESSENCIAL:
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [externalId]); // Sempre que mudar o ID na URL, ele reexecuta

// 2. Lógica de Relacionados "porra-louca" (funciona mesmo)
const relatedProducts = useMemo(() => {
  if (!product) return [];

  return productsData
    .filter(p => 
      p.category === product.category && // Mesma categoria
      p.externalId !== product.externalId // Não mostra o próprio produto que já está aberto
    )
    .sort(() => 0.5 - Math.random()) // Embaralha para não ser sempre os mesmos 4
    .slice(0, 4); // Pega só 4
}, [product]); // Recalcula toda vez que o produto principal mudar

  const totalPrice = useMemo(() => {
    if (!product) return "R$ 0,00";
    const basePrice = parseFloat(product.price.replace('R$', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(basePrice * quantity);
  }, [product, quantity]);

  if (!product) return null;

  const allMedia = Array.from(new Set([product.img, ...(product.gallery || [])]));

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
          <Link to="/" className="text-blue-600 hover:text-[#ff5722]">Início</Link>
          <ChevronRight size={12} />
          <span className="hover:text-[#ff5722] cursor-pointer">{product.category}</span>
          <ChevronRight size={12} className="hidden md:block" />
          <span className="hidden md:block truncate text-gray-400">{product.name}</span>
        </nav>

        <div className="bg-white shadow-sm flex flex-col md:flex-row p-0 md:p-5 gap-0 md:gap-8 rounded-t-sm">
          
          {/* GALERIA ESQUERDA */}
          <div className="w-full md:w-[450px] flex-shrink-0">
            <div className="relative aspect-square cursor-pointer overflow-hidden" onClick={() => setIsModalOpen(true)}>
              <img src={activeImg} className="w-full h-full object-contain p-4 transition-transform hover:scale-105" />
            </div>
            <div className="flex gap-2 p-4 md:p-0 md:mt-4 overflow-x-auto no-scrollbar">
              {allMedia.map((img, i) => (
                <div key={i} className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 ${activeImg === img ? 'border-[#ff5722]' : 'border-transparent'}`} 
                  onClick={() => setActiveImg(img)}>
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* INFORMAÇÕES DIREITA */}
          <div className="flex-1 p-4 md:p-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-[#ff5722] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase italic">Indicado</span>
                {product.freeShipping && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase flex items-center gap-0.5"><Truck size={12}/> Frete Grátis</span>}
            </div>

            <h1 className="text-lg md:text-xl font-bold mb-3 text-gray-800 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-5 text-sm border-b border-gray-50 pb-4">
              <div className="flex items-center gap-1 text-[#ff5722] font-bold">{product.rating} <Star size={14} fill="currentColor" /></div>
              <div className="text-gray-500 border-l pl-4 border-gray-200">
                <span className="font-bold text-gray-800">{product.sold}</span> Vendidos
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
                  <span className="bg-[#ff5722] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">{product.discount} OFF</span>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm flex gap-3 items-start">
                <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-[12px] leading-tight">
                  Para conferir frete e todas as informações, acesse o site oficial clicando em <strong>Comprar Agora</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-8">
              <span className="text-gray-500 w-24 text-sm font-medium">Quantidade</span>
              <div className="flex items-center">
                <div className="flex items-center bg-white border border-gray-200">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                  <input type="text" value={quantity} readOnly className="w-10 h-9 text-center font-bold text-sm outline-none" />
                  <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50"><Plus size={14} /></button>
                </div>
                {product.stock && <span className="ml-4 text-gray-400 text-xs">{product.stock} peças disponíveis</span>}
              </div>
            </div>

            <button onClick={handleBuyNow} className="w-full bg-[#ff5722] text-white py-4 rounded-sm font-bold text-base hover:brightness-110 shadow-lg flex items-center justify-center gap-2 uppercase active:scale-95 transition-all">
              <ExternalLink size={20} /> COMPRAR AGORA NO SITE OFICIAL
            </button>
          </div>
        </div>

        {/* DESCRIÇÃO */}
        <div className="mt-4 bg-white p-4 md:p-6 shadow-sm rounded-sm">
            <div className="bg-[#fafafa] p-3 text-sm font-bold mb-6 uppercase border-l-4 border-[#ff5722]">Descrição do produto</div>
            <div className="px-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line">{product.description}</div>
        </div>

        {/* PRODUTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 mb-10">
            <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
              <ShoppingBag className="text-[#ff5722]" size={24} />
              <h2 className="text-lg font-black uppercase tracking-tighter text-gray-800">Quem viu este produto também comprou</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;