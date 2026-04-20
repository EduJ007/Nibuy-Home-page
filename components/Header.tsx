import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, User, LogOut, Settings, Check, X, Home, MessageCircle, Info, ShoppingBag, Heart, Trash2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, onSnapshot, query, deleteDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* --- ESTADOS DO COMPONENTE --- */
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addPassLoading, setAddPassLoading] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [savedProducts, setSavedProducts] = useState<any[]>([]); // ESTADO PARA SALVOS

  const [notifications] = useState([
    { id: 1, text: "Estamos Ajustando algumas coisas mas em caso de feedback só entrar em contato 👍" },
    { id: 2, text: "Façam Login para acessar tudo que a Nibuy tem a oferecer" },
    { id: 3, text: "No futuro vai ter produto de todo tipo de site, só aguardem" }
  ]);

  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  /* --- LÓGICA DE PRODUTOS SALVOS EM TEMPO REAL --- */
  useEffect(() => {
    let unsubscribeSaved: any;
    if (user && auth.currentUser) {
      const q = query(collection(db, "users", auth.currentUser.uid, "savedProducts"));
      unsubscribeSaved = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavedProducts(items);
      });
    } else {
      setSavedProducts([]);
    }
    return () => unsubscribeSaved && unsubscribeSaved();
  }, [user]);

  const removeSavedItem = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "savedProducts", productId));
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  };

  /* --- LÓGICA DE BUSCA --- */
  const handleSearch = () => {
    const term = searchTerm.trim();
    navigate(`/Lista-produtos?search=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchBar = params.get('search');
    if (searchBar) {
      setSearchTerm(searchBar);
    }
  }, [window.location.search]);

  const handleResetPassword = async () => {
    if (!emailInput) {
      setError("Digite seu e-mail para recuperar a senha.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, emailInput.trim());
      setError("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      setError("Erro ao enviar. Verifique o e-mail digitado.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    if (!editName.trim()) {
      setError("O nome não pode ficar vazio.");
      return;
    }
    try {
      setUpdateLoading(true);
      const userRef = doc(db, "users", auth.currentUser!.uid);
      await updateDoc(userRef, {
        name: editName.trim(),
        photo: editPhoto.trim()
      });
      setUser({ ...user, name: editName.trim(), photo: editPhoto.trim() });
      setShowProfileModal(false);
    } catch (error) {
      setError("Erro ao atualizar perfil.");
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({ name: data.name || '', email: firebaseUser.email || '', photo: data.photo || '' });
        } else {
          setUser({ name: firebaseUser.displayName || '', email: firebaseUser.email || '', photo: firebaseUser.photoURL || '' });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }
      setShowLoginModal(false);
    } catch (err: any) {
      setError("Erro ao entrar com Google");
    }
  };

  const handleAuthAction = async () => {
    setError("");
    if (!emailInput.trim() || !passwordInput.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput.trim());
      } else {
        if (!nameInput.trim()) { setError("Digite seu nome."); return; }
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput.trim());
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: nameInput.trim(),
          email: userCredential.user.email,
          photo: "",
          createdAt: new Date().toISOString(),
        });
      }
      setShowLoginModal(false);
      setEmailInput("");
      setPasswordInput("");
    } catch (err: any) {
      setError("Erro na autenticação. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowUserMenu(false);
  };

  const handleAddPassword = async () => {
    if (!auth.currentUser) return;
    try {
      setAddPassLoading(true);
      await signInWithPopup(auth, googleProvider);
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, newPassword);
      await linkWithCredential(auth.currentUser, credential);
      setShowAddPasswordModal(false);
      alert("Senha adicionada com sucesso! 🎉");
    } catch (err: any) {
      setError("Erro ao adicionar senha.");
    } finally {
      setAddPassLoading(false);
    }
  };

 const getDynamicHelpLink = () => {
  const path = decodeURIComponent(location.pathname);
  if (path === '/Central-de-ajuda') return { label: 'Sobre Nós', path: '/Sobre-nós', icon: <Info size={24} /> };
  if (path === '/Sobre-nós') return { label: 'Contato', path: '/Contato', icon: <MessageCircle size={24} /> };
  if (path === '/Contato') return { label: 'Ajuda', path: '/Central-de-ajuda', icon: <HelpCircle size={24} /> };
  return { label: 'Ajuda', path: '/Central-de-ajuda', icon: <HelpCircle size={24} /> };
};

const helpLink = getDynamicHelpLink();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#ff5722] shadow-md text-white">
        <div className="hidden md:flex max-w-[1200px] mx-auto py-1.5 justify-between items-center text-xs px-4">
          <div className="flex gap-4 items-center">
            <Link to="/Contato" className="hover:text-gray-200 font-medium">Entrar em Contato</Link>
            <span>|</span>
            <Link to="/Sobre-nós" className="hover:text-gray-200 font-medium">Sobre Nós</Link>
            <span>|</span>
            <div className="flex items-center gap-4 ml-1">
              <span className="font-medium">Siga-nos</span>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com/nibuyoficial" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram text-[22px]"></i></a>
                <a href="https://www.facebook.com/profile.php?id=61583962855568" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook text-[19px]"></i></a>
                <a href="https://pin.it/hFv1x89A5" target="_blank" rel="noreferrer"><i className="fa-brands fa-pinterest text-[19px]"></i></a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative flex items-center gap-1 font-normal cursor-pointer pr-2" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => setShowNotifications(false)}>
              <div className="relative">
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-[#ff5722] text-[10px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full font-bold border border-[#ff5722]">
                    {notifications.length}
                  </span>
                )}
              </div>
              <span>Notificações</span>
              {showNotifications && (
                <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-xl shadow-xl border z-50 overflow-hidden text-gray-800">
                  <div className="px-5 py-4 bg-orange-500 text-white font-bold text-sm">Notificações</div>
                  <div className="max-h-80 overflow-y-auto divide-y">
                    {notifications.map((n) => (
                      <div key={n.id} className="px-5 py-4 hover:bg-orange-50 transition text-sm">{n.text}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/Central-de-ajuda" className="flex items-center gap-1 font-medium hover:text-gray-200">
              <HelpCircle size={18} /> <span>Central de Ajuda</span>
            </Link>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto py-4 px-4 flex items-center gap-3 md:gap-5 ">
          <Link to="/" className="hidden md:flex items-center gap-3 shrink-0">
            <img src="/logo-nibuy.png" alt="Logo" className="h-14 w-auto shadow-[0_0_6px_rgba(0,0,0,0.25)]" />
            <span className="text-3xl font-black">𝙉𝙞𝙗𝙪𝙮</span>
          </Link>
          
          <div className="flex-1 flex bg-white rounded-sm p-1 items-center shadow-sm">
            <input 
              type="text" 
              placeholder="Buscar na Nibuy..." 
              className="flex-1 px-4 py-2 text-gray-800 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
            />
            <button onClick={handleSearch} className="bg-[#ff5722] px-6 py-2 rounded-sm hover:brightness-110">
              <Search size={20} />
            </button>
          </div>

          <div className="relative hidden md:block">
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
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-300 flex items-center justify-center">
                  <img src={user.photo || "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"} className="w-full h-full object-cover" alt="User" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[12px] opacity-90">Olá, {user.name.split(' ')[0]}</p>
                  <p className="text-[14px] font-bold uppercase tracking-tighter">Minha Conta</p>
                </div>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl text-gray-800 border border-gray-100 overflow-hidden z-[60]">
                    <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                      <p className="font-bold text-[15px] truncate text-[#ff5722]">{user.name}</p>
                      <button onClick={() => setShowUserMenu(false)} className="text-gray-400"><X size={18}/></button>
                    </div>
                    
                    {/* SEÇÃO MEUS SALVOS (MODAL INTERNO) */}
                    <div className="p-2 border-b bg-orange-50/50">
                      <p className="px-2 py-1 text-[10px] font-black uppercase text-orange-600 flex items-center gap-1">
                        <Heart size={12} fill="currentColor"/> Meus Salvos ({savedProducts.length})
                      </p>
                      <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                        {savedProducts.length > 0 ? (
                          savedProducts.map((p) => (
                            <div 
                              key={p.id} 
                              onClick={() => { navigate(`/produto/${p.externalId || p.id}`); setShowUserMenu(false); }}
                              className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-all group cursor-pointer"
                            >
                              <img src={p.img} className="w-10 h-10 object-cover rounded-md border bg-white" alt="" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold truncate leading-tight">{p.name}</p>
                                <p className="text-[12px] font-black text-[#ff5722]">{p.price}</p>
                              </div>
                              <button onClick={(e) => removeSavedItem(e, p.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all">
                                <Trash2 size={14}/>
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-center py-4 text-gray-400 font-medium">Nenhum produto salvo ainda.</p>
                        )}
                      </div>
                      {savedProducts.length > 0 && (
                        <button onClick={() => { navigate('/salvos'); setShowUserMenu(false); }} className="w-full text-center py-2 text-[10px] font-bold text-orange-600 hover:underline">Ver todos os salvos</button>
                      )}
                    </div>

                    <button onClick={() => { setEditName(user.name); setEditPhoto(user.photo); setShowProfileModal(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center gap-2 font-bold"><Settings size={16} /> Editar Perfil</button>
                    <button onClick={() => setShowAddPasswordModal(true)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2 font-bold">🔐 Adicionar Senha</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold border-t"><LogOut size={16} /> Sair</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- BARRA INFERIOR MOBILE --- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-[100] flex justify-around items-center py-2 px-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center gap-0.5 ${location.pathname === '/' ? 'text-[#ff5722]' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-[12px] font-bold">Início</span>
        </Link>

        <button 
          onClick={() => setShowNotifications(!showNotifications)} 
          className={`flex flex-col items-center gap-0.5 ${showNotifications ? 'text-[#ff5722]' : 'text-gray-500'} relative`}
        >
          <Bell size={24} />
          <span className="text-[12px] font-bold">Avisos</span>
          {notifications.length > 0 && <span className="absolute top-0 right-3 bg-[#ff5722] text-white text-[9px] h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full font-bold border border-white">{notifications.length}</span>}
        </button>

        <Link to={helpLink.path} className={`flex flex-col items-center gap-0.5 ${location.pathname === helpLink.path ? 'text-[#ff5722]' : 'text-gray-600'}`}>
          <div className="relative">{helpLink.icon}</div>
          <span className="text-[12px] font-bold">{helpLink.label}</span>
        </Link>

        <button 
          onClick={() => user ? setShowUserMenu(!showUserMenu) : setShowLoginModal(true)} 
          className={`flex flex-col items-center gap-0.5 ${user ? 'text-[#ff5722]' : 'text-gray-500'}`}
        >
          {user ? (
            <div className="w-10 h-10 rounded-full border border-[#ff5722] overflow-hidden">
              <img src={user.photo || "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"} className="w-full h-full object-cover" alt="User" />
            </div>
          ) : (
            <User size={24} />
          )}
          <span className="text-[12px] font-bold">{user ? 'Eu' : 'Entre'}</span>
        </button>
      </nav>

      {/* MENU SUSPENSO MOBILE COM SALVOS */}
      {showUserMenu && user && (
        <div className="md:hidden fixed inset-0 z-[110] flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUserMenu(false)}></div>
          <div className="relative w-full bg-white rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4 p-6 border-b">
               <img src={user.photo || "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"} className="w-16 h-16 rounded-full border-2 border-[#ff5722] object-cover" />
               <div>
                 <p className="font-black text-lg text-gray-800 uppercase italic">Olá, {user.name.split(' ')[0]}</p>
                 <p className="text-xs text-gray-500">{user.email}</p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Amostra de Salvos no Mobile */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                     <Heart size={14} fill="#ff5722" className="text-[#ff5722]"/> Meus Itens Salvos
                   </h3>
                   <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{savedProducts.length}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {savedProducts.length > 0 ? (
                    savedProducts.map(p => (
                      <div key={p.id} onClick={() => { navigate(`/produto/${p.externalId || p.id}`); setShowUserMenu(false); }} className="min-w-[100px] bg-white p-2 rounded-xl border shadow-sm shrink-0">
                        <img src={p.img} className="w-full h-16 object-contain mb-1" />
                        <p className="text-[10px] font-black text-[#ff5722]">{p.price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 py-4 w-full text-center">Lista vazia.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-gray-800">
                <button onClick={() => { setEditName(user.name); setEditPhoto(user.photo); setShowProfileModal(true); setShowUserMenu(false); }} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl font-bold"><Settings size={18}/> Editar Perfil</button>
                <button onClick={() => { navigate('/salvos'); setShowUserMenu(false); }} className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl font-bold text-[#ff5722]"><ShoppingBag size={18}/> Ver Página de Salvos</button>
                <button onClick={handleLogout} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600 font-bold"><LogOut size={18}/> Sair da Conta</button>
              </div>
            </div>
            <button onClick={() => setShowUserMenu(false)} className="w-full py-4 text-gray-400 font-bold border-t">Fechar</button>
          </div>
        </div>
      )}

      {/* MODAIS ORIGINAIS (PERFIL E LOGIN) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 text-gray-800">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowProfileModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 relative">
            <div className="bg-[#ff5722] p-6 text-white flex justify-between items-center uppercase italic font-black text-xl">Editar Perfil <button onClick={() => setShowProfileModal(false)}><X size={30} /></button></div>
            <div className="p-8 space-y-5">
              <img src={editPhoto || "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"} className="w-28 h-28 mx-auto rounded-full border-4 border-orange-100 object-cover shadow-xl" alt="Preview" />
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome" className="w-full border-2 p-3 rounded-xl font-bold outline-none focus:border-[#ff5722]" />
              <input type="text" value={editPhoto} onChange={(e) => setEditPhoto(e.target.value)} placeholder="URL da foto" className="w-full border-2 p-3 rounded-xl text-xs outline-none focus:border-[#ff5722]" />
              <button onClick={handleUpdateProfile} disabled={updateLoading} className="w-full bg-[#ff5722] text-white font-black py-4 rounded-xl shadow-lg uppercase">{updateLoading ? 'Salvando...' : 'Salvar Alterações'}</button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-gray-800">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 z-10 relative">
            <h2 className="text-2xl font-black text-[#ff5722] mb-6 text-center uppercase italic">{isLoginView ? 'Login' : 'Cadastro'}</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-xs font-bold mb-4 text-center border border-red-100">{error}</div>}
            <div className="space-y-4">
              {!isLoginView && <input type="text" placeholder="Nome" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />}
              <input type="email" placeholder="E-mail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />
              <input type={showPassword ? "text" : "password"} placeholder="Senha" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />
              <button onClick={handleAuthAction} className="w-full bg-[#ff5722] text-white font-bold py-3 rounded-lg uppercase shadow-md">{isLoginView ? 'Entrar' : 'Cadastrar'}</button>
              <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg font-bold text-sm">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" /> Google
              </button>
              <button onClick={() => setIsLoginView(!isLoginView)} className="w-full text-sm font-bold text-center mt-2">{isLoginView ? 'Criar conta' : 'Já tenho conta'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;