import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
      {/* Banner Principal - Altura definida para o PC */}
      <div className="md:col-span-2 relative h-[200px] sm:h-[250px] md:h-[320px] overflow-hidden rounded-sm shadow-sm">
        <img 
          src="/Bannerprincipal.png" 
          alt="Banner Principal" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Banners Secundários - Agora colados e alinhados perfeitamente */}
      <div className="hidden md:flex md:flex-col gap-2 h-[320px]">
        <div className="relative flex-1 overflow-hidden rounded-sm shadow-sm">
          <img src="/Bannersegundario.png" className="absolute inset-0 w-full h-full object-cover" alt="Banner 2" />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-sm shadow-sm">
          <img src="/Bannersegundario2.png" className="absolute inset-0 w-full h-full object-cover" alt="Banner 3" />
        </div>
      </div>
    </div>
  );
};

export default Hero;