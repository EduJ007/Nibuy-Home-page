import React, { useState } from 'react';
import { Send, MessageCircle, Instagram, Mail } from 'lucide-react';

const Contato: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  // Estado para controlar o status do envio (carregando, sucesso ou erro)
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    // O link do seu Formspree
    const actionUrl = "https://formspree.io/f/xeerwapn";

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("SUCESSO");
        setFormData({ nome: '', email: '', assunto: '', mensagem: '' }); // Limpa o formulário
        alert("Valeu! Recebemos sua mensagem.");
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          setStatus(data["errors"].map((error: any) => error["message"]).join(", "));
        } else {
          setStatus("Erro ao enviar. Tente novamente.");
        }
      }
    } catch (error) {
      setStatus("Erro na conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 pt-40 pb-20 px-4 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        
        {/* TÍTULO ESTILIZADO */}
        <div className="bg-white border-b-4 border-[#ff5722] py-6 mb-12 shadow-sm px-6 flex justify-center">
          <h2 className="text-[#ff5722] tracking-[0.15em] font-black text-2xl md:text-3xl uppercase italic">
            Fale Conosco
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA 1: INFORMAÇÕES DE CONTATO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-md border-b-4 border-gray-300">
              <h3 className="text-black font-black text-xl uppercase mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-[#ff5722] rounded-full"></div>
                Canais Oficiais
              </h3>
              
              <div className="space-y-6">
                {/* WHATSAPP */}
                <a href="https://wa.me/558193611017" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">WhatsApp</p>
                    <p className="text-gray-700 font-black">(81) 9361-1017</p>
                  </div>
                </a>

                {/* INSTAGRAM */}
                <a href="https://www.instagram.com/nibuyoficial/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Instagram</p>
                    <p className="text-gray-700 font-black">@NibuyOficial</p>
                  </div>
                </a>

                {/* EMAIL */}
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 text-[#ff5722] rounded-2xl flex items-center justify-center group-hover:bg-[#ff5722] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[#ff5722]/40">
                    <Mail size={24} />
                  </div>
                  <div>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nibuyoficial@gmail.com" target="_blank" rel="noopener noreferrer">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider group-hover:text-[#ff5722] transition-colors">E-mail</p>
                      <p className="text-gray-700 font-black group-hover:text-black transition-colors">Nibuyoficial@gmail.com</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD DE HORÁRIO */}
            <div className="bg-[#ff5722] p-8 rounded-3xl shadow-lg text-white font-bold italic uppercase">
              <h3 className="text-lg mb-2">Atendimento</h3>
              <p className="text-sm opacity-90">
                Segunda a Sexta: 08h às 18h<br/>
                Sábado: 09h às 13h
              </p>
            </div>
          </div>

          {/* COLUNA 2: FORMULÁRIO */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border-t-8 border-[#ff5722]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-2">Seu Nome</label>
                    <input 
                      name="nome"
                      type="text" 
                      required
                      value={formData.nome}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-[#ff5722] outline-none transition-all font-bold text-gray-700"
                      placeholder="Ex: João Silva"
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-2">Seu E-mail</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      value={formData.email}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-[#ff5722] outline-none transition-all font-bold text-gray-700"
                      placeholder="email@exemplo.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-2">Assunto</label>
                  <input 
                    name="assunto"
                    type="text" 
                    value={formData.assunto}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-[#ff5722] outline-none transition-all font-bold text-gray-700"
                    placeholder="Como podemos ajudar?"
                    onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2 ml-2">Mensagem</label>
                  <textarea 
                    name="mensagem"
                    rows={5}
                    required
                    value={formData.mensagem}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-[#ff5722] outline-none transition-all font-bold text-gray-700 resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                    onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  ></textarea>
                </div>

                {/* MENSAGEM DE STATUS ABAIXO DO FORM */}
                {status && status !== "SUCESSO" && (
                  <p className="text-red-500 font-bold text-sm text-center">{status}</p>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-[#ff5722] hover:bg-black'} text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 group`}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  {!isSubmitting && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contato;