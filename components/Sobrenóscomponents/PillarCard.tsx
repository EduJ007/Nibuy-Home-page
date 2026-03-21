
import React from 'react';
import { PillarProps } from '../types';

const PillarCard: React.FC<PillarProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#ff5722] hover:shadow-xl hover:shadow-orange-50 transition-all group">
      <div className="text-[#ff5722] mb-6 bg-orange-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-[#ff5722] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default PillarCard;
