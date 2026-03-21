import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        
        {/* COLUNA 1: IDENTIDADE */}
        <div className="col-span-1 md:col-span-2">
          <span className="text-3xl font-black text-[#ff5722]">𝙉𝙞𝙗𝙪𝙮</span>
          <p className="mt-4 text-gray-400 max-w-sm text-sm leading-relaxed">
            Sua vitrine inteligente de ofertas. Encontramos os melhores preços e você finaliza a compra com total segurança nas maiores lojas do Brasil.
          </p>
          
          <div className="flex gap-4 mt-6">
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
        <div>
          <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] text-white border-l-2 border-[#ff5722] pl-3">
            Navegação
          </h4>
          <ul className="space-y-4 text-gray-400 text-sm">
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
        <div>
          <h4 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em] text-white border-l-2 border-[#ff5722] pl-3">Suporte</h4>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Segunda a Sexta<br/><span className="text-white">09h às 18h</span></p>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nibuyoficial@gmail.com" className="text-sm text-[#ff5722] font-bold underline hover:text-orange-400 transition-colors" target="_blank" rel="noopener noreferrer">
              nibuyoficial@nibuy.com.br
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-[10px] uppercase tracking-widest font-bold">
        <p>© 2026 NIBUY OFERTAS. TODOS OS DIREITOS RESERVADOS.</p>
      </div>
    </footer>
  );
};

export default Footer;