import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importa o hook

const partners = [
  { name: 'Amazon', color: 'text-red-600', slug: 'Amazon' },
  { name: 'Shopee', color: 'text-orange-600', slug: 'Shopee' },
  { name: 'Magalu', color: 'text-blue-600', slug: 'Magalu' },
  { name: 'Mercado Livre', color: 'text-yellow-600', slug: 'Mercado Livre' },
];

const PartnerLogos: React.FC = () => {
  const navigate = useNavigate(); // 2. Inicializa o hook

  const handlePartnerClick = (storeName: string) => {
    // 3. Navega para a lista filtrando pela loja selecionada
    navigate(`/Lista-produtos?loja=${encodeURIComponent(storeName)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 bg-gray-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-black uppercase tracking-widest mb-8">
          Curadoria das Melhores Lojas
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <button
              key={partner.name}
              onClick={() => handlePartnerClick(partner.slug)}
              className={`text-2xl md:text-3xl font-bold ${partner.color} select-none grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer border-none bg-transparent`}
            >
              {partner.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerLogos;