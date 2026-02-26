import React, { useState } from 'react';
import { auth } from '../firebase';

const categories = [
  { id: 1, name: 'Moda & Beleza', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Tecnologia & Eletrônicos', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Casa & Decoração', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200&auto=format&fit=crop' },
  { id: 4, name: 'Games & Hobby', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop' },
  { id: 5, name: 'Bebês & Infantil', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=200&auto=format&fit=crop' },
  { id: 6, name: 'Automotivo', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=200&auto=format&fit=crop' },
  { id: 7, name: 'Esporte & Lazer', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop' },
  { id: 8, name: 'Pets', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop' },
  { id: 9, name: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop' },
  { id: 10, name: 'Móveis', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=200&auto=format&fit=crop' },
  { id: 11, name: 'Papelaria & Escritório', img: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=200&auto=format&fit=crop' },
  { id: 12, name: 'Ferramentas & Construção', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=200&auto=format&fit=crop' },
  { id: 13, name: 'Segurança & Monitoramento', img: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=200&auto=format&fit=crop' },
  { id: 14, name: 'Relógios & Acessórios', img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=200&auto=format&fit=crop' },
  { id: 15, name: 'Joias & Bijuterias', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop' },
  { id: 16, name: 'Livros & Educação', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop' },
  { id: 17, name: 'Viagem & Malas', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format&fit=crop' }
];

const protectedRedirect = (url: string) => {
  if (auth.currentUser) window.location.href = url;
  else window.dispatchEvent(new Event('showNibuyWarning'));
};

const ITEMS_PER_PAGE = 9; // 3 linhas × 3 colunas

const CategoryGrid: React.FC = () => {
  const [page, setPage] = useState(0);

  const start = page * ITEMS_PER_PAGE;
  const visible = categories.slice(start, start + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <section className="bg-white mt-16 w-[95%] max-w-[1600px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">

      {/* TÍTULO */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-[#ff5722] text-xl font-black uppercase italic tracking-tighter">
          Categorias
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">

  {visible.map(cat => (
    <button
      key={cat.id}
      onClick={() =>
        protectedRedirect(
          `https://nibuy-produtos.vercel.app/?cat=${encodeURIComponent(cat.name)}`
        )
      }
      className="
        flex flex-col sm:flex-row items-center gap-2 sm:gap-3
        bg-gray-200 hover:bg-gray-100
        px-3 py-3 rounded-xl transition-all shadow-sm
        text-center sm:text-left
      "
    >
      {/* IMAGEM */}
      <div className="
        w-full h-24 sm:w-14 sm:h-14
        rounded-xl overflow-hidden flex-shrink-0
      ">
        <img
          src={cat.img}
          alt={cat.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* TEXTO */}
      <span className="
        text-[13px] sm:text-sm font-extrabold text-gray-900
        leading-tight
      ">
        {cat.name}
      </span>
    </button>
  ))}

</div>

      {/* SETA ESQUERDA */}
      {page > 0 && (
        <button
          onClick={prevPage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-[black]"
        >
          ❮
        </button>
      )}

      {/* SETA DIREITA */}
      {page < totalPages - 1 && (
        <button
          onClick={nextPage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
         ❯
        </button>
      )}

    </section>
  );
};

export default CategoryGrid;