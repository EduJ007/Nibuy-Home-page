import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, User, LogOut, Settings, Camera, Check, X } from 'lucide-react';
import { auth, db, googleProvider } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // Novo
  const [isLoginView, setIsLoginView] = useState(true);

  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // Estados para edição de perfil
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as any;
          setUser(userData);
          setEditName(userData.name);
          setEditPhoto(userData.photo);
        } else {
          const newUser = {
            name: currentUser.displayName || 'Usuário',
            email: currentUser.email || '',
            photo: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`
          };
          await setDoc(doc(db, "users", currentUser.uid), newUser);
          setUser(newUser);
          setEditName(newUser.name);
          setEditPhoto(newUser.photo);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !editName) return;
    setUpdateLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name: editName, photo: editPhoto });
      setUser(prev => prev ? { ...prev, name: editName, photo: editPhoto } : null);
      setShowProfileModal(false);
      alert("Perfil atualizado com sucesso! 🎉");
    } catch (err) {
      setError('Erro ao atualizar perfil.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAuthAction = async () => {
    setError('');
    try {
      if (!isLoginView) {
        if (!nameInput) { setError('Nome é obrigatório'); return; }
        const res = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
        const newUser = { name: nameInput, email: emailInput, photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameInput}` };
        await setDoc(doc(db, "users", res.user.uid), newUser);
      } else {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      }
      setShowLoginModal(false);
    } catch (err: any) {
      setError('E-mail ou senha incorretos.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      if (!userDoc.exists()) {
        const newUser = {
          name: res.user.displayName || 'Usuário',
          email: res.user.email || '',
          photo: res.user.photoURL || ''
        };
        await setDoc(doc(db, "users", res.user.uid), newUser);
        setUser(newUser);
      }
      setShowLoginModal(false);
    } catch (err) { setError('Erro no login com Google.'); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ff5722] shadow-md text-white">
      {/* Top Bar - Preservada 100% igual ao seu original */}
      <div className="hidden md:flex max-w-[1200px] mx-auto py-1.5 justify-between items-center text-xs px-4">
  <div className="flex gap-4 items-center">
    <a href="https://nibuy-contact.vercel.app/" className="hover:text-gray-200 font-medium">Entrar em Contato</a>
    <span>|</span>
    <a href="https://sobre-nibuy.vercel.app/" className="hover:text-gray-200 font-medium">Sobre nós</a>
    <span>|</span>
    <div className="flex items-center gap-4 ml-1">
      <span className="font-medium">Siga-nos</span> 
      <div className="flex items-center gap-3">
        <a href="https://instagram.com/nibuyoficial" target="_blank" className="text-white hover:opacity-80"><i className="fa-brands fa-instagram text-[21px]"></i></a>
        <a href="https://www.facebook.com/profile.php?id=61583962855568" target="_blank" className="text-white hover:opacity-80"><i className="fa-brands fa-facebook text-[19px]"></i></a>
        <a href="https://pin.it/hFv1x89A5" target="_blank" className="text-white hover:opacity-80"><i className="fa-brands fa-pinterest text-[19px]"></i></a>
      </div>
    </div>
  </div>

  <div className="flex gap-4 items-center font-bold">
    {/* AJUSTE DAS NOTIFICAÇÕES */}
    <button 
      onClick={() => setShowNotifications(!showNotifications)} 
      className="flex items-center gap-1 font-normal relative pr-2"
    >
      <div className="relative">
        <Bell size={18} />
        {notifCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-white text-[#ff5722] text-[9px] h-3.5 w-3.5 flex items-center justify-center rounded-full font-medium border border-[#ff5722] shadow-sm">
            {notifCount}
          </span>
        )}
      </div>
      <span>Notificações</span>
    </button>
    
    <a href="https://nibuy-central-ajuda.vercel.app/" className="flex items-center gap-1 font-medium">
      <HelpCircle size={18} /> Central de ajuda
    </a>
    
    {!user && (
      <>
        <span className="opacity-50 font-normal">|</span>
        <button onClick={() => { setIsLoginView(false); setShowLoginModal(true); }} className="hover:opacity-80">Cadastrar</button>
        <span className="opacity-50 font-normal">|</span>
        <button onClick={() => { setIsLoginView(true); setShowLoginModal(true); }} className="hover:opacity-80">Entre</button>
      </>
    )}
  </div>
</div>
      {/* Main Header - Buscador e Perfil */}
      <div className="max-w-[1200px] mx-auto py-4 px-4 flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.location.href = '/'}>
          <img src="/logo-nibuy.png" alt="Logo" className="h-14 w-auto" />
          <span className="text-3xl font-black hidden md:block">𝙉𝙞𝙗𝙪𝙮</span>
        </div>
        
        <div className="flex-1 flex bg-white rounded-sm p-1 items-center shadow-sm">
          <input type="text" placeholder="Buscar na Nibuy..." className="flex-1 px-4 py-2 text-gray-800 outline-none" />
          <button className="bg-[#ff5722] px-6 py-2 rounded-sm hover:brightness-110"><Search size={20} /></button>
        </div>

        <div className="relative">
          {!user ? (
            <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 hover:opacity-80 transition-all">
              <User size={40} className="border-2 border-white rounded-full p-0.5" />
              <div className="text-left hidden lg:block leading-tight">
                <p className="text-[10px]">Entre ou</p>
                <p className="text-[14px] font-bold">Cadastre-se</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 cursor-pointer relative" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img src={user.photo} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
              <div className="hidden lg:block text-left">
                <p className="text-[10px] opacity-90">Olá, {user.name.split(' ')[0]}</p>
                <p className="text-xs font-bold uppercase tracking-tighter">Minha Conta</p>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-52 bg-white rounded-xl shadow-2xl text-gray-800 border border-gray-100 overflow-hidden z-[60]">
                  <div className="p-3 bg-gray-50 border-b flex items-center gap-2">
                    <img src={user.photo} className="w-8 h-8 rounded-full" />
                    <p className="font-bold text-xs truncate text-[#ff5722]">{user.name}</p>
                  </div>
                  <button onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center gap-2 font-bold">
                    <Settings size={16} className="text-gray-400" /> Editar Perfil
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold border-t border-gray-50">
                    <LogOut size={16} /> Sair da conta
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDITAR PERFIL - Com troca de foto e nome */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowProfileModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 relative text-gray-800">
            <div className="bg-[#ff5722] p-6 text-white flex justify-between items-center">
              <h3 className="font-black uppercase italic tracking-tighter text-xl">Editar Perfil</h3>
              <button onClick={() => setShowProfileModal(false)}><X size={30} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex justify-center mb-4">
                <img 
                  src={editPhoto} 
                  className="w-25 h-25 rounded-full border-4 border-orange-100 object-cover shadow-xl" 
                  onError={(e) => {(e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=error'}} 
                />
              </div>

              <div className="space-y-1">
                <h1 className="text-sm font-black uppercase text-[#ff5722] ml-1">Nome:</h1>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  placeholder="Seu nome" 
                  className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold focus:border-[#ff5722] outline-none" 
                />
              </div>

              <div className="space-y-1">
                <h1 className="text-sm font-black uppercase text-[#ff5722] ml-1">Link da Imagem:</h1>
                <input 
                  type="text" 
                  value={editPhoto} 
                  onChange={(e) => setEditPhoto(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateProfile()} 
                  placeholder="URL da foto" 
                  className="w-full border-2 border-gray-100 p-3 rounded-xl text-xs text-blue-500 focus:border-[#ff5722] outline-none" 
                />
              </div>

              <button 
                onClick={handleUpdateProfile} 
                disabled={updateLoading} 
                className="w-full bg-[#ff5722] text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
              >
                {updateLoading ? 'Salvando...' : <><Check size={20} /> Salvar Alterações</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 z-10 relative text-gray-800">
            <h2 className="text-2xl font-black text-[#ff5722] mb-6 text-center uppercase italic">{isLoginView ? 'Login' : 'Cadastro'}</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-xs font-bold mb-4 text-center border border-red-100">{error}</div>}
            <div className="space-y-4">
              {!isLoginView && <input type="text" placeholder="Nome" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none" />}
              <input type="email" placeholder="E-mail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none" />
              <input type="password" placeholder="Senha" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none" />
              <button onClick={handleAuthAction} className="w-full bg-[#ff5722] text-white font-bold py-3 rounded-lg hover:brightness-110">{isLoginView ? 'Entrar' : 'Cadastrar'}</button>
            </div>
            <button onClick={handleGoogleLogin} className="w-full mt-4 flex items-center justify-center gap-3 border p-3 rounded-lg font-bold text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
            </button>
            <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-6 text-[#ff5722] text-sm font-bold text-center">
              {isLoginView ? 'Criar conta' : 'Já tenho conta'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;