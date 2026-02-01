import { HeartOff } from 'lucide-react';
import React from 'react';

const categories = [
  // Mantenha sua lista de categorias igual...
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
  { id: 12, name: 'Calçados', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 13, name: 'Saúde', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 14, name: 'Cozinha', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 15, name: 'Papelaria', img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' }, 
  { id: 16, name: 'Acessórios', img: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' }, 
  { id: 17, name: 'Joias', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 18, name: 'Bebês', img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
  { id: 19, name: 'Ferramentas', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' }, 
  { id: 20, name: 'Livros', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=200&auto=format&fit=crop', href:'https://nibuy-produtos.vercel.app/' },
];
const CategoryGrid: React.FC = () => {
  return (
    <section className="bg-white mt-20 w-[98%] max-w-[1400px] mx-auto rounded-2xl shadow-sm border border-gray-300 overflow-hidden relative">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-[#ff5722] text-xl font-black uppercase italic tracking-tighter">
          Categorias
        </h2>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 border-l border-t border-gray-200">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="border-r border-b border-gray-200 p-4 flex flex-col items-center hover:bg-gray-50/50 transition-all cursor-pointer group h-30 md:h-39"
          >
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden mb-3 border border-gray-200 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex items-start justify-center text-center h-auto w-full">
              {/* Ajustado: Leading e padding para a palavra Eletrodomésticos respirar */}
              <span className="text-[10px] md:text-[12px] text-gray-800 font-black uppercase tracking-tighter leading-tight line-clamp-2 break-words">
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end p-4 border-t border-gray-50 bg-gray-50/10">
      <a href="https://nibuy-produtos.vercel.app/">
        <button 
          className="text-blue-600 hover:text-blue-800 font-black text-[13px] uppercase tracking-widest transition-all flex items-center gap-1 group"
        >
          Ver Mais 
          <span className="text-lg transition-transform group-hover:translate-x-1">›</span>
        </button>
        </a>
      </div>
    </section>
  );
};

export default CategoryGrid;