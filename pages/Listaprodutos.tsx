import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from '../components/ListaprodutosComponents/FilterBar'
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ListaprodutosComponents/ProductCard'
import PageLoader from '../components/ListaprodutosComponents/GeminiRecommendation'
import { productsData } from '../products'

// ------------------ FUNÇÕES AUXILIARES ------------------
const parseSales = (sold: string | number) => {
  if (!sold) return 0;
  if (typeof sold === 'number') return sold;
  const cleanSold = sold.toLowerCase().trim()
    .replace('vendidos', '').replace('unidades', '').replace('+', '').replace(/\s/g, '');
  if (cleanSold.includes('m')) return parseFloat(cleanSold.replace('m', '').replace(',', '.')) * 1000000;
  if (cleanSold.includes('k') || cleanSold.includes('mil')) return parseFloat(cleanSold.replace('k', '').replace('mil', '').replace(',', '.')) * 1000;
  return parseInt(cleanSold.replace(/\./g, '').replace(/\D/g, '')) || 0;
};

const parsePrice = (price: string | number | undefined | null) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const cleanPrice = price.toString()
    .replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanPrice) || 0;
};

// --- FUNÇÃO PARA RANDOMIZAR COM SEED BASEADA NA DATA (BRASÍLIA) ---
const shuffleWithSeed = (array: any[]) => {
  // Obter data atual no fuso de Brasília (UTC-3)
  const agora = new Date();
  const brasiliaTime = new Date(agora.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
  
  // Criar semente numérica: AAAAMMDD (ex: 20231027)
  const seed = (brasiliaTime.getFullYear() * 10000) + 
               ((brasiliaTime.getMonth() + 1) * 100) + 
               brasiliaTime.getDate();

  const shuffled = [...array];
  let m = shuffled.length, t, i;
  let s = seed;

  // Algoritmo LCG simples para embaralhar deterministicamente baseado na semente
  while (m) {
    s = (s * 9301 + 49297) % 233280;
    i = Math.floor((s / 233280) * m--);
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
};

// ------------------ COMPONENTE DA PÁGINA ------------------
const Listaprodutos: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeStore, setActiveStore] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState<any>('');
  const [sortBy, setSortBy] = useState('default');
  const [pageLoading, setPageLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const productsPerPage = 24;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(decodeURIComponent(params.get('search') || ''));
    setActiveCategory(decodeURIComponent(params.get('categoria') || 'Todos'));
    setSortBy(params.get('sort') || 'default');
    setActiveStore(params.get('loja') || 'Todas');
    setCurrentPage(parseInt(params.get('page') || '1'));
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    // 1. Aplica a randomização diária apenas se o sortBy for 'default'
    let result = sortBy === 'default' ? shuffleWithSeed(productsData) : [...productsData];

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (activeCategory !== 'Todos') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (activeStore && activeStore !== 'Todas') {
      const storeToPlatform = activeStore.toLowerCase().replace(/\s/g, '');
      result = result.filter(p => (p.platform || '').toLowerCase().replace(/\s/g, '') === storeToPlatform);
    }

    if (maxPrice && parseFloat(maxPrice) > 0) {
      result = result.filter(p => parsePrice(p.price) <= parseFloat(maxPrice));
    }

    if (sortBy === 'deals') {
      result = result.filter(p => {
        const pCurrent = parsePrice(p.price);
        const pOld = parsePrice(p.oldPrice);
        if (!pOld || pOld <= pCurrent) return false;
        return ((pOld - pCurrent) / pOld) >= 0.15;
      });
    }

    if (sortBy === 'recomend') {
      result = result.filter(p => (p.rating || 0) >= 4.5 && parseSales(p.sold) >= 100);
    } else if (sortBy === 'flash') {
      result = result.filter(p => p.isFlashSale === true);
    }

    // 2. Só aplica ordenação se não for o padrão (o padrão já foi randomizado acima)
    if (sortBy !== 'default') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'sales': return parseSales(b.sold) - parseSales(a.sold);
          case 'price_asc': return parsePrice(a.price) - parsePrice(b.price);
          case 'price_desc': return parsePrice(b.price) - parsePrice(a.price);
          default: return 0;
        }
      });
    }

    return result;
  }, [searchTerm, activeCategory, activeStore, sortBy, maxPrice]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, activeCategory, activeStore, sortBy, maxPrice]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const changePage = (page: number) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };
  
  const resetFilters = () => {
    setActiveCategory('Todos');
    setActiveStore('Todas');
    setMaxPrice('');
    setSortBy('default');
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(params.get('page') || '1');
    setCurrentPage(pageFromUrl);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (activeCategory !== 'Todos') params.set('categoria', activeCategory);
    if (activeStore !== 'Todas') params.set('loja', activeStore);
    if (sortBy !== 'default') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    window.history.replaceState({}, '', newRelativePathQuery);
  }, [activeCategory, activeStore, sortBy, searchTerm, currentPage]);

  return (
    <div className="min-h-screen bg-gray-200">
     {isFilterOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[9998] md:hidden backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

      <main className="flex flex-col md:flex-row min-h-screen w-full relative">
      <aside 
  className={`
    fixed inset-y-0 left-0 z-[9999] w-72 bg-white shadow-2xl transition-transform duration-300
    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 md:z-10 md:w-72 lg:w-80 md:h-auto md:border-r md:border-gray-300
  `}
>
  {/* Conteúdo interno original */}
  <div className="h-full md:h-screen overflow-y-auto sticky top-0 p-6 pt-10 md:pt-36 bg-white">
    
    <button 
      onClick={() => setIsFilterOpen(false)} 
      className="md:hidden absolute top-5 right-5 text-gray-500 bg-gray-100 p-3 rounded-full active:bg-orange-100"
    >
      <span className="text-2xl font-bold">✕</span>
    </button>

    <div className="flex items-center gap-3 mb-8">
      <div className="w-2 h-8 bg-[#ff5722] rounded-full"></div>
      <h2 className="text-black font-black text-2xl uppercase tracking-tighter">Filtros</h2>
    </div>

    <FilterBar 
        activeCategory={activeCategory} 
        onSelectCategory={(c) => { setActiveCategory(c); setIsFilterOpen(false); }}
        activeStore={activeStore} 
        onSelectStore={setActiveStore}
        maxPrice={maxPrice} 
        onMaxPriceChange={setMaxPrice}
        sortBy={sortBy} 
        onSortChange={setSortBy} 
    />

    <div className="pb-32">
      <button 
        onClick={resetFilters} 
        className="w-full mt-10 py-4 rounded-xl bg-gray-100 text-gray-500 font-bold hover:bg-[#ff5722] hover:text-white transition-all uppercase text-xs tracking-widest"
      >
        Limpar Tudo
      </button>
    </div>
  </div>
</aside>

        <section className="flex-1 flex flex-col pt-24 md:pt-28 pb-20 px-4 md:px-10">
          <div className="mt-3 md:mt-6 w-full max-w-[1400px] mx-auto">
            <div className="bg-white border-b-4 border-[#ff5722] py-5 mb-8 shadow-sm px-6 flex justify-center">
              <h2 className="text-[#ff5722] tracking-[0.15em] font-bold text-lg md:text-xl uppercase">Lista de Produtos</h2>
            </div>
          </div>

          <div className="w-full max-w-[1400px] mx-auto flex-1">
            {pageLoading ? <PageLoader /> : (
              <>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-7">
                    {visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic text-gray-300 px-6 text-center">
                    <p className="font-bold text-xl">Nenhum produto por aqui...</p>
                    <button onClick={resetFilters} className="mt-4 text-[#ff5722] underline not-italic font-bold">Ver todos os produtos</button>
                  </div>
                )}
              </>
            )}

            {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 md:gap-3 mt-20 mb-3">
    <button 
      onClick={() => changePage(currentPage - 1)} 
      disabled={currentPage === 1} 
      className="w-12 h-12 md:w-12 md:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm disabled:opacity-30"
    >
      <span className="text-black font-bold">❮</span>
    </button>
    
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isWithinRange = page >= currentPage - 2 && page <= currentPage + 2;
        const isFirstPage = page === 1;
        
        if (isFirstPage || isWithinRange) {
          return (
            <button 
              key={page} 
              onClick={() => changePage(page)} 
              className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-lg font-black text-sm transition-all shadow-md ${
                currentPage === page ? 'bg-[#ff5722] text-white' : 'bg-white text-gray-600'
              }`}
            >
              {page}
            </button>
          );
        }
        
        if (page === currentPage + 3 && page < totalPages) {
          return <span key={page} className="text-gray-400 font-bold px-1">...</span>;
        }
        return null;
      })}
    </div>

    <button 
      onClick={() => changePage(currentPage + 1)} 
      disabled={currentPage === totalPages} 
      className="w-12 h-12 md:w-12 md:h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-sm disabled:opacity-30"
    >
      <span className="text-black font-bold">❯</span>
    </button>
  </div>
)}
          </div>
        </section>

        <div className="md:hidden fixed bottom-[100px] right-6 z-[100]">
            <button 
              onClick={() => setIsFilterOpen(true)} 
              className="bg-[#ff5722] text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3 font-black uppercase tracking-wider active:scale-95 transition-all shadow-orange-900/20"
            >
              <span className="text-lg">🔍</span>
              <span>Filtros</span>
            </button>
          </div>
      </main>
    </div>
  );
};

export default Listaprodutos;