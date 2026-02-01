import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import FlashSales from './components/FlashSales';
import DailyDiscover from './components/DailyDiscover';
import Footer from './components/Footer';
import { productsData } from './products';

const App: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return productsData;

    return productsData.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header onSearch={setSearch} />

      <main className="mt-[140px] md:mt-[160px] pb-14">
        
         {!search && <Hero />}


        <div className="max-w-[1200px] mx-auto px-4 lg:px-0">

          {!search && <CategoryGrid />}

  
        </div>

        <FlashSales products={filteredProducts} />
        <div className="max-w-[1650px] mx-auto px-4 lg:px-0" >
        <DailyDiscover products={filteredProducts} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
