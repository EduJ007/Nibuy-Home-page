import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ShoppingBag, Trash2, ExternalLink, ArrowLeft, Heart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SavedProduct {
  id: string; 
  externalId: string; 
  name: string;
  price: string;
  img: string;
}

const Salvos: React.FC = () => {
  const [products, setProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "savedProducts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedProduct[];
      setProducts(items);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar salvos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const removeProduct = async (e: React.MouseEvent, docId: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "savedProducts", docId));
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#ff5722] border-solid border-gray-200"></div>
          <p className="text-[#ff5722] font-bold animate-pulse">Carregando seus favoritos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f7f7f7]">
        <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-sm">
            <User size={60} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-black uppercase  text-gray-800">Acesso Restrito</h2>
            <p className="text-gray-500 my-4 font-medium">Faça login para salvar e visualizar seus produtos favoritos aqui na Nibuy.</p>
            <button onClick={() => navigate('/')} className="w-full bg-[#ff5722] text-white py-4 rounded-xl font-bold hover:scale-105 transition-all">
                Ir para Login
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-20 pt-32 md:pt-48"> 
      <div className="max-w-[1200px] mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-[#ff5722] transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase text-gray-900 leading-none ">
                Meus <span className="text-[#ff5722]">Salvos</span>
              </h1>
              <p className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                <Heart size={14} className="fill-[#ff5722] text-[#ff5722]" /> {products.length} itens encontrados
              </p>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          /* AQUI AUMENTAMOS O TAMANHO: Diminuímos o número de colunas para os cards crescerem */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col border border-transparent hover:border-orange-200 overflow-hidden"
              >
                <div className="relative aspect-square bg-white overflow-hidden">
                  {/* CORREÇÃO DO LINK: Verifique se o externalId existe, caso contrário usa o ID do documento */}
                  <Link to={`/produto/${product.externalId || product.id}`}>
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  
                  <button 
                    onClick={(e) => removeProduct(e, product.id)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-md transition-all z-10"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <Link to={`/produto/${product.externalId || product.id}`} className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight mb-3 group-hover:text-[#ff5722] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex flex-col mb-4">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Preço na Nibuy</span>
                      <span className="text-3xl font-black text-[#ff5722]">{product.price}</span>
                    </div>
                  </Link>

                  <Link 
                    to={`/produto/${product.externalId || product.id}`}
                    className="flex items-center justify-center gap-3 bg-[#ff5722] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 shadow-lg shadow-orange-100 transition-all active:scale-95"
                  >
                    Ver Detalhes <ExternalLink size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-100">
            <div className="bg-orange-50 p-6 rounded-full mb-6">
                <ShoppingBag size={50} className="text-[#ff5722]" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase ">Nada por aqui, mermão!</h2>
            <p className="text-gray-500 mt-2 mb-8 font-medium">Sua lista está vazia. Bora achar uns achadinhos?</p>
            <Link 
                to="/Lista-produtos" 
                className="bg-[#ff5722] text-white px-10 py-4 rounded-2xl font-black uppercase  shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
            >
              Explorar Ofertas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salvos;