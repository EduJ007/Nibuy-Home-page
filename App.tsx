import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';

import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import FlashSales from './components/FlashSales';
import DailyDiscover from './components/DailyDiscover';
import Footer from './components/Footer';
import QuickLinks from './components/QuickLinks';
import AuthModal from './components/AuthModal';
import CentralAjuda from './pages/CentralAjuda';
import ProductDetails from './pages/ProductDetails';
import Salvos from './pages/Salvos';
import { productsData } from './products';
import Sobrenos from './pages/Sobrenos';
import Listaprodutos from './pages/Listaprodutos';
import Contato from './pages/Contato';

// Importe suas novas páginas aqui quando elas estiverem prontas:
// import CentralAjuda from './pages/CentralAjuda';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  // 🔐 Verifica login do Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
    return () => unsubscribe();
  }, []);

  // 📢 Escuta eventos da StartScreen
  useEffect(() => {
    const loginListener = () => setAuthMode("login");
    const signupListener = () => setAuthMode("signup");

    window.addEventListener("showLogin", loginListener);
    window.addEventListener("showSignup", signupListener);

    return () => {
      window.removeEventListener("showLogin", loginListener);
      window.removeEventListener("showSignup", signupListener);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return productsData;
    return productsData.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // ⏳ Tela de carregamento
  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h1 className="text-4xl font-black text-[#ff5722]">Nibuy</h1>
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ff5722] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header onSearch={setSearch} />

      <main className="flex-grow"> {/* Tire o margin fixo daqui e deixe nos componentes ou nas rotas */}
        <Routes>
          <Route path="/" element={
            <div className="mt-[140px] md:mt-[160px] pb-14">
              {!search && <Hero />}
              <QuickLinks />
              <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                {!search && <CategoryGrid />}
              </div>
              <FlashSales products={filteredProducts} />
              <div className="w-[98%] md:w-[98%] max-w-[1650px] mx-auto px-4 lg:px-0">
                <DailyDiscover products={filteredProducts} />
              </div>
            </div>
          } />

          <Route path="/Central-de-ajuda" element={<CentralAjuda />} />

        <Route path="/Sobre-nós" element={<Sobrenos />} />
         
         <Route path="/Lista-produtos" element={<Listaprodutos />} />

         <Route path="/Contato" element={<Contato />} />

         <Route path="/produto/:externalId" element={<ProductDetails />} />
         
         <Route path="/salvos" element={<Salvos />} />

        </Routes>
      </main>

      <Footer />
    </div>
  </Router>
  );
};

export default App;