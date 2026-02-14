import React from 'react';

const categories = [
  { id: 1, name: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' , href: 'https://nibuy-produtos.vercel.app/' },
  { id: 2, name: 'Moda', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 3, name: 'Beleza', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop', href: 'https://nibuy-produtos.vercel.app/' },
  { id: 4, name: 'Casa', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 5, name: 'Gamer', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 6, name: 'Pets', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 7, name: 'Esporte', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 8, name: 'Brinquedos', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 11, name: 'Celulares', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 10, name: 'Relógios', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 9, name: 'Tecnologia', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 12, name: 'Calçados', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },{ id: 13, name: 'Saúde', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 14, name: 'Cozinha', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
];

const CategoryGrid: React.FC = () => {
  return (
    /* Aumentei o mt (espaço para baixo) como você pediu anteriormente */
    <section className="bg-white mt-20 md:mt-24 w-[98%] max-w-[1400px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-[#ff5722] text-xl font-black uppercase italic tracking-tighter">
          Categorias
        </h2>
      </div>

      {/* MOBILE: Carrossel horizontal (overflow-x-auto)
          DESKTOP: Grid estático de 10 colunas
      */}
      <div className="flex overflow-x-auto md:grid md:grid-cols-7 scrollbar-hide border-l border-t border-gray-200">
       {categories.map((cat) => (
              <a 
                key={cat.id} 
                href={`https://nibuy-produtos.vercel.app/?cat=${encodeURIComponent(cat.name)}`} 
                className="border border-gray-200 p-5 flex flex-col items-center hover:bg-gray-50/50 transition-all cursor-pointer group shrink-0 md:shrink"
              >
            {/* Imagem maior e com mais destaque */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-100 group-hover:border-[#ff5722] transition-all shadow-sm">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="flex items-center justify-center text-center w-full">
              {/* Texto aumentado (text-xs no mobile, text-sm no desktop) e mais escuro para ler melhor */}
              <span className="text-[11px] md:text-[13px] text-gray-900 font-extrabold uppercase tracking-tight leading-tight line-clamp-2">
                {cat.name}
              </span>
            </div>
          </a>
        ))}
      </div>

          <div className="flex justify-end p-4 border-t border-gray-50 bg-gray-50/10">
        <a href="https://nibuy-produtos.vercel.app/?cat=Todos">
          <button className="text-[#ff5722] hover:text-[#e64a19] font-black text-[13px] uppercase tracking-widest transition-all flex items-center gap-2">
            Ver mais 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </a>
</div>
    </section>
  );
};

export default CategoryGrid;