import React, { useState } from 'react';
import { FAQItem } from '../types';

interface FAQSectionProps {
  items: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-gray-200 py-2" id="faq-section">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Dúvidas Frequentes
        </h2>

        <div className="space-y-4">
          {items.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-all hover:border-[#ff5722]/20"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-[#ff5722] transition-colors">
                  {faq.question}
                </span>
                <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${
                  openId === faq.id ? 'rotate-180 text-[#ff5722]' : ''
                }`}></i>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openId === faq.id ? 'max-h-96 opacity-100 bg-white' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-500 leading-relaxed border-t border-gray-50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;