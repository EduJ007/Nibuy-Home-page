import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Zap, ArrowRight, Gamepad2, Sofa } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../products';

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Seleciona os top 5 produtos para o banner
  const featuredProducts = productsData.slice(0, 5);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
  }, [featuredProducts.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 7000); 
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const handleRedirect = (product: any) => {
    // Redireciona para a página interna do produto em vez do link direto
    navigate(`/produto/${product.externalId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentProduct = featuredProducts[currentIndex];

  if (!currentProduct) return null;

  return (
    <section className="bg-gray-200 pt-4 md:pt-6 pb-8 overflow-hidden">
      <div className="w-[95%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* BANNER PRINCIPAL */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:col-span-2 group relative min-h-[500px] md:min-h-[450px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#ff5722] flex flex-col md:flex-row transition-all duration-500"
        >
          
          {/* IMAGEM DO PRODUTO */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center p-6 md:p-10 z-10 order-1 md:order-2 bg-black/5 md:bg-transparent">
            {/* Brilho de fundo */}
            <div className="absolute inset-0 bg-white/20 blur-[80px] rounded-full scale-75 animate-pulse"></div>
            
            <img 
              key={`img-${currentProduct.id}`}
              src={currentProduct.img} 
              alt={currentProduct.name} 
              className="relative z-10 max-h-[240px] md:max-h-[320px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:scale-110 animate-in fade-in zoom-in duration-500 rounded-xl"
            />
          </div>

          {/* TEXTO DO BANNER */}
          <div 
            key={`text-${currentProduct.id}`} 
            className="w-full md:w-1/2 p-6 pb-14 md:p-10 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1 animate-in slide-in-from-left-8 duration-500"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full mb-4 text-[10px] font-bold uppercase tracking-widest">
                <Zap size={14} fill="currentColor" className="text-yellow-300" /> Oferta Especial
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4 uppercase leading-tight line-clamp-2">
              {currentProduct.name}
            </h2>
            
            <div className="flex items-center md:items-start gap-3 md:flex-col mb-6">
              <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-md">
                {currentProduct.price}
              </span>
              {currentProduct.oldPrice && (
                <span className="text-white/60 line-through text-lg font-bold">{currentProduct.oldPrice}</span>
              )}
            </div>

            <button 
              onClick={() => handleRedirect(currentProduct)}
              className="w-full sm:w-auto bg-white text-[#ee4d2d] font-black py-4 px-10 rounded-xl hover:bg-orange-50 transition-all uppercase text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag size={20} />
              Aproveitar Agora
            </button>
          </div>

          {/* DOTS (Indicadores) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 flex gap-2 z-30">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>

        {/* BANNERS LATERAIS (Desktop) */}
        <div className="hidden lg:flex flex-col gap-6">
            {/* Card Gamer */}
            <div 
              onClick={() => navigate('/Lista-produtos?categoria=Gamer')}
              className="flex-1 bg-gray-900 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden border border-white/10 shadow-lg"
            >
                <div className="absolute -right-4 -top-4 bg-orange-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
                <Gamepad2 className="text-orange-500 mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" size={48} />
                <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">Mundo Gamer</h3>
                <p className="text-gray-400 text-[10px] uppercase mt-1 tracking-widest">Equipamentos Pro</p>
                <div className="mt-4 flex items-center gap-2 text-orange-500 text-[11px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all">
                  Ver Tudo <ArrowRight size={14} />
                </div>
            </div>

            {/* Card Casa */}
            <div 
              onClick={() => navigate('/Lista-produtos?categoria=Casa')}
              className="flex-1 bg-white border border-gray-200 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center group cursor-pointer shadow-lg hover:border-[#ff5722] transition-all"
            >
                <Sofa className="text-[#ff5722] mb-3 group-hover:scale-125 transition-all duration-500" size={48} />
                <h3 className="text-gray-900 font-black text-xl italic uppercase tracking-tighter">Casa & Decor</h3>
                <p className="text-gray-500 text-[10px] uppercase mt-1 tracking-widest">Estilo e Conforto</p>
                <div className="mt-4 bg-[#ff5722] text-white px-6 py-2 rounded-full font-black uppercase text-[10px] group-hover:shadow-lg group-hover:shadow-orange-200 transition-all">
                  Explorar
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;