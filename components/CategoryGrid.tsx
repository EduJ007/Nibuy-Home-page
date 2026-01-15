import React from 'react';

const categories = [
  // PRIMEIRA LINHA
  { id: 1, name: 'Eletrodomésticos', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: 'Moda', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Beleza', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop' },
  { id: 4, name: 'Casa', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200&auto=format&fit=crop' },
  { id: 5, name: 'Gamer', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop' },
  { id: 6, name: 'Pets', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop' },
  { id: 7, name: 'Esporte', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop' },
  { id: 8, name: 'Brinquedos', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=200&auto=format&fit=crop' },
  { id: 11, name: 'Celulares', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop' },
  { id: 10, name: 'Relógios', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
  
  // SEGUNDA LINHA
  { id: 9, name: 'Tecnologia', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop' },
  { id: 12, name: 'Calçados', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop' },
  { id: 13, name: 'Saúde', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200&auto=format&fit=crop' },
  { id: 14, name: 'Cozinha', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200&auto=format&fit=crop' },
  { id: 15, name: 'Papelaria', img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=200&auto=format&fit=crop' }, 
  { id: 16, name: 'Acessórios', img: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=200&auto=format&fit=crop' }, 
  { id: 17, name: 'Joias', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200&auto=format&fit=crop' },
  { id: 18, name: 'Bebês', img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=200&auto=format&fit=crop' },
  { id: 19, name: 'Ferramentas', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=200&auto=format&fit=crop' }, 
  { id: 20, name: 'Livros', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=200&auto=format&fit=crop' },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="bg-white mt-4 rounded-sm shadow-sm overflow-hidden">
      {/* HEADER AJUSTADO - ABAIXADO SÓ UM POUCO */}
      <div className="flex items-start px-4 pt-3 pb-3 border-b border-gray-100">
        <h2 className="text-[#ee4d2d] text-base md:text-lg font-bold uppercase tracking-tight leading-none">
          Categorias
        </h2>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 border-l border-t border-gray-100">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="border-r border-b border-gray-100 p-2 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border border-gray-100 group-hover:scale-105 transition-transform">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] md:text-xs text-center text-gray-700 font-medium line-clamp-2">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;