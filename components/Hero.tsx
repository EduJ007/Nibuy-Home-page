import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Sofa, Sparkles, Truck } from 'lucide-react';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSlides = [
    { 
      titulo: "OFERTAS EM UM SÓ LUGAR", 
      sub: "Produtos selecionados com preços que cabem no seu bolso.", 
      btn: "Ver Ofertas",
      link: "https://nibuy-produtos.vercel.app/",
      icon: <Sparkles className="mb-4 text-orange-200" size={48} />
    },
    { 
      titulo: "NOVIDADES NIBUY 2026", 
      sub: "As tendências que acabaram de chegar na nossa vitrine tecnológica.", 
      btn: "Conferir Agora",
      link: "https://nibuy-produtos.vercel.app/",
      icon: <Sparkles className="mb-4 text-orange-100" size={48} />
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev === mainSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? mainSlides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [mainSlides.length]);

  return (
    <div className="w-[98%] max-w-[1600px] mx-auto flex flex-col md:grid md:grid-cols-3 gap-4 animate-in fade-in duration-700">
      
      {/* BANNER PRINCIPAL: Gradiente e Profundidade */}
      <div className="md:col-span-2 relative h-[350px] md:h-[450px] group overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-[#ff5722] via-[#ff5722] to-[#ff5722] flex items-center justify-center text-center p-12">
        
        {/* Camada de brilho/vidro no fundo */}
        <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-white/10 rotate-12 blur-3xl pointer-events-none"></div>

        {/* Setas Estilizadas */}
        <button onClick={prevSlide} className="absolute left-6 z-10 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20">
          <ChevronLeft size={28} />
        </button>
        <button onClick={nextSlide} className="absolute right-6 z-10 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all border border-white/20">
          <ChevronRight size={28} />
        </button>

        <div key={currentSlide} className="relative z-10 animate-in zoom-in-95 duration-500 flex flex-col items-center">
          {mainSlides[currentSlide].icon}
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-4 drop-shadow-2xl uppercase leading-none">
            {mainSlides[currentSlide].titulo}
          </h2>
          <p className="text-white text-lg md:text-xl mb-8 opacity-90 font-medium max-w-[600px] leading-relaxed">
            {mainSlides[currentSlide].sub}
          </p>
          <button 
            onClick={() => window.location.href = mainSlides[currentSlide].link}
            className="bg-white text-[#ff5722] font-black py-4 px-12 rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all uppercase text-sm tracking-widest active:scale-95"
          >
            {mainSlides[currentSlide].btn}
          </button>
        </div>

        {/* Indicadores Modernos */}
        <div className="absolute bottom-6 flex gap-3">
          {mainSlides.map((_, i) => (
            <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'bg-white w-10' : 'bg-white/30 w-3'}`} />
          ))}
        </div>
      </div>

      {/* BANNERS LATERAIS: Estilo Card Moderno */}
      <div className="flex flex-col gap-4 h-[450px]">
        {/* Universo Gamer */}
        <div className="flex-1 bg-gradient-to-tr from-[#1a1a1a] to-[#333] rounded-xl shadow-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group border border-white/5">
            <Gamepad2 className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-white font-black italic text-2xl leading-tight mb-4 uppercase tracking-tight">UNIVERSO<br/>GAMER</h3>
            <button 
                onClick={() => window.location.href = 'https://nibuy-produtos.vercel.app/'}
                className="text-xs bg-orange-500 text-white px-6 py-2.5 rounded-lg font-bold uppercase hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20"
            >
                Ver Coleção
            </button>
            
        </div>

        {/* Casa & Decoração */}
        <div className="flex-1 bg-[#fff2e6] rounded-xl shadow-xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden border border-orange-100 group">
            <Sofa className="text-[#ff5722] mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-[#ff5722] font-black italic text-2xl leading-tight mb-4 uppercase tracking-tight">CASA &<br/>DECORAÇÃO</h3>
            <button 
                onClick={() => window.location.href = 'https://nibuy-produtos.vercel.app/'}
                className="text-xs border-2 border-[#ff5722] text-[#ff5722] px-6 py-2 rounded-lg font-bold uppercase hover:bg-[#ff5722] hover:text-white transition-all shadow-sm"
            >
                Explorar
            </button>
           
        </div>
      </div>
    </div>
  );
};

export default Hero;