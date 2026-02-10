import React, { useState, useRef } from 'react';
// 1. Removi o Pin e Pinterest daqui para não dar erro de conflito
import { Search, Bell, HelpCircle, User, Camera, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const imageURL = URL.createObjectURL(file);
      const updated = { ...user, photo: imageURL };
      setUser(updated);
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updated));
      setShowUserMenu(false);
    }
  };

  const handleAuthAction = () => {
    setError('');
    if (!emailInput || !passwordInput) { setError('Preencha os campos!'); return; }
    if (!isLoginView) {
      if (!nameInput) { setError('Digite seu nome!'); return; }
      const newUser = { name: nameInput, email: emailInput, password: passwordInput, photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameInput}` };
      localStorage.setItem(`user_${emailInput}`, JSON.stringify(newUser));
      alert('Cadastro realizado!');
      setIsLoginView(true);
    } else {
      const stored = localStorage.getItem(`user_${emailInput}`);
      if (!stored) { setError('Usuário não encontrado!'); return; }
      const parsed = JSON.parse(stored);
      if (parsed.password !== passwordInput) { setError('Senha incorreta!'); return; }
      setUser(parsed);
      setShowLoginModal(false);
    }
  };

  const handleSearch = () => { window.location.href = 'https://nibuy-produtos.vercel.app/'; };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ff5722] shadow-md text-white">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      {/* Top Bar */}
      <div className="hidden md:flex max-w-[1200px] mx-auto py-1.5 justify-between items-center text-xs px-4">
        <div className="flex gap-4 items-center">
          <a href="https://nibuy-contact.vercel.app/" className="hover:text-gray-200 transition-colors text-white">Entrar em Contato</a>
          <span className="opacity-30">|</span>
          <a href="https://sobre-nibuy.vercel.app/" className="hover:text-gray-200 transition-colors text-white">Sobre nós</a>
          <span className="opacity-30">|</span>
          
          <div className="flex items-center gap-3">
            <span>Siga-nos no</span>
            {/* 2. ÁREA SOCIAL CORRIGIDA (Sem borda lateral e ícones brancos) */}
            <div className="flex items-center gap-4 ml-1"> 
              <a href="https://instagram.com/nibuyoficial" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity">
                <i className="fa-brands fa-instagram text-[20px]"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity">
                <i className="fa-brands fa-facebook text-[20px]"></i>
              </a>
              <a href="https://pin.it/hFv1x89A5" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity">
                <i className="fa-brands fa-pinterest text-[20px]"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="flex items-center gap-1 hover:text-gray-300"
            >
              <div className="relative">
                <Bell size={18} />
                {notifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#ff5722] font-bold">
                    {notifCount}
                  </span>
                )}
              </div>
              Notificações
            </button> 

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-md shadow-2xl border border-gray-100 z-20 text-gray-800 origin-top-right overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Notificações</span>
                    {notifCount > 0 && (
                      <button onClick={() => setNotifCount(0)} className="text-[10px] font-bold text-[#ff5722] hover:underline uppercase">
                        Marcar como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifCount > 0 ? (
                      <div className="p-4 flex gap-4 hover:bg-orange-50 transition-colors cursor-pointer border-b border-gray-50">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-xl">🎉</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">Bem-vindo ao Nibuy!</p>
                          <p className="text-xs text-gray-500 mt-1 text-left">Só acessar os produtos abaixo e comprar</p>
                          <span className="text-[10px] text-gray-400 mt-2 block font-medium text-left">Agora mesmo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                        <Bell size={24} className="text-gray-300" />
                        <p className="text-sm font-bold text-gray-800">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div> {/* FECHAMENTO DA DIV RELATIVE */}

          <a href="https://nibuy-central-ajuda.vercel.app/" className="flex items-center gap-1 hover:text-gray-300">
            <HelpCircle size={18} /> Ajuda
          </a>

          {!user && (
            <div className="flex gap-2 font-bold">
              <button onClick={() => { setShowLoginModal(true); setIsLoginView(false); }} className="hover:text-gray-200">Cadastrar</button>
              <span className="opacity-30 font-normal">|</span>
              <button onClick={() => { setShowLoginModal(true); setIsLoginView(true); }} className="hover:text-gray-200">Entre</button>
            </div>
          )}
        </div>
      </div> {/* FECHAMENTO DA TOP BAR */}
   
      {/* Main Header Area */}
      <div className="max-w-[1200px] mx-auto py-4 px-4 flex items-center gap-8">
        <div onClick={() => window.location.href = 'https://nibuy-home-page.vercel.app/'} className="flex items-center gap-3 cursor-pointer shrink-0">
          <img src="/logo-nibuy.png" alt="Nibuy Logo" className="h-14 w-auto" />
          <span className="text-3xl font-black hidden md:block">𝙉𝙞𝙗𝙪𝙮</span>
        </div>

        <div className="flex-1">
          <div onClick={handleSearch} className="bg-white rounded-sm p-1 flex items-center shadow-sm cursor-pointer">
            <input type="text" placeholder="Buscar na Nibuy..." className="flex-1 px-4 py-2 text-gray-800 outline-none" readOnly />
            <button className="bg-[#ff5722] px-6 py-2 rounded-sm"><Search size={20} /></button>
          </div>
        </div>

        <div className="relative group">
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img src={user.photo} className="w-9 h-9 rounded-full border border-white/50" alt="User" />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] opacity-80 leading-none">Olá, {user.name}</span>
                <span className="text-sm font-bold leading-none">Minha Conta</span>
              </div>
            </div>
          ) : (
            <div onClick={() => { setShowLoginModal(true); setIsLoginView(true); }} className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30"><User size={24} /></div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] opacity-80 leading-none">Olá, faça seu</span>
                <span className="text-sm font-bold leading-none">Login</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;