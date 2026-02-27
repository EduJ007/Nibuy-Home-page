import React from 'react';
import { auth } from '../firebase';

interface QuickLinkItem {
  label: string;
  url: string;
  img: string;
}

const protectedRedirect = (url: string) => {
  if (auth.currentUser) {
    window.location.href = url;
  } else {
    window.dispatchEvent(new Event('showNibuyWarning'));
  }
};

const links: QuickLinkItem[] = [
  {
    label: 'Ofertas',
    url: 'https://nibuy-produtos.vercel.app/#produtos',
    // Imagem: Fogo/Promoção 3D
    img: '/ofertaimg.png',
  },
 {
    label: 'Recomendados',
    url: '?sort=sales#produtos', // "Mais Vendidos"
    img: 'https://img.freepik.com/vetores-gratis/cores-amarelas-brilhantes-da-estrela-3d-forma-de-estrela-suave-e-fofa-ilustracao-vetorial-realista-isolada-em-um-fundo-branco_145391-1342.jpg',
  },
  {
    label: 'Achadinhos',
    url: '?sort=price_asc#produtos', // "Menor Preço"
    img: 'https://images.emojiterra.com/google/android-jellybean/1f50e.png',
  },
  {
    label: 'Lojas Oficiais',
    url: '?official=true#produtos', // Filtro de Oficiais
    img: 'https://static.vecteezy.com/system/resources/previews/028/766/353/large_2x/shopee-icon-symbol-free-png.png',
  },
];

const QuickLinks: React.FC = () => {
  return (
    <section className="w-[96%] max-w-[1400px] mx-auto mt-16">
      <div className="flex flex-wrap justify-center gap-8 md:gap-14">
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => protectedRedirect(link.url)}
            className="flex flex-col items-center gap-3 group outline-none"
          >
            {/* Container da Imagem com efeito de borda laranja no hover */}
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-orange-500 group-hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg bg-gray-100 $`}>
              <img 
                src={link.img} 
                alt={link.label} 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Nibuy'; }}
              />
            </div>
            
            {/* Texto em negrito */}
            <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-gray-500 group-hover:text-orange-600 transition-colors">
              {link.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickLinks;