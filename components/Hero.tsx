import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Zap, ArrowRight, Gamepad2, Sofa, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData } from '../products';

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const navigate = useNavigate();
  const featuredProducts = productsData.slice(0, 10);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
  }, [featuredProducts.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
  }, [featuredProducts.length]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Lógica de Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      if (distance > 0) nextSlide();
      else prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentProduct = featuredProducts[currentIndex];
  if (!currentProduct) return null;

  return (
    <section className="bg-gray-200 pt-4 md:pt-6 pb-8 overflow-hidden">
      <div className="w-[95%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* BANNER PRINCIPAL */}
        <div 
          className="lg:col-span-2 relative min-h-[500px] md:min-h-[450px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#ff5722] select-none group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ touchAction: 'pan-y' }}
        >
          {/* SETAS - APENAS DESKTOP (hidden md:flex) */}
          <button 
            onClick={prevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={30} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={30} />
          </button>

          {/* CONTEÚDO DO SLIDE */}
          <div key={currentProduct.externalId} className="flex flex-col md:flex-row h-full w-full animate-in fade-in duration-700">
            <div className="w-full md:w-1/2 relative flex items-center justify-center p-6 md:p-10 order-1 md:order-2">
              <div className="absolute inset-0 bg-white/20 blur-[80px] rounded-full scale-75 animate-pulse"></div>
              <img 
                src={currentProduct.img} 
                alt={currentProduct.name} 
                className="relative z-10 max-h-[240px] md:max-h-[320px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-in zoom-in-75 duration-500 rounded-xl"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 pb-14 md:p-10 flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full mb-4 text-[10px] font-bold uppercase tracking-widest">
                  <Zap size={14} fill="currentColor" className="text-yellow-300" /> Oferta Especial
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4 uppercase leading-tight line-clamp-2">
                {currentProduct.name}
              </h2>
              <div className="flex items-center md:items-start gap-3 md:flex-col mb-6">
                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white">{currentProduct.price}</span>
                {currentProduct.oldPrice && <span className="text-white/60 line-through text-lg font-bold">{currentProduct.oldPrice}</span>}
              </div>
              <button 
                onClick={() => { navigate(`/produto/${currentProduct.externalId}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full sm:w-auto bg-white text-[#ff5722] font-black py-4 px-10 rounded-xl hover:scale-105 transition-all uppercase text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag size={20} /> Aproveitar Agora
              </button>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {featuredProducts.map((_, index) => (
              <button key={index} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-10 bg-white' : 'w-2 bg-white/40'}`} />
            ))}
          </div>
        </div>

        {/* BANNERS LATERAIS (DESKTOP) */}
        <div className="hidden lg:flex flex-col gap-6">
            <div 
              onClick={() => navigate('/Lista-produtos?categoria=Tecnologia %26 Eletrônicos')}
              className="flex-1 bg-gray-900 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden border border-white/10 shadow-lg"
            >
                <div className="absolute -right-4 -top-4 bg-orange-500/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
                <Gamepad2 className="text-orange-500 mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" size={48} />
                <h3 className="text-white font-black text-xl italic uppercase tracking-tighter">Mundo Tech</h3>
                <p className="text-gray-400 text-[10px] uppercase mt-1 tracking-widest">Os melhores achados</p>
                <div className="mt-4 flex items-center gap-2 text-orange-500 text-[11px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all">Ver Tudo <ArrowRight size={14} /></div>
            </div>

            <div 
              onClick={() => navigate('/Lista-produtos?categoria=Casa %26 Decoração')}
              className="flex-1 bg-white border border-gray-200 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center group cursor-pointer shadow-lg hover:border-[#ff5722] transition-all"
            >
                <Sofa className="text-[#ff5722] mb-3 group-hover:scale-125 transition-all duration-500" size={48} />
                <h3 className="text-gray-900 font-black text-xl italic uppercase tracking-tighter">Casa & Decor</h3>
                <p className="text-gray-500 text-[10px] uppercase mt-1 tracking-widest">Estilo e Conforto</p>
                <div className="mt-4 bg-[#ff5722] text-white px-6 py-2 rounded-full font-black uppercase text-[10px] group-hover:shadow-lg transition-all">Explorar</div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;