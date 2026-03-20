import React, { useState, useMemo, useEffect } from 'react';
import { auth } from './firebase';

import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import FlashSales from './components/FlashSales';
import DailyDiscover from './components/DailyDiscover';
import Footer from './components/Footer';
import QuickLinks from './components/QuickLinks';
import AuthModal from './components/AuthModal';

import { productsData } from './products';

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

        <h1 className="text-4xl font-black text-[#ff5722]">
          Nibuy
        </h1>

        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ff5722] rounded-full animate-spin"></div>

      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">

      <Header onSearch={setSearch} />

      <main className="mt-[140px] md:mt-[160px] pb-14">

        {!search && <Hero />}

        <QuickLinks />

        <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
          {!search && <CategoryGrid />}
        </div>

        <FlashSales products={filteredProducts} />

        <div className="w-[98%] md:w-[98%] max-w-[1650px] mx-auto px-4 lg:px-0">
          <DailyDiscover products={filteredProducts} />
        </div>

      </main>

      <Footer />

    </div>
  );
};

export default App;