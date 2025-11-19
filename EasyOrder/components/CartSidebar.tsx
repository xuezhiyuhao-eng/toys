import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, Copy, Loader2, Send } from 'lucide-react';
import { generateSmartOrderSummary } from '../services/geminiService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity,
  onClearCart
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [orderNote, setOrderNote] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGenerateOrder = async () => {
    setIsGenerating(true);
    const summary = await generateSmartOrderSummary(items);
    setOrderNote(summary);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (orderNote) {
      navigator.clipboard.writeText(orderNote);
      alert("Order copied to clipboard!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white pt-safe-top">
          <div className="flex items-center gap-2 text-gray-900">
            <ShoppingBag className="text-blue-600" />
            <h2 className="text-xl font-bold">Current Order</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
              {items.length} items
            </span>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <ShoppingBag size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-2 text-gray-500">Tap on products to start an order</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-200 flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-base">{item.name}</h4>
                  <p className="text-blue-600 font-bold text-lg">${item.price * item.quantity}</p>
                </div>
                <div className="flex flex-col items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-blue-600 active:bg-blue-50 transition-colors"
                  >
                    +
                  </button>
                  <span className="font-bold text-sm w-full text-center py-1 bg-gray-50 border-y border-gray-100">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 active:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                </div>
              </div>
            ))
          )}

          {orderNote && (
            <div className="mt-6 bg-green-50 border border-green-100 p-4 rounded-xl animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <Send size={16} /> Order Summary
                </h3>
                <button onClick={handleCopy} className="bg-white border border-green-200 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-semibold shadow-sm">
                  <Copy size={12} /> Copy Text
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {orderNote}
                </pre>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white space-y-4 pb-safe-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <span className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={onClearCart}
                className="col-span-1 flex items-center justify-center gap-2 px-4 py-4 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors touch-manipulation"
              >
                <Trash2 size={20} />
              </button>
              
              <button 
                onClick={handleGenerateOrder}
                disabled={isGenerating}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold text-lg transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
              >
                {isGenerating ? (
                  <><Loader2 size={20} className="animate-spin" /> Creating...</>
                ) : (
                  <>Complete Order</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};