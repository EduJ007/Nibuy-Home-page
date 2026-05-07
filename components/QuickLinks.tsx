import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickLinkItem {
  label: string;
  url: string;
  img: string;
}

const links: QuickLinkItem[] = [
  { label: 'Ofertas', url: '/Lista-produtos?sort=flash', img: '/ofertasimg.png' },
  { label: 'Recomendados', url: '/Lista-produtos?sort=recomend', img: '/recomendadosimg.png' },
  { label: 'Achadinhos', url: '/Lista-produtos?sort=deals', img: '/achadinhosimg.png' },
  { label: 'Mais Baratos', url: '/Lista-produtos?sort=price_asc', img: '/maisbarato.png' },
  { label: 'Mais Vendidos', url: '/Lista-produtos?sort=sales', img: '/maisvendidosimg.png' },
];

const QuickLinks: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    navigate(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-[96%] max-w-[1400px] mx-auto mt-20 md:mt-20 border-gray-300">
      {/* Voltamos para o flex-wrap para mostrar todos no mobile sem precisar de scroll lateral */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-14">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(link.url)}
            className="flex flex-col items-center gap-3 group outline-none active:scale-90 transition-transform"
          >
            {/* Container da Imagem - Visual clássico (Preenchido) */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-[#ff5722] group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg bg-gray-100 relative">
              
              {/* Overlay suave no hover para dar profundidade */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
              
              <img 
                src={link.img} 
                alt={link.label} 
                /* Voltamos para w-full h-full object-cover para preencher tudo */
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Nibuy'; }}
              />
            </div>
            
            {/* Texto - Estilo Nibuy (Font Black e Gray-500) com hover laranja */}
            <span className="text-[10px] md:text-[14px] font-black tracking-tighter text-gray-600 group-hover:text-[#ff5722] transition-colors uppercase">
              {link.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;