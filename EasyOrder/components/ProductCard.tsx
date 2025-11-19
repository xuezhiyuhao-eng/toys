import React from 'react';
import { Product } from '../types';
import { Plus, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  quantityInCart: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, quantityInCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 group">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {quantityInCart} in cart
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</span>
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mt-1">{product.name}</h3>
          </div>
          <span className="font-bold text-gray-900 text-lg">${product.price}</span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-50">
          <button 
            onClick={() => onAdd(product)}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg transition-colors active:scale-95 transform duration-100"
          >
            <Plus size={18} />
            <span>Add to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};