import { ShoppingCart as CartIcon, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useState } from 'react';

export interface CartItem {
  id: string;
  flavor: string;
  size: '1/4' | '1/2' | '1';
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemove, onCheckout }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gradient-to-r from-[#6D0F35] to-[#0F4C81] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
      >
        <CartIcon className="w-6 h-6" />
        <span className="font-bold">Carrito</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#F6D365] text-slate-900 text-xs font-black rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[min(92vw,24rem)] bg-gradient-to-br from-[#10193B] to-[#1E3A5F] rounded-2xl shadow-2xl p-6 z-50 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <CartIcon className="w-6 h-6 text-[#F6D365]" />
              <h2 className="text-2xl font-black text-white">Carrito</h2>
            </div>

            {items.length === 0 ? (
              <p className="text-slate-300 text-center py-8">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-[#F6D365]/30 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{item.flavor}</h4>
                          <p className="text-sm text-[#F6D365]">{item.size} Kg</p>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-rose-300 hover:text-rose-200 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 bg-[#F6D365] rounded-full hover:brightness-110">
                            <Minus className="w-4 h-4 text-slate-900" />
                          </button>
                          <span className="font-medium w-8 text-center text-white">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 bg-[#F6D365] rounded-full hover:brightness-110">
                            <Plus className="w-4 h-4 text-slate-900" />
                          </button>
                        </div>
                        <span className="font-bold text-[#F6D365]">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-white/10 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-2xl font-bold text-[#F6D365]">${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      onCheckout();
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#F6D365] to-[#EAAE00] text-slate-900 font-black py-3 rounded-xl hover:brightness-110 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}