import React from 'react';
import { auth } from '../firebase';

const protectedRedirect = (url: string) => {
  if (auth.currentUser) {
    window.location.href = url;
  } else {
    window.dispatchEvent(new Event('showNibuyWarning'));
  }
};

const QuickLinks: React.FC = () => {
  return (
    <section className="w-[95%] max-w-[1400px] mx-auto mt-16">

      <div className="flex flex-wrap justify-center gap-3">

        {/* 🔥 OFERTAS — PRINCIPAL */}
        <button
          onClick={() => protectedRedirect('https://nibuy-produtos.vercel.app/#produtos')}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-sm"
        >
          Ofertas 🔥
        </button>

        {/* ⭐ RECOMENDADOS */}
        <button
          onClick={() => protectedRedirect('https://nibuy-produtos.vercel.app/?cat=Tecnologia%20&%20Eletrônicos#produtos')}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-sm"
        >
          Recomendados ⭐
        </button>

        {/* 💸 BARATINHOS */}
        <button
          onClick={() => protectedRedirect('https://nibuy-produtos.vercel.app/?cat=Casa%20&%20Decoração#produtos')}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-sm"
        >
          Baratinhos 💸
        </button>

        {/* 🛍️ VER TUDO */}
        <button
          onClick={() => protectedRedirect('https://nibuy-produtos.vercel.app/?cat=Todos#produtos')}
          className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-sm"
        >
          Ver tudo 🛍️
        </button>

      </div>

    </section>
  );
};

export default QuickLinks;