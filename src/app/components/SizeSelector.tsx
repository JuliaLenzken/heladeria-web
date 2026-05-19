import { X } from 'lucide-react';

interface SizeSelectorProps {
  flavor: string;
  onClose: () => void;
  onAddToCart: (size: '1/4' | '1/2' | '1') => void;
}

export function SizeSelector({ flavor, onClose, onAddToCart }: SizeSelectorProps) {
  const sizes = [
    { id: '1/4' as const, label: '1/4 Kg', price: 5.99 },
    { id: '1/2' as const, label: '1/2 Kg', price: 10.99 },
    { id: '1' as const, label: '1 Kg', price: 19.99 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{flavor}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar selector de tamaño"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">Selecciona el tamaño:</p>
        
        <div className="space-y-3">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => {
                onAddToCart(size.id);
                onClose();
              }}
              className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-xl transition-all hover:scale-105"
            >
              <span className="font-semibold text-gray-800">{size.label}</span>
              <span className="text-pink-600 font-bold">${size.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
