import React, { useMemo } from 'react';
// Importando da pasta certa agora
import FAQSection from '../components/CentralAjudaComponents/FAQSection'; 
import SupportCards from '../components/CentralAjudaComponents/SupportCards';
import { FAQS } from '../components/CentralAjudaComponents/constants'; // Note que o constants está na raiz do src agora

const CentralAjuda: React.FC = () => {
  const filteredFaqs = useMemo(() => (FAQS as any[]) || [], []);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* pt-40 para garantir que o Header não cubra o conteúdo */}
      <div className="pt-32 md:pt-40 pb-10">
        <FAQSection items={filteredFaqs} searchQuery="" />
        <SupportCards />
      </div>
    </div>
  );
};

export default CentralAjuda;