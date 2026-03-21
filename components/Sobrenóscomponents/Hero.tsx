import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Sofa, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { auth } from '../firebase';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSlides = [
    { 
      titulo: "OFERTAS EM UM SÓ LUGAR", 
      sub: "Produtos selecionados com preços que cabem no seu bolso.", 
      btn: "Ver Ofertas",
      link: "https://nibuy-produtos.vercel.app/",
      icon: <Zap className="mb-4 text-orange-200 animate-pulse" size={48} />
    },
    { 
      titulo: "CURADORIA NIBUY 2026", 
      sub: "O filtro de confiança que você precisava para comprar online.", 
      btn: "Conferir Agora",
      link: "https://nibuy-produtos.vercel.app/",
      icon: <ShieldCheck className="mb-4 text-orange-100" size={48} />
    }
  ];

  const protectedRedirect = (url: string) => {
    if (auth.currentUser) {
      window.location.href = url;
    } else {
      window.dispatchEvent(new Event('showNibuyWarning'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev === mainSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? mainSlides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [mainSlides.length]);

  return (
    /* pt-32 para mobile e pt-44 para desktop garante que ele comece colado no seu Header duplo */
    <section className="bg-gray-200 pt-32 md:pt-44 pb-12">
      <div className="w-[95%] max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* BANNER PRINCIPAL (Carrossel) */}
        <div className="md:col-span-2 relative h-[350px] md:h-[500px] group overflow-hidden rounded-3xl shadow-2xl bg-[#ff5722] flex items-center justify-center text-center p-6 md:p-12 transition-all">
          
          {/* Efeito de Vidro no fundo do banner */}
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 rotate-45 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[100%] bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Controles do Carrossel */}
          <button onClick={prevSlide} className="hidden md:flex absolute left-6 z-20 p-4 bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-[#ff5722] rounded-2xl transition-all border border-white/10 opacity-0 group-hover:opacity-100">
            <ChevronLeft size={32} strokeWidth={3} />
          </button>
          <button onClick={nextSlide} className="hidden md:flex absolute right-6 z-20 p-4 bg-black/20 backdrop-blur-md hover:bg-white text-white hover:text-[#ff5722] rounded-2xl transition-all border border-white/10 opacity-0 group-hover:opacity-100">
            <ChevronRight size={32} strokeWidth={3} />
          </button>

          {/* Conteúdo do Slide */}
          <div key={currentSlide} className="relative z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 flex flex-col items-center">
            {mainSlides[currentSlide].icon}
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4 italic uppercase leading-none drop-shadow-lg">
              {mainSlides[currentSlide].titulo}
            </h2>
            <p className="text-white text-base md:text-xl mb-8 opacity-90 font-medium max-w-[550px] leading-relaxed">
              {mainSlides[currentSlide].sub}
            </p>
            <button 
              onClick={() => protectedRedirect(mainSlides[currentSlide].link)}
              className="bg-white text-[#ff5722] font-black py-4 px-10 rounded-2xl hover:scale-105 transition-all uppercase text-sm tracking-widest active:scale-95 shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
            >
              {mainSlides[currentSlide].btn}
            </button>
          </div>

          {/* Indicadores (Barrinhas) */}
          <div className="absolute bottom-6 flex gap-3 z-20">
            {mainSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-2 transition-all duration-500 rounded-full ${currentSlide === i ? 'bg-white w-12' : 'bg-white/30 w-3 hover:bg-white/50'}`} 
              />
            ))}
          </div>
        </div>

        {/* BANNERS LATERAIS (Desktop) */}
        <div className="hidden md:flex flex-col gap-4 h-[500px]">
          
          {/* Card Superior - Dark/Gamer */}
          <div className="flex-1 bg-gray-900 rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group border border-white/5 transition-transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Gamepad2 className="text-[#ff5722] mb-4 group-hover:rotate-12 transition-transform" size={44} />
            <h3 className="text-white font-black text-2xl leading-tight mb-4 uppercase italic">MUNDO<br/>GAMER</h3>
            <button 
              onClick={() => protectedRedirect('https://nibuy-produtos.vercel.app/')}
              className="text-xs bg-[#ff5722] text-white px-8 py-3 rounded-xl font-black uppercase hover:bg-orange-600 transition-all z-10"
            >
              Ver Coleção
            </button>
          </div>

          {/* Card Inferior - Light/Casa */}
          <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden border border-orange-100 group transition-transform hover:-translate-y-1">
            <Sofa className="text-[#ff5722] mb-4 group-hover:scale-110 transition-transform" size={44} />
            <h3 className="text-gray-900 font-black text-2xl leading-tight mb-4 uppercase italic">CASA &<br/>DECOR</h3>
            <button 
              onClick={() => protectedRedirect('https://nibuy-produtos.vercel.app/')}
              className="text-xs border-2 border-[#ff5722] text-[#ff5722] px-8 py-2.5 rounded-xl font-black uppercase hover:bg-[#ff5722] hover:text-white transition-all z-10"
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