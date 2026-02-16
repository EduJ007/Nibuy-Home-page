import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, User, LogOut, Settings, Camera, Check, X } from 'lucide-react';
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
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const Header: React.FC = () => {
  /* --- ESTADOS DO COMPONENTE --- */
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginWarning, setLoginWarning] = useState(false);
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addPassLoading, setAddPassLoading] = useState(false);


  const [notifications, setNotifications] = useState([
  { id: 1, text: "Promoção nova disponível 🔥", read: false },
  { id: 2, text: "Seu perfil foi atualizado com sucesso", read: false }
]);

  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // Estados para edição de perfil
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  /* --- SCRIPT DA ÁREA DE BUSCA E PROTEÇÃO --- */
  const [searchTerm, setSearchTerm] = useState('');

  // Função que trava o acesso se não estiver logado
  const protectedRedirect = (url: string) => {
    if (user) {
      window.location.href = url;
    } else {
      setError("Ops! Você precisa estar logado para acessar as ofertas.");
      setIsLoginView(true);
      setShowLoginModal(true);
    }
  };

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

  // Função da lupa/enter
 const handleSearch = () => {
  if (!searchTerm.trim()) return;

  if (!user) {
    showLoginWarning(); // ⚠️ aviso bonito
    return;
  }

  window.location.href =
    `https://nibuy-produtos.vercel.app/?search=${encodeURIComponent(searchTerm.trim())}`;
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

    // Atualiza o estado local também
    setUser({
      ...user,
      name: editName.trim(),
      photo: editPhoto.trim()
    });

    setShowProfileModal(false);

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    setError("Erro ao atualizar perfil.");
  } finally {
    setUpdateLoading(false);
  }
};

  /* --- EFEITOS (FIREBASE) --- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser({
            name: data.name || '',
            email: firebaseUser.email || '',
            photo: data.photo || ''
          });
        } else {
          setUser({
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photo: firebaseUser.photoURL || ''
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

     const showLoginWarning = () => {
  setLoginWarning(true);

  setTimeout(() => {
    setLoginWarning(false);
  }, 3000);
};

  /* --- FUNÇÕES DE AUTENTICAÇÃO --- */
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
        createdAt: new Date().toISOString()
      });
    }

    setShowLoginModal(false);

  } catch (err: any) {

    // ⚠️ Caso já exista conta com email/senha
    if (err.code === "auth/account-exists-with-different-credential") {

      const email = err.customData.email;

      const methods = await fetchSignInMethodsForEmail(auth, email);

      setError(
        "Este e-mail já está cadastrado com senha. Entre usando e-mail e senha primeiro."
      );

    } else {
      setError("Erro ao entrar com Google");
    }
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
      // 🔐 LOGIN
      await signInWithEmailAndPassword(
        auth,
        emailInput.trim(),
        passwordInput.trim()
      );

      setShowLoginModal(false);
      setEmailInput("");
      setPasswordInput("");

    } else {
      // 🆕 CADASTRO

      if (!nameInput.trim()) {
        setError("Digite seu nome.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailInput.trim(),
        passwordInput.trim()
      );

      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        name: nameInput.trim(),
        email: newUser.email,
        photo: "",
        createdAt: new Date().toISOString()
      });

      setShowLoginModal(false);
      setIsLoginView(true);
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
    }

  } catch (err: any) {
    console.error("Erro Firebase:", err);

    if (err.code === "auth/account-exists-with-different-credential") {
      setError("Esta conta já foi criada com Google. Use o botão Google.");
    } 
    else if (err.code === "auth/user-not-found") {
      setError("Usuário não encontrado.");
    } 
    else if (err.code === "auth/wrong-password") {
      setError("Senha incorreta.");
    } 
    else if (err.code === "auth/email-already-in-use") {
      setError("Esse e-mail já está cadastrado.");
    } 
    else if (err.code === "auth/invalid-email") {
      setError("E-mail inválido.");
    } 
    else if (err.code === "auth/weak-password") {
      setError("A senha deve ter pelo menos 6 caracteres.");
    } 
    else {
      setError("Erro ao autenticar. Tente novamente.");
    }
  }
};

  
  useEffect(() => {
  const handleOpenLogin = (e: any) => {
    setError(e.detail?.message || "Você precisa estar logado.");
    setIsLoginView(true);
    setShowLoginModal(true);
  };

  window.addEventListener('openNibuyLogin', handleOpenLogin);
  return () => window.removeEventListener('openNibuyLogin', handleOpenLogin);
}, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowUserMenu(false);
    window.location.reload();
  };
  
  const handleAddPassword = async () => {
  if (!auth.currentUser) return;

  if (!newPassword || newPassword.length < 6) {
    setError("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("As senhas não coincidem.");
    return;
  }

  try {
    setAddPassLoading(true);

    // 🔥 Reautentica com Google
    await signInWithPopup(auth, googleProvider);

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email!,
      newPassword
    );

    await linkWithCredential(auth.currentUser, credential);

    setShowAddPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");

    alert("Senha adicionada com sucesso! 🎉");

  } catch (err: any) {
    console.error(err);
    setError("Erro ao adicionar senha.");
  } finally {
    setAddPassLoading(false);
  }
};

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ff5722] shadow-md text-white">
      {/* Top Bar - Preservada 100% igual ao seu original */}
      <div className="hidden md:flex max-w-[1200px] mx-auto py-1.5 justify-between items-center text-xs px-4">
  <div className="flex gap-4 items-center">
          <button
          onClick={() => user
            ? window.location.href = "https://nibuy-contact.vercel.app/"
            : showLoginWarning()
          }
          className="hover:text-gray-200 font-medium"
        >
          Entrar em Contato
        </button>
    <span>|</span>
              <button
              onClick={() => user
                ? window.location.href = "https://sobre-nibuy.vercel.app/"
                : showLoginWarning()
              }
              className="hover:text-gray-200 font-medium"
            >
              Sobre nós
            </button>
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

{/* AVISO DE LOGIN NECESSÁRIO */}
{loginWarning && (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-6 py-4 rounded-xl shadow-2xl border border-orange-100 z-[999]">
    
    <p className="font-black text-[#ff5722] text-sm mb-1">
      ⚠️ Acesso restrito
    </p>

    <p className="text-xs">
      Você precisa estar logado para acessar esta área.
    </p>
  </div>
)}

  <div className="flex gap-4 items-center font-bold">
    {/* AJUSTE DAS NOTIFICAÇÕES */}
    <button 
                              onClick={() => {
                                            if (!user) {
                                              showLoginWarning();
                                              return;
                                            }

                                            const newState = !showNotifications;
                                            setShowNotifications(newState);

                                            // 🔥 Se abriu → marca todas como lidas
                                            if (newState) {
                                              setNotifications(prev =>
                                                prev.map(n => ({ ...n, read: true }))
                                              );
                                              setNotifCount(0);
                                            }
                                          }}
      className="flex items-center gap-1 font-normal relative pr-2"
    >
            {showNotifications && (
          <div className="absolute top-full right-0 mt-3 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

            {/* CABEÇALHO */}
            <div className="bg-[#ff5722] text-white px-4 py-3 font-black flex justify-between items-center">
              <span>Notificações</span>
              <span className="text-xs opacity-80">
                {notifications.filter(n => !n.read).length} novas
              </span>
            </div>

            {/* LISTA */}
            <div className="max-h-80 overflow-y-auto">

              {notifications.length === 0 && (
                <p className="p-6 text-center text-gray-400 text-sm">
                  Nenhuma notificação
                </p>
              )}

              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b text-sm transition
                    ${n.read ? "bg-white text-gray-500" : "bg-orange-50 font-bold"}
                  `}
                >
                  {n.text}
                </div>
              ))}

            </div>

          </div>
        )}
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
    
              <button
            onClick={() => user
              ? window.location.href = "https://nibuy-central-ajuda.vercel.app/"
              : showLoginWarning()
            }
            className="flex items-center gap-1 font-medium"
          >
            <HelpCircle size={18} /> Central de ajuda
          </button>

    
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
                  <input 
                    type="text" 
                    placeholder="Buscar na Nibuy..." 
                    className="flex-1 px-4 py-2 text-gray-800 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
                  />
                  <button 
                    onClick={handleSearch}
                    className="bg-[#ff5722] px-6 py-2 rounded-sm hover:brightness-110"
                  >
                    <Search size={20} />
                  </button>
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
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-300 flex items-center justify-center shadow-sm">
                  {user?.photo && user.photo.trim() !== "" ? (
                    <img 
                      src={user.photo} 
                      className="w-full h-full object-cover" 
                      alt="User" 
                      onError={(e) => {
                        // Se a imagem falhar, ele troca o src por um ícone de usuário padrão do Google
                        (e.currentTarget as HTMLImageElement).src = "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png";
                      }}
                    />
                  ) : (
                    /* Foto padrão caso o campo no banco esteja vazio */
                    <img 
                      src="https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png" 
                      className="w-full h-full object-cover opacity-80" 
                      alt="Padrão" 
                    />
                  )}
                </div>
              <div className="hidden lg:block text-left">
                <p className="text-[12px] opacity-90">Olá, {user.name.split(' ')[0]}</p>
                <p className="text-[14px] font-bold uppercase tracking-tighter">Minha Conta</p>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-52 bg-white rounded-xl shadow-2xl text-gray-800 border border-gray-100 overflow-hidden z-[60]">
                  <div className="p-3 bg-gray-50 border-b flex items-center gap-2">
                   <img 
                              src={
                                user.photo && user.photo.trim() !== ""
                                  ? user.photo
                                  : "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
                              }
                              className="w-12 h-12 rounded-full"
                            />
                    <p className="font-bold text-[15px] truncate text-[#ff5722]">{user.name}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditName(user?.name || "");
                      setEditPhoto(user?.photo || "");
                      setShowProfileModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center gap-2 font-bold"
                  >
                    <Settings size={16} className="text-gray-400" /> Editar Perfil
                  </button>
                  <button
                        onClick={() => setShowAddPasswordModal(true)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2 font-bold"
                      >
                        🔐 Adicionar senha
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
                      key={editPhoto}
                      src={
                        editPhoto && editPhoto.trim() !== ""
                          ? editPhoto
                          : "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
                      }
                      alt="Preview"
                      className="w-28 h-28 rounded-full border-4 border-orange-100 object-cover shadow-xl"
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
              {/* MODAL ADICIONAR SENHA */}
{showAddPasswordModal && (
  <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
    
    {/* Fundo escuro */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md"
      onClick={() => setShowAddPasswordModal(false)}
    ></div>

    {/* Caixa */}
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 relative text-gray-800">
      
      {/* Topo */}
      <div className="bg-[#ff5722] p-6 text-white flex justify-between items-center">
        <h3 className="font-black uppercase italic tracking-tighter text-xl">
          Criar senha
        </h3>
        <button onClick={() => setShowAddPasswordModal(false)}>
          <X size={30} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-8 space-y-5">

        <p className="text-sm text-gray-600 text-center">
          Sua conta foi criada com Google.<br />
          Crie uma senha para poder entrar também com e-mail e senha.
        </p>

        <input
          type="password"
          placeholder="Nova senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold focus:border-[#ff5722] outline-none"
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold focus:border-[#ff5722] outline-none"
        />

        <button
          onClick={handleAddPassword}
          disabled={addPassLoading}
          className="w-full bg-[#ff5722] text-white font-black py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          {addPassLoading ? "Salvando..." : "Adicionar senha"}
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
                {!isLoginView && (
                  <input type="text" placeholder="Nome" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />
                )}
                
                <input type="email" placeholder="E-mail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full border p-3 rounded-lg outline-none focus:border-[#ff5722]" />
                
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Senha" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                    className="w-full border p-3 rounded-lg outline-none pr-10 focus:border-[#ff5722]" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff5722] z-10"
                  >
                    {showPassword ? <X size={18} /> : <Search size={18} className="rotate-45" />}
                  </button>
                </div>

                {isLoginView && (
                  <div className="flex justify-center">
                    <button 
                      onClick={handleResetPassword}
                      className="text-[13px] font-bold text-[black] hover:text-[#ff5722]"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={handleAuthAction} 
                  className="w-full bg-[#ff5722] text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-all uppercase tracking-widest text-sm shadow-md"
                >
                  {isLoginView ? 'Entrar' : 'Cadastrar'}
                </button>
              </div>

            <button onClick={handleGoogleLogin} className="w-full mt-4 flex items-center justify-center gap-3 border p-3 rounded-lg font-bold text-sm hover:scale-105">


              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" /> Google
            </button>


            <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-6 text-[black] text-sm font-bold text-center inline-block">
              {isLoginView ? 'Criar conta' : 'Já tenho conta'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;