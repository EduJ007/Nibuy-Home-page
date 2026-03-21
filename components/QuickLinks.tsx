import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importa o navigate

interface QuickLinkItem {
  label: string;
  url: string;
  img: string;
}

const links: QuickLinkItem[] = [
  {
    label: 'Ofertas',
    url: '/Lista-produtos?sort=flash#filtros', // URLs internas sem o domínio da Vercel
    img: '/ofertasimg.png',
  },
  {
    label: 'Recomendados',
    url: '/Lista-produtos?sort=recomend#filtros',
    img: '/recomendadosimg.png',
  },
  {
    label: 'Achadinhos',
    url: '/Lista-produtos?sort=deals#filtros',
    img: '/achadinhosimg.png',
  },
  {
    label: 'Mais Baratos',
    url: '/Lista-produtos?sort=price_asc#filtros',
    img: '/maisbarato.png',
  },
  {
    label: 'Mais Vendidos',
    url: '/Lista-produtos?sort=sales#filtros',
    img: '/maisvendidosimg.png',
  },
];

const QuickLinks: React.FC = () => {
  const navigate = useNavigate(); // 2. Inicializa o hook

  const handleNavigation = (url: string) => {
    // Navegação interna suave sem recarregar a página
    navigate(url);
    // Garante que a página comece no topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-[96%] max-w-[1400px] mx-auto mt-16">
      <div className="flex flex-wrap justify-center gap-8 md:gap-14">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(link.url)} // 3. Usa a nova função
            className="flex flex-col items-center gap-3 group outline-none"
          >
            {/* Container da Imagem */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg bg-gray-100">
              <img 
                src={link.img} 
                alt={link.label} 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Nibuy'; }}
              />
            </div>
            
            {/* Texto em negrito */}
            <span className="text-[10px] md:text-[14px] font-black tracking-tighter text-gray-500 group-hover:text-orange-600 transition-colors uppercase">
              {link.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;