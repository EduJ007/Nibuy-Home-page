import React, { useState } from 'react';
import { Mail, MessageCircle, Instagram, Copy, Check, Share2 } from 'lucide-react';

const SupportCards: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "nibuyoficial@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-gray-200 pb-20 px-6 mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-gray-900">
            Ainda precisa de ajuda?
          </h3>
          <p className="text-gray-500 font-medium text-[16px] mt-4  tracking-widest">Escolha um dos canais abaixo:</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* GRID DE REDES SOCIAIS - Aumentado e com Pinterest */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* WHATSAPP */}
            <a href="https://wa.me/558193611017" target="_blank" rel="noopener noreferrer" 
               className="flex items-center p-6 bg-white rounded-[2rem] border-2 border-transparent hover:border-green-500 transition-all group shadow-md">
              <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                <MessageCircle size={26} />
              </div>
              <div className="ml-4 text-left">
                <span className="block font-bold text-gray-800  text-[16px]  leading-none">WhatsApp</span>
                <span className="block text-[12px] text-gray-400 font-bold  mt-1">Suporte</span>
              </div>
            </a>

            {/* INSTAGRAM */}
            <a href="https://instagram.com/nibuyoficial" target="_blank" rel="noopener noreferrer"
               className="flex items-center p-6 bg-white rounded-[2rem] border-2 border-transparent hover:border-[#ff5722] transition-all group shadow-md">
              <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-[#ff5722] group-hover:bg-[#ff5722] group-hover:text-white transition-all">
                <Instagram size={26} />
              </div>
              <div className="ml-4 text-left">
                <span className="block font-bold text-gray-800  text-[16px] leading-none">Instagram</span>
                <span className="block text-[12px] text-gray-400 font-bold  mt-1">Perfil</span>
              </div>
            </a>

            {/* PINTEREST - COLOQUE SEU LINK NO HREF ABAIXO */}
            <a href="https://pin.it/hFv1x89A5" target="_blank" rel="noopener noreferrer"
               className="flex items-center p-6 bg-white rounded-[2rem] border-2 border-transparent hover:border-red-600 transition-all group shadow-md">
              <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                <i className="fa-brands fa-pinterest text-2xl"></i>
              </div>
              <div className="ml-4 text-left">
                <span className="block font-bold text-gray-800 text-[16px]  leading-none">Pinterest</span>
                <span className="block text-[12px] text-gray-400 font-bold  mt-1">Ideias</span>
              </div>
            </a>
          </div>

          {/* E-MAIL PROFISSIONAL (MAIOR TAMBÉM) */}
          <div className="relative group">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nibuyoficial@gmail.com" target="_blank" rel="noopener noreferrer"
               className="w-full flex items-center justify-between p-6 bg-gray-900 rounded-[2.5rem] border-2 border-transparent hover:border-[#ff5722] transition-all shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-white group-hover:bg-[#ff5722] transition-all">
                  <Mail size={26} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold  text-[16px] leading-none ">E-mail Oficial</h4>
                  <p className="text-gray-400 font-medium text-[12px] mt-1">{email}</p>
                </div>
              </div>
              <button onClick={handleCopy} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-[12px] transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-[#ff5722] hover:bg-white hover:text-gray-900'}`}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'COPIADO!' : 'COPIAR'}
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportCards;