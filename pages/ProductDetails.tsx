import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ChevronRight, Minus, Plus, X, 
  Truck, ExternalLink, Info, ShoppingBag,
  PlayCircle, Store, Ticket, ChevronLeft, Heart, User
} from 'lucide-react';
import { productsData, Product } from '../products';
import ProductCard from '../components/ListaprodutosComponents/ProductCard';

import { auth, db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const ProductDetails: React.FC = () => {
  const { externalId } = useParams<{ externalId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState('');
  const [activeVideo, setActiveVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Estado para o Modal de Aviso de Login
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    const found = productsData.find(p => p.externalId === externalId);
    if (found) {
      setProduct(found);
      setActiveImg(found.img);
      setActiveVideo(false);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [externalId]);

  useEffect(() => {
    const checkSaved = async () => {
      if (auth.currentUser && product) {
        const savedRef = doc(db, "users", auth.currentUser.uid, "savedProducts", product.externalId);
        const docSnap = await getDoc(savedRef);
        setIsSaved(docSnap.exists());
      }
    };
    checkSaved();
  }, [product, auth.currentUser]);

  const toggleSave = async () => {
    if (!auth.currentUser) {
      // Em vez do alert, abrimos o modal personalizado
      setShowLoginAlert(true);
      return;
    }
    const savedRef = doc(db, "users", auth.currentUser.uid, "savedProducts", product!.externalId);
    try {
      if (isSaved) {
        await deleteDoc(savedRef);
        setIsSaved(false);
      } else {
        await setDoc(savedRef, {
          productId: product!.externalId,
          name: product!.name,
          price: product!.price,
          img: product!.img,
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const allMediaList = useMemo(() => {
    if (!product) return [];
    const list: { type: 'video' | 'image'; url: string }[] = [];
    if (product.videoUrl) {
      list.push({ type: 'video', url: product.videoUrl });
    }
    list.push({ type: 'image', url: product.img });
    if (product.gallery) {
      product.gallery.forEach(url => {
        if (url !== product.img) list.push({ type: 'image', url });
      });
    }
    return list;
  }, [product]);

  const handleNavigation = (direction: 'next' | 'prev') => {
    const currentIndex = allMediaList.findIndex(m => 
      m.type === 'video' ? activeVideo : m.url === activeImg
    );
    
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= allMediaList.length) newIndex = 0;
    if (newIndex < 0) newIndex = allMediaList.length - 1;

    const nextMedia = allMediaList[newIndex];
    if (nextMedia.type === 'video') {
      setActiveVideo(true);
      setActiveImg('');
    } else {
      setActiveVideo(false);
      setActiveImg(nextMedia.url);
    }
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productsData
      .filter(p => p.category === product.category && p.externalId !== product.externalId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [product]);

  const totalPrice = useMemo(() => {
    if (!product) return "R$ 0,00";
    const basePrice = parseFloat(product.price.replace('R$', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(basePrice * quantity);
  }, [product, quantity]);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-200 pb-24 md:pb-10 pt-2 md:pt-4 mt-20 md:mt-28 text-[14px]">
      
      {/* 1. MODAL DE AVISO DE LOGIN PERSONALIZADO */}
      {showLoginAlert && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-orange-100 text-[#ff5722] rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Você não está logado</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Para salvar seus produtos favoritos e vê-los mais tarde, você precisa entrar na sua conta.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowLoginAlert(false);
                  // Aqui você pode disparar a função de abrir o login do seu Header se quiser
                }}
                className="bg-[#ff5722] text-white font-bold py-3 rounded-md hover:bg-[#e64a19] transition-colors uppercase text-sm"
              >
                Fazer Login agora
              </button>
              <button 
                onClick={() => setShowLoginAlert(false)}
                className="text-gray-400 font-medium py-2 hover:text-gray-600 transition-colors text-sm"
              >
                Depois
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE GALERIA ESTILO SHOPEE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-4">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white hover:text-[#ff5722] z-50"><X size={40} /></button>
          
          <button onClick={(e) => { e.stopPropagation(); handleNavigation('prev'); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50"><ChevronLeft size={60} /></button>
          <button onClick={(e) => { e.stopPropagation(); handleNavigation('next'); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50"><ChevronRight size={60} /></button>
          
          <div className="w-full max-w-4xl flex flex-col items-center gap-8">
             <div className="flex items-center justify-center h-[55vh] md:h-[65vh] w-full">
               {activeVideo ? (
                  <video key={product.videoUrl} src={product.videoUrl} controls autoPlay className="max-h-full max-w-full" />
               ) : (
                  <img src={activeImg} className="max-h-full max-w-full object-contain" alt="Zoom" />
               )}
             </div>

             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 max-w-full justify-center">
                {allMediaList.map((media, i) => (
                  <div 
                    key={i} 
                    className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 cursor-pointer transition-all relative ${
                      (media.type === 'video' && activeVideo) || (media.type === 'image' && !activeVideo && activeImg === media.url) 
                      ? 'border-[#ff5722]' 
                      : 'border-white/20'
                    }`}
                    onClick={() => {
                      if (media.type === 'video') {
                        setActiveVideo(true);
                        setActiveImg('');
                      } else {
                        setActiveVideo(false);
                        setActiveImg(media.url);
                      }
                    }}
                  >
                    <img 
                      src={media.type === 'video' ? (product.videoThumb || product.img) : media.url} 
                      className={`w-full h-full object-cover ${media.type === 'video' ? 'opacity-60' : ''}`} 
                    />
                    {media.type === 'video' && <div className="absolute inset-0 flex items-center justify-center text-white"><PlayCircle size={24} /></div>}
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <main className="max-w-[1200px] mx-auto md:px-4">
        <nav className="flex items-center gap-2 px-4 md:px-0 py-3 text-[13px] text-gray-500">
          <Link to="/" className="text-blue-600 hover:text-[#ff5722]">Início</Link>
          <ChevronRight size={12} />
          <span className="hover:text-[#ff5722] cursor-pointer">{product.category}</span>
          <ChevronRight size={12} className="hidden md:block" />
          <span className="hidden md:block truncate text-gray-400">{product.name}</span>
        </nav>

        <div className="bg-white shadow-sm flex flex-col md:flex-row p-0 md:p-5 gap-0 md:gap-8 rounded-t-sm">
          <div className="w-full md:w-[450px] flex-shrink-0">
            <div className="relative aspect-square bg-gray-50 flex items-center justify-center group">
              <div className="w-full h-full cursor-pointer overflow-hidden flex items-center justify-center" onClick={() => setIsModalOpen(true)}>
                {activeVideo ? (
                  <video src={product.videoUrl} autoPlay muted loop className="w-full h-full object-contain" />
                ) : (
                  <img src={activeImg} className="w-full h-full object-contain p-4 transition-transform hover:scale-105" />
                )}
              </div>
            </div>

            <div className="flex gap-2 p-4 md:p-0 md:mt-4 overflow-x-auto no-scrollbar">
              {allMediaList.map((media, i) => (
                <div 
                  key={i} 
                  className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-2 cursor-pointer transition-all ${
                    (media.type === 'video' && activeVideo) || (media.type === 'image' && !activeVideo && activeImg === media.url) 
                    ? 'border-[#ff5722]' 
                    : 'border-transparent'
                  }`}
                  onClick={() => {
                    if (media.type === 'video') {
                      setActiveVideo(true);
                      setActiveImg('');
                    } else {
                      setActiveVideo(false);
                      setActiveImg(media.url);
                    }
                  }}
                >
                  <img src={media.type === 'video' ? (product.videoThumb || product.img) : media.url} className="w-full h-full object-cover" />
                  {media.type === 'video' && <div className="absolute inset-0 flex items-center justify-center text-white"><PlayCircle size={20} fill="rgba(0,0,0,0.4)" /></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 md:p-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-[#ff5722] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase italic">Indicado</span>
                {product.freeShipping && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase flex items-center gap-0.5"><Truck size={12}/> Frete Grátis</span>}
            </div>

            <h1 className="text-lg md:text-xl font-bold mb-3 text-gray-800 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-5 text-sm border-b border-gray-50 pb-4">
              <div className="flex items-center gap-1 text-[#ff5722] font-bold underline">{product.rating.toFixed(1)} <Star size={14} fill="currentColor" /></div>
              <div className="text-gray-500 border-l pl-4 border-gray-200"><span className="font-bold text-gray-800">{product.sold}</span> Vendidos</div>
            </div>

            <div className="bg-[#fafafa] p-4 md:p-5 mb-6 rounded-sm">
              {product.oldPrice && <div className="text-gray-400 line-through text-sm mb-1">{product.oldPrice}</div>}
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1 text-[#ff5722]">
                  <span className="text-lg font-bold">R$</span>
                  <span className="text-3xl md:text-4xl font-black">{totalPrice.replace('R$', '').trim()}</span>
                </div>
                {product.discount && <span className="bg-[#ff5722] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">{product.discount} OFF</span>}
              </div>

              {product.vouchers && product.vouchers.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-gray-500 text-xs flex items-center gap-1 w-full mb-1"><Ticket size={12} /> Cupons Disponíveis:</span>
                  {product.vouchers.slice(0, 3).map((v, i) => (
                    <span key={i} className="bg-orange-50 text-[#ff5722] border border-dashed border-[#ff5722] px-2 py-0.5 text-[11px] font-bold rounded-sm uppercase">{v}</span>
                  ))}
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm flex gap-3 items-start">
                <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-[12px] leading-tight">Para conferir frete e todas as informações, acesse o site oficial clicando em <strong>Comprar Agora</strong>.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 border border-gray-100 rounded-sm">
                <div className="bg-gray-100 p-2 rounded-full text-gray-400"><Store size={20} /></div>
                <div>
                  <p className="text-xs text-gray-500">Vendido por</p>
                  <p className="font-bold text-gray-800">{product.shopName || "Loja Oficial"}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-8">
              <span className="text-gray-500 w-24 text-sm font-medium">Quantidade</span>
              <div className="flex items-center bg-white border border-gray-200">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"><Minus size={14} /></button>
                <input type="text" value={quantity} readOnly className="w-10 h-9 text-center font-bold text-sm outline-none" />
                <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 flex items-center justify-center border-l border-gray-200 hover:bg-gray-50"><Plus size={14} /></button>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => window.open(product.link, '_blank')} 
                className="flex-1 bg-[#ff5722] text-white py-4 rounded-sm font-bold text-base hover:brightness-110 shadow-lg flex items-center justify-center gap-2 uppercase active:scale-95 transition-all"
              >
                <ExternalLink size={20} /> COMPRAR AGORA NO SITE OFICIAL
              </button>
              
              <button 
                onClick={toggleSave}
                className={`px-4 rounded-sm border-2 transition-all ${isSaved ? 'bg-red-50 border-red-500 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
              >
                <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white p-4 md:p-6 shadow-sm rounded-sm">
            <div className="bg-[#fafafa] p-3 text-sm font-bold mb-6 uppercase border-l-4 border-[#ff5722]">Descrição do produto</div>
            <div className="px-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {product.description}
              {"\n\n"}
              🛒 Loja: {product.shopName} | ⭐ Nota: {product.rating.toFixed(1)} | 📦 Frete: {product.freeShipping ? "Grátis disponível" : "No site"}
            </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-8 mb-10">
            <div className="flex items-center gap-2 mb-6 px-4 md:px-0">
              <ShoppingBag className="text-[#ff5722]" size={24} />
              <h2 className="text-lg font-black uppercase tracking-tighter text-gray-800">Quem viu este produto também comprou</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;