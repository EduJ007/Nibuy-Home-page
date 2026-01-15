import React from 'react';
// IMPORTAÇÕES NECESSÁRIAS PARA OS ÍCONES FUNCIONAREM
import { Facebook, Instagram, Music2, Truck, ShieldCheck, HelpCircle } from 'lucide-react';
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Atendimento */}
          <div>
            <h4 className="font-bold text-gray-800 mb-5 uppercase text-xs tracking-wider">Atendimento</h4>
            <ul className="space-y-3">
              <li>
                <a href="/ajuda" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors text-sm text-gray-500">
                  <div className="w-4 flex justify-center"><HelpCircle size={14} className="text-[#ee4d2d]"/></div>
                  <span>Central de Ajuda</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/558193611017" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors font-medium text-sm text-gray-700">
                  <div className="w-4 flex justify-center"><Truck size={14} className="text-[#ee4d2d]"/></div>
                  <span>Como Rastrear meu Pedido?</span>
                </a>
              </li>
              <li>
                <a href="/contato" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors text-sm text-gray-500">
                  <div className="w-4"></div>
                  <span>Como Comprar</span>
                </a>
              </li>
              <li>
                <a href="/contato" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors text-sm text-gray-500">
                  <div className="w-4"></div>
                  <span>Devolução e Reembolso</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 2: Institucional */}
          <div>
            <h4 className="font-bold text-gray-800 mb-5 uppercase text-xs tracking-wider">Sobre a Nibuy</h4>
            <ul className="space-y-3">
              <li>
                <a href="/sobre" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors text-sm text-gray-500">
                  <div className="w-4"></div>
                  <span>Quem Somos</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors text-sm text-gray-500">
                  <div className="w-4"></div>
                  <span>Termos e Condições</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:text-[#ee4d2d] transition-colors text-sm text-gray-500">
                  <div className="w-4"></div>
                  <span>Política de Privacidade</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-4 flex justify-center"><ShieldCheck size={14} className="text-green-600"/></div>
                <span className="text-gray-600 font-medium">Site 100% Seguro</span>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Pagamento */}
          <div>
            <h4 className="font-bold text-gray-800 mb-5 uppercase text-xs tracking-wider">Pagamento Em</h4>
            <div className="flex flex-wrap gap-2 pr-4">
              <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-600">PIX</div>
              <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-600">BOLETO</div>
              <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-600">VISA</div>
              <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-[10px] font-bold text-gray-600">MASTER</div>
            </div>
            <p className="mt-4 text-[11px] leading-tight italic text-gray-400">Parcele suas compras em até 12x no cartão via parceiros.</p>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div>
            <h4 className="font-bold text-gray-800 mb-5 uppercase text-xs tracking-wider">Siga a Nibuy</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="p-2 bg-gray-50 rounded-full hover:text-[#ee4d2d] transition-colors text-gray-400"><Instagram size={18} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all border border-gray-100">
                  <Music2 size={18} />
                </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full hover:text-[#ee4d2d] transition-colors text-gray-400"><Facebook size={18} /></a>
            </div>
            <div className="text-[11px] text-gray-400 border-t border-gray-50 pt-4">
              <p className="font-bold uppercase mb-1">Contato Profissional</p>
              <a href="https://mail.google.com/mail/u/0/?hl=pt-BR#inbox" className="hover:text-[#ee4d2d]">nibuyoficial@gmail.com</a>
            </div>
          </div>

        </div>

        {/* Linha Final de Copyright */}
        <div className="border-t border-gray-100 pt-8 text-center md:text-left">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            © 2026 NIBUY BRASIL - O SHOPPING DOS AFILIADOS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;