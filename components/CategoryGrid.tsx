import React from 'react';
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

  // 🔥 NOVAS
  { id: 9, name: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop' },
  { id: 10, name: 'Móveis', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=200&auto=format&fit=crop' },
  { id: 11, name: 'Iluminação', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200&auto=format&fit=crop' },
  { id: 12, name: 'Papelaria & Escritório', img: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=200&auto=format&fit=crop' },
  { id: 13, name: 'Ferramentas & Construção', img: 'https://images.unsplash.com/photo-1581091215367-59ab6b4d5b06?q=80&w=200&auto=format&fit=crop' },
  { id: 14, name: 'Segurança & Monitoramento', img: 'https://images.unsplash.com/photo-1558002038-1055e2e28ed1?q=80&w=200&auto=format&fit=crop' },
  { id: 15, name: 'Relógios & Acessórios', img: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=200&auto=format&fit=crop' },
  { id: 16, name: 'Joias & Bijuterias', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop' },
  { id: 17, name: 'Livros & Educação', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=200&auto=format&fit=crop' },
  { id: 18, name: 'Viagem & Malas', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=200&auto=format&fit=crop' }
];

const protectedRedirect = (url: string) => {
  if (auth.currentUser) {
    window.location.href = url;
  } else {
    window.dispatchEvent(new Event('showNibuyWarning'));
  }
};

const CategoryGrid: React.FC = () => {
  return (
    <section className="bg-white mt-20 md:mt-24 w-[98%] max-w-[1400px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">

      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-[#ff5722] text-xl font-black uppercase italic tracking-tighter">
          Categorias
        </h2>
      </div>

     <div className="grid grid-cols-3 md:grid-cols-4 border-l border-t border-gray-200">

     {categories.slice(0, 12).map((cat, index) => (
  <button
    key={cat.id}
    onClick={() =>
      protectedRedirect(
        `https://nibuy-produtos.vercel.app/?cat=${encodeURIComponent(cat.name)}`
      )
    }
    className={`
      border border-gray-200 p-5 flex flex-col items-center
      hover:bg-gray-50/50 transition-all cursor-pointer group
      ${index >= 9 ? "hidden md:flex" : ""}
    `}
  >

            {/* IMAGEM */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-100 group-hover:border-[#ff5722] transition-all shadow-sm">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* TEXTO */}
            <span className="text-[11px] md:text-[13px] text-gray-900 font-extrabold uppercase tracking-tight leading-tight line-clamp-2 text-center">
              {cat.name}
            </span>

          </button>
        ))}

      </div>

      {/* 🔥 VER MAIS PROTEGIDO */}
      <div className="flex justify-end p-4 border-t border-gray-50 bg-gray-50/10">
        <button
          onClick={() =>
            protectedRedirect('https://nibuy-produtos.vercel.app/?cat=Todos')
          }
          className="text-[#ff5722] hover:text-[#e64a19] font-black text-[13px] uppercase tracking-widest transition-all flex items-center gap-2"
        >
          Ver mais Categorias
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default CategoryGrid;
