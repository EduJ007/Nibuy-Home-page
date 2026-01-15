import React, { useState, useRef } from 'react';
import { Search, Bell, HelpCircle, Instagram, Facebook, CassetteTape as Pinterest, Music2, User, Camera, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  // Referência para o input de arquivo escondido
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Usuário
  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  
  // Estados dos Inputs
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // FUNÇÃO PARA FAZER UPLOAD DA FOTO DO PC/CELULAR
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      // Cria um link temporário para a imagem que você escolheu no PC
      const imageURL = URL.createObjectURL(file);
      const updated = { ...user, photo: imageURL };
      setUser(updated);
      
      // Salva no localStorage (Nota: imagens grandes podem não salvar no storage, mas o link funciona na sessão)
      localStorage.setItem(`user_${user.email}`, JSON.stringify(updated));
      setShowUserMenu(false);
    }
  };

  const handleAuthAction = () => {
    setError('');
    if (!emailInput || !passwordInput) { setError('Preencha os campos!'); return; }

    if (!isLoginView) {
      if (!nameInput) { setError('Digite seu nome!'); return; }
      const newUser = { 
        name: nameInput, 
        email: emailInput, 
        password: passwordInput, 
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameInput}` 
      };
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

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ff5722] shadow-md text-white">
      {/* Input de arquivo escondido (ajuda a abrir o explorador de arquivos) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Bar */}
      <div className="hidden md:flex max-w-[1200px] mx-auto py-1.5 justify-between items-center text-xs">
        <div className="flex gap-4 items-center">
          <a href="#" className="hover:text-gray-200 transition-colors">Entrar em Contato</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-gray-200 transition-colors">Sobre nós</a>
          <span className="opacity-30">|</span>
          <div className="flex items-center gap-2">
            <span>Siga-nos no</span>
            <div className="flex items-center gap-3">
              <Instagram size={18} className="cursor-pointer hover:text-gray-300" />
              <Facebook size={18} className="cursor-pointer hover:text-gray-300" />
              <Music2 size={16} className="cursor-pointer hover:text-gray-300 transition-colors" /> {/* TikTok */}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="flex items-center gap-1 hover:text-gray-300">
              <div className="relative">
                <Bell size={18} />
                {notifCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#ff5722] font-bold">{notifCount}</span>}
              </div>
              Notificações
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-sm shadow-xl border border-gray-100 z-20 text-gray-800 origin-top-right">
                  <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <span className="font-semibold text-sm">Notificações Recentes</span>
                    <button onClick={() => setNotifCount(0)} className="text-[13px] text-[#ff5722] hover:underline">Marcar como lidas</button>
                  </div>
                  <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                    {notifCount > 0 ? (
                      <><div className="text-2xl">👋</div><p className="text-sm">Bem-vindo ao Nibuy!</p></>
                    ) : (
                      <><div className="text-4xl opacity-20">🔔</div><p className="text-sm text-gray-400">Caixa vazia</p></>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <a href="#" className="flex items-center gap-1 hover:text-gray-300">
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
      </div>

      {/* Main Header Area */}
      <div className="max-w-[1200px] mx-auto py-4 px-4 lg:px-0 flex items-center gap-8">
        <div onClick={() => window.location.href = '/'} className="flex items-center gap-3 cursor-pointer shrink-0 active:opacity-70 transition-opacity">
          <img src="/logo-nibuy.png" alt="Nibuy Logo" className="h-16 w-auto object-contain" />
          <span className="text-3xl font-black hidden md:block tracking-tighter">𝙉𝙞𝙗𝙪𝙮</span>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-sm p-1 flex items-center shadow-sm">
            <input 
              type="text" 
              placeholder="Buscar na Nibuy..." 
              className="flex-1 px-4 py-2 text-gray-800 outline-none placeholder:text-gray-400"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="bg-[#ff5722] px-6 py-2 rounded-sm hover:opacity-90 transition-opacity"><Search size={20} /></button>
          </div>
        </div>

        {/* User / Account Button */}
        <div className="relative group">
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img src={user.photo} className="w-9 h-9 rounded-full border border-white/50 object-cover" alt="User" />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] opacity-80 leading-none">Olá, {user.name}</span>
                <span className="text-sm font-bold leading-none">Minha Conta</span>
              </div>
            </div>
          ) : (
            <div onClick={() => { setShowLoginModal(true); setIsLoginView(true); }} className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30"><User size={24} /></div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[10px] opacity-80 leading-none">Olá, faça seu</span>
                <span className="text-sm font-bold leading-none">Login</span>
              </div>
            </div>
          )}

          {showUserMenu && user && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-xl text-gray-800 z-50 py-2 border border-gray-100">
                {/* AQUI CHAMA O INPUT DE ARQUIVO */}
                <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2">
                  <Camera size={16} className="text-[#ff5722]" /> Trocar Foto (Galeria)
                </button>
                <button onClick={() => { setUser(null); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold border-t">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Login / Cadastro */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl z-10 overflow-hidden text-gray-800">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#ff5722]">{isLoginView ? 'Entre no Nibuy' : 'Crie sua conta'}</h2>
                <button onClick={() => setShowLoginModal(false)} className="text-gray-400 text-2xl">&times;</button>
              </div>
              {error && <div className="mb-4 text-red-500 text-sm font-bold">⚠️ {error}</div>}
              <div className="space-y-4">
                {!isLoginView && <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-1 focus:ring-[#ff5722]" placeholder="Nome Completo" />}
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-1 focus:ring-[#ff5722]" placeholder="E-mail" />
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border border-gray-300 p-3 rounded-md outline-none focus:ring-1 focus:ring-[#ff5722]" placeholder="Senha" />
                <button onClick={handleAuthAction} className="w-full bg-[#ff5722] text-white font-bold py-3 rounded-md hover:brightness-110 shadow-lg shadow-orange-100">
                  {isLoginView ? 'Entrar' : 'Cadastrar'}
                </button>
              </div>
              <div className="mt-6 text-center text-sm border-t pt-4">
                <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-[#ff5722] font-bold hover:underline">
                  {isLoginView ? 'Novo no Nibuy? Cadastre-se' : 'Já tem conta? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;