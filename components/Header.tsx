import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, User, LogOut } from 'lucide-react';
import { auth, db, googleProvider } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // 1. MONITOR DE LOGIN (Resolve o erro de autenticação e mantém logado)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as any);
        } else {
          // Caso o documento não exista (ex: primeiro login Google), cria agora
          const newUser = {
            name: currentUser.displayName || 'Usuário',
            email: currentUser.email || '',
            photo: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`
          };
          await setDoc(doc(db, "users", currentUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowUserMenu(false);
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
      if (err.code === 'auth/wrong-password') setError('Senha incorreta!');
      else if (err.code === 'auth/user-not-found') setError('Usuário não encontrado!');
      else setError('Erro ao entrar na conta.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLoginModal(false);
    } catch (err) { setError('Erro no login com Google.'); }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ff5722] shadow-md text-white">
      {/* Top Bar - Preservada com Siga-nos e separadores brancos */}
      <div className="hidden md:flex max-w-[1200px] mx-auto py-1.5 justify-between items-center text-xs px-4">
        <div className="flex gap-4 items-center">
          <a href="https://nibuy-contact.vercel.app/" className="hover:text-gray-200">Entrar em Contato</a>
          <span className="text-white font-normal">|</span>
          <a href="https://sobre-nibuy.vercel.app/" className="hover:text-gray-200">Sobre nós</a>
          <span className="text-white font-normal">|</span>
          <div className="flex items-center gap-4 ml-1">
            <span className="font-medium">Siga-nos</span> 
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/nibuyoficial" target="_blank" title="Instagram" className="text-white hover:opacity-80"><i className="fa-brands fa-instagram text-[21px]"></i></a>
              <a href="https://www.facebook.com/profile.php?id=61583962855568" target="_blank" title="Facebook" className="text-white hover:opacity-80"><i className="fa-brands fa-facebook text-[19px]"></i></a>
              <a href="https://pin.it/hFv1x89A5" target="_blank" title="Pinterest" className="text-white hover:opacity-80"><i className="fa-brands fa-pinterest text-[19px]"></i></a>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={() => setShowNotifications(!showNotifications)} className="flex items-center gap-1">
            <div className="relative">
              <Bell size={18} />
              {notifCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#ff5722] font-bold">{notifCount}</span>}
            </div>
            Notificações
          </button>
          <a href="https://nibuy-central-ajuda.vercel.app/" className="flex items-center gap-1"><HelpCircle size={18} /> Central de Ajuda</a>
          <span className="text-white font-normal">|</span>
          <div className="flex gap-2 font-bold text-white">
            <button onClick={() => { setShowLoginModal(true); setIsLoginView(false); }} className="hover:text-gray-200">Cadastrar</button>
            <span>|</span>
            <button onClick={() => { setShowLoginModal(true); setIsLoginView(true); }} className="hover:text-gray-200">Login</button>
          </div>
        </div>
      </div>

      {/* Main Header - Com o Login ao lado da busca */}
      <div className="max-w-[1200px] mx-auto py-4 px-4 flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.location.href = '/'}>
          <img src="/logo-nibuy.png" alt="Logo" className="h-14 w-auto" />
          <span className="text-3xl font-black hidden md:block">𝙉𝙞𝙗𝙪𝙮</span>
        </div>
        
        <div className="flex-1 flex bg-white rounded-sm p-1 items-center shadow-sm">
          <input type="text" placeholder="Buscar na Nibuy..." className="flex-1 px-4 py-2 text-gray-800 outline-none" />
          <button className="bg-[#ff5722] px-6 py-2 rounded-sm hover:brightness-110"><Search size={20} /></button>
        </div>

        {/* ÁREA DE PERFIL DINÂMICA */}
        <div className="relative mr-4 lg:mr-8"> {/* Adicionei margem aqui */}
            {!user ? (
              <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 hover:opacity-80 transition-all">
              <User size={37} className="border-2 border-white rounded-full p-0.5" />
              <div className="text-left hidden lg:block">
                <p className="text-[12px] leading-tight">Faça Login ou</p>
                <p className="text-[15px] font-bold leading-tight">Crie sua conta</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img src={user.photo} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
              <div className="hidden lg:block text-left">
                <p className="text-[10px] leading-tight opacity-90">Bem-vindo,</p>
                <p className="text-xs font-bold leading-tight truncate max-w-[80px]">{user.name.split(' ')[0]}</p>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-lg shadow-xl text-gray-800 border border-gray-100 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold transition-colors">
                    <LogOut size={16} /> Sair da conta
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 z-10 relative text-gray-800">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold">✕</button>
            <h2 className="text-2xl font-black text-[#ff5722] mb-6 text-center">{isLoginView ? 'Login' : 'Criar Conta'}</h2>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-xs font-bold mb-4 text-center border border-red-100">{error}</div>}
            
            <div className="space-y-4">
              {!isLoginView && <input type="text" placeholder="Nome" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />}
              <input type="email" placeholder="E-mail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />
              <input type="password" placeholder="Senha" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />
              <button onClick={handleAuthAction} className="w-full bg-[#ff5722] text-white font-bold py-3 rounded-lg hover:brightness-110 shadow-lg">
                {isLoginView ? 'Entrar' : 'Cadastrar agora'}
              </button>
            </div>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative px-2 bg-white text-gray-400 text-[10px] uppercase font-bold">Ou entre com</span>
            </div>

            <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-all font-bold text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Continuar com Google
            </button>
            
            <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-6 text-[#ff5722] text-sm font-bold hover:underline">
               {isLoginView ? 'Ainda não tem conta? Clique aqui' : 'Já tem uma conta? Faça Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;