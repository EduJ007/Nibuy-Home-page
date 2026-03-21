import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, ArrowRight, Gamepad2, Sofa } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Importação do hook
import { productsData, Product } from '../products';

const Hero: React.FC = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const navigate = useNavigate(); // 2. Inicialização do hook

  useEffect(() => {
    if (productsData && productsData.length > 0) {
      const randomIndex = Math.floor(Math.random() * productsData.length);
      setCurrentProduct(productsData[randomIndex]);

      const timer = setInterval(() => {
        const nextIndex = Math.floor(Math.random() * productsData.length);
        setCurrentProduct(productsData[nextIndex]);
      }, 12000); 

      return () => clearInterval(timer);
    }
  }, []);

  const handleRedirect = (url?: string) => {
    if (!url) return;
    
    if (url.startsWith('http')) {
      // Links externos (Amazon/Shopee) abrem em nova aba normalmente
      window.open(url, '_blank');
    } else {
      // 3. Navegação interna suave (SPA) sem reload de página
      navigate(url); 
      // Opcional: rola para o topo caso a nova página seja longa
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!currentProduct) return null;

  return (
    <section className="bg-gray-200 pt-24 md:pt-40 lg:pt-5 pb-10">
      <div className="w-[95%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BANNER PRINCIPAL */}
        <div className="lg:col-span-2 relative min-h-[580px] md:h-[600px] lg:h-[550px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-2xl bg-[#ff5722] flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-7 md:p-10 lg:p-14 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-1">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full mb-6 text-[10px] font-black uppercase tracking-widest">
                <Zap size={14} fill="currentColor" /> Oferta em Destaque
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-6 uppercase leading-tight drop-shadow-md line-clamp-3 pb-1">
              {currentProduct.name}
            </h2>
            
            <div className="flex flex-col mb-8">
              {currentProduct.oldPrice && (
                <span className="text-orange-200 line-through text-lg md:text-xl font-bold opacity-80 mb-1">{currentProduct.oldPrice}</span>
              )}
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-xl leading-none">
                {currentProduct.price}
              </span>
            </div>

            <button 
              onClick={() => handleRedirect(currentProduct.link)}
              className="w-full md:w-auto bg-white text-[#ff5722] font-black py-4 md:py-5 px-10 md:px-12 rounded-xl md:rounded-2xl hover:scale-105 transition-all uppercase text-xs md:text-sm shadow-2xl flex items-center justify-center gap-3 active:scale-95"
            >
              <ShoppingBag size={20} />
              Aproveitar agora
            </button>
          </div>

          <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 md:p-10 z-10 order-2 flex-grow">
             <div className="absolute inset-0 bg-white/10 blur-[80px] rounded-full scale-75"></div>
             <img 
               key={currentProduct.id}
               src={currentProduct.img} 
               alt={currentProduct.name} 
               className="relative z-10 max-h-[280px] md:max-h-[90%] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:scale-105 rounded-xl animate-in fade-in zoom-in-90"
             />
          </div>
        </div>

        {/* BANNERS LATERAIS */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="flex-1 bg-gray-900 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl border border-white/5 group">
              <Gamepad2 className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-white font-black text-2xl lg:text-3xl italic uppercase leading-tight mb-2">Universo<br/>Gamer</h3>
              <button 
                onClick={() => handleRedirect('/Lista-produtos')} 
                className="text-orange-500 font-bold uppercase text-[10px] flex items-center gap-2 hover:gap-4 transition-all mt-4"
              >
                Ver Coleção <ArrowRight size={16} />
              </button>
          </div>

          <div className="flex-1 bg-white border-2 border-orange-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl group">
              <Sofa className="text-[#ff5722] mb-4 group-hover:scale-110 transition-transform" size={48} />
              <h3 className="text-gray-900 font-black text-2xl lg:text-3xl italic uppercase leading-tight mb-4">Casa &<br/>Estilo</h3>
              <button 
                onClick={() => handleRedirect('/Lista-produtos')}
                className="bg-[#ff5722] text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg hover:bg-orange-600 transition-all"
              >
                Explorar
              </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;