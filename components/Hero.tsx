import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Zap, ArrowRight, Gamepad2, Sofa } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productsData, Product } from '../products';

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Seleciona os top 5 produtos para o banner não ficar infinito
  const featuredProducts = productsData.slice(0, 5);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
  }, [featuredProducts.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 8000); // 8 segundos é o tempo ideal de leitura
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const handleRedirect = (url?: string) => {
    if (!url) return;
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentProduct = featuredProducts[currentIndex];

  if (!currentProduct) return null;

  return (
  <section className="bg-gray-200 pt-[10px] md:pt-[10px] lg:pt-5 pb-8 overflow-hidden">
    <div className="w-[95%] max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* BANNER PRINCIPAL - MAIS BAIXO (450px) */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="lg:col-span-2 group relative min-h-[450px] md:h-[480px] lg:h-[450px] overflow-hidden rounded-[2.5rem]  bg-[#ff5722] flex flex-col md:flex-row transition-all duration-500"
      >
        
        {/* IMAGEM - Ajustada para o novo tamanho */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center p-2 md:p-8 z-10 order-1 md:order-2 flex-grow bg-white/5 md:bg-transparent">
   <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full scale-90 animate-pulse"></div>
   <img 
     key={`img-${currentProduct.id}`}
     src={currentProduct.img} 
     alt={currentProduct.name} 
     /* Aumentei a max-h no mobile de 180px para 260px e a largura para 90% */
     className="relative z-10 max-h-[260px] sm:max-h-[300px] md:max-h-[90%] w-[90%] md:w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-700 hover:scale-105"
   />
</div>

{/* TEXTO - Com mais espaço para os Dots */}
<div 
  key={`text-${currentProduct.id}`} 
  /* Adicionei pb-16 no mobile para dar espaço aos dots lá embaixo */
  className="w-full md:w-1/2 p-6 pb-16 md:p-10 flex flex-col justify-center items-center md:items-start text-center md:text-left z-20 order-2 md:order-1"
>
  <div className="hidden sm:inline-flex items-center gap-2 bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full mb-4 text-[9px] font-black uppercase tracking-widest">
      <Zap size={12} fill="currentColor" /> Oferta em Destaque
  </div>
  
  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter mb-4 uppercase leading-tight line-clamp-2">
    {currentProduct.name}
  </h2>
  
  <div className="flex items-center md:items-start gap-3 md:flex-col mb-5">
    <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
      {currentProduct.price}
    </span>
    {currentProduct.oldPrice && (
      <span className="text-orange-100 line-through text-base font-bold opacity-70">{currentProduct.oldPrice}</span>
    )}
  </div>

  <button 
    onClick={() => handleRedirect(currentProduct.link)}
    /* Botão um pouco mais compacto no mobile para não subir demais */
    className="w-full sm:w-auto bg-white text-[#ff5722] font-black py-3 px-8 rounded-xl hover:bg-orange-50 transition-all uppercase text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95"
  >
    <ShoppingBag size={18} />
    Aproveitar agora
  </button>
</div>

{/* DOTS - Posicionados com precisão */}
<div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
  {featuredProducts.map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrentIndex(index)}
      /* Aumentei um pouco a opacidade dos dots inativos para ficarem mais visíveis no fundo laranja */
      className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
    />
  ))}
</div>
</div>
        {/* BANNERS LATERAIS - Também acompanham a altura menor */}
      <div className="hidden lg:flex flex-col gap-6">
          {/* Banner Gamer */}
          <div className="flex-1 bg-gray-900 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl border border-white/5 group cursor-pointer"
               onClick={() => handleRedirect('/Lista-produtos?categoria=Gamer')}>
              <Gamepad2 className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-white font-black text-xl italic uppercase leading-tight">Universo Gamer</h3>
              <div className="text-orange-500 font-bold uppercase text-[9px] flex items-center gap-2 mt-2">Ver Coleção <ArrowRight size={14} /></div>
          </div>

          {/* Banner Casa */}
          <div className="flex-1 bg-white border-2 border-orange-50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl group cursor-pointer"
               onClick={() => handleRedirect('/Lista-produtos?categoria=Casa')}>
              <Sofa className="text-[#ff5722] mb-2 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-gray-900 font-black text-xl italic uppercase leading-tight">Casa & Estilo</h3>
              <div className="mt-3 bg-[#ff5722] text-white px-6 py-2 rounded-xl font-black uppercase text-[9px]">Explorar</div>
          </div>
      </div>

      </div>
    </section>
  );
};

export default Hero;