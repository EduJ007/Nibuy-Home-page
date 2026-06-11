import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      {/* Ajustado: Centralizado no mobile (text-center) e alinhado à esquerda no PC (md:text-left) */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
        
        {/* COLUNA 1: IDENTIDADE */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
          <span className="text-3xl font-black text-[#ff5722]">𝙉𝙞𝙗𝙪𝙮</span>
          <p className="mt-4 text-gray-400 max-w-sm text-sm leading-relaxed">
            Sua vitrine inteligente de ofertas. Encontramos os melhores preços e você finaliza a compra com total segurança nas maiores lojas do Brasil.
          </p>
          
          {/* Ajustado: Ícones centralizados no mobile */}
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <a href="https://instagram.com/nibuyoficial" target="_blank" rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff5722] transition-all duration-300 group">
              <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <a href="https://www.facebook.com/profile.php?id=61583962855568" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#4267B2] transition-all duration-300 group">
              <Facebook size={18} className="group-hover:scale-110 transition-transform" />
            </a>

            <a href="https://pin.it/hFv1x89A5" target="_blank" rel="noopener noreferrer" 
              className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-300 group">
              <i className="fa-brands fa-pinterest text-[18px] group-hover:scale-110 transition-transform"></i>
            </a>
          </div>
        </div>

        {/* COLUNA 2: NAVEGAÇÃO LIVRE */}
        {/* Ajustado: Borda decorativa lateral vira uma linha inferior charmosa no mobile */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="font-bold mb-4 uppercase text-[10px] tracking-[0.2em] text-white border-b-2 md:border-b-0 md:border-l-2 border-[#ff5722] pb-1 md:pb-0 md:pl-3 inline-block">
            Navegação
          </h4>
          <ul className="space-y-3 text-gray-400 text-sm w-full">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? "text-[#ff5722] font-bold" : "hover:text-white transition-colors"
                }
              >
                Página Principal
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/Sobre-nós" 
                className={({ isActive }) => 
                  isActive ? "text-[#ff5722] font-bold" : "hover:text-white transition-colors"
                }
              >
                Sobre o Nibuy
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/central-de-ajuda" 
                className={({ isActive }) => 
                  isActive ? "text-[#ff5722] font-bold" : "hover:text-white transition-colors"
                }
              >
                Central de Ajuda
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Contato"
                className={({ isActive }) => 
                  isActive ? "text-[#ff5722] font-bold" : "hover:text-white transition-colors"
                }
              >
                Contato
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/Lista-produtos" 
                className={({ isActive }) => 
                  isActive ? "text-[#ff5722] font-bold" : "hover:text-white transition-colors"
                }
              >
                Lista de Produtos
              </NavLink>
            </li>
          </ul>
        </div>

        {/* COLUNA 3: SUPORTE */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="font-bold mb-4 uppercase text-[10px] tracking-[0.2em] text-white border-b-2 md:border-b-0 md:border-l-2 border-[#ff5722] pb-1 md:pb-0 md:pl-3 inline-block">
            Suporte
          </h4>
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Segunda a Sexta<br/><span className="text-white">09h às 18h</span></p>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nibuyoficial@gmail.com" className="text-sm text-[#ff5722] font-bold underline hover:text-orange-400 transition-colors block break-all" target="_blank" rel="noopener noreferrer">
              nibuyoficial@nibuy.com.br
            </a>
          </div>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 NIBUY OFERTAS. TODOS OS DIREITOS RESERVADOS.</p>
      </div>
    </footer>
  );
};

export default Footer;