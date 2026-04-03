import { ShoppingCart as CartIcon, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
  onPurchaseConfirmed: () => void;
}

export function ShoppingCart({ items, onUpdateQuantity, onRemove, onPurchaseConfirmed }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gradient-to-r from-gray-900 to-blue-900 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
      >
        <CartIcon className="w-6 h-6" />
        <span className="font-bold">Carrito</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-2xl p-6 z-50">
            <div className="flex items-center gap-3 mb-6">
              <CartIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Carrito</h2>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{item.flavor}</h4>
                          <p className="text-sm text-blue-300">{item.size} Kg</p>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          aria-label="Eliminar item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 bg-blue-600 rounded-full hover:bg-blue-500"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="font-medium w-8 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 bg-blue-600 rounded-full hover:bg-blue-500"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <span className="font-bold text-blue-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-blue-500/30 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-2xl font-bold text-blue-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogTrigger asChild>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all hover:scale-105">
                        Finalizar Compra
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Compra</DialogTitle>
                      </DialogHeader>
                      <p>¿Estás seguro de que quieres finalizar la compra?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
                        <Button onClick={() => {
                          onPurchaseConfirmed();
                          setIsConfirmOpen(false);
                          setIsOpen(false);
                          toast.success('¡Compra realizada con éxito!');
                        }}>Confirmar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}