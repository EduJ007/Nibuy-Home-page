import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import FlashSales from './components/FlashSales';
import DailyDiscover from './components/DailyDiscover';
import Footer from './components/Footer';

const App: React.FC = () => {
  const parceiros = [
    { name: 'Shopee', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg', link: '#' },
    { name: 'Magalu', img: '/magalulogo.png', link: '#' },
    { name: 'Amazon', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', link: '#' },
    { name: 'AliExpress', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Aliexpress_logo.svg', link: '#' },
    { name: 'Shein', img: '/sheinlogo.png', link: '#' },
    { name: 'Mercado Livre', img: '/mercadolivrelogo.png', link: '#' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Header />
      
      <main className="mt-[140px] md:mt-[160px] pb-10">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
          <Hero />

          {/* SEÇÃO DE SITES PARCEIROS - ÚNICA E CORRIGIDA */}
          <div className="bg-white mt-4 rounded-sm shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
            <h2 className="px-6 pt-5 pb-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
              Sites Parceiros
            </h2>
            
            <div className="px-4 pt-4 pb-8 md:pb-10"> 
              {/* gap-16 para dar o espaço lateral maior que você pediu */}
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {parceiros.map((p) => (
                  <a 
                    key={p.name} 
                    href={p.link} 
                    className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 flex items-center justify-center"
                  >
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className={`w-auto object-contain transition-all ${
                        /* Magalu e Amazon descendo mais um pouco como pedido */
                        p.name === 'Magalu' ? 'h-6 md:h-8 translate-y-[8px]' : 
                        p.name === 'Shopee' ? 'h-6 md:h-8' : 
                        p.name === 'Amazon' ? 'h-6 md:h-8 translate-y-[6px]' :
                        p.name === 'Shein' ? 'h-8 md:h-10' : 
                        'h-6 md:h-8'
                      }`}
                      onError={(e) => { 
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${p.name}&background=f3f4f6&color=999&size=128`;
                      }} 
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Categorias */}
          <CategoryGrid />

          {/* Ofertas Relâmpago */}
          <FlashSales /> 

          {/* Descobertas Diárias */}
          <DailyDiscover />
          
          {/* Botão Ver Mais */}
          <div className="flex justify-center mt-8">
            <button className="bg-white px-20 py-3 text-gray-600 border border-gray-200 rounded-sm hover:bg-gray-50 shadow-sm transition-colors font-medium">
              Ver Mais
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;