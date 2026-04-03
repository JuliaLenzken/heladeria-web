import { useState } from 'react';
import { FlavorButton } from './components/FlavorButton';
import { SizeSelector } from './components/SizeSelector';
import { ShoppingCart, CartItem } from './components/ShoppingCart';
import { IceCream } from 'lucide-react';
import logoImage from '../assets/image/logo.png';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';
import { Card, CardContent } from './components/ui/card';
import { Toaster } from 'sonner';

const iceCreamFlavors = [
  { name: 'Vainilla', color: '#FFF4E0' },
  { name: 'Chocolate', color: '#8B4513' },
  { name: 'Fresa', color: '#FF69B4' },
  { name: 'Menta', color: '#98FF98' },
  { name: 'Limón', color: '#FFE135' },
  { name: 'Pistacho', color: '#93C572' },
  { name: 'Frambuesa', color: '#E30B5C' },
  { name: 'Coco', color: '#F5F5DC' },
  { name: 'Dulce de Leche', color: '#C19A6B' },
  { name: 'Mango', color: '#FFA500' },
  { name: 'Arándanos', color: '#4169E1' },
  { name: 'Café', color: '#6F4E37' },
  { name: 'Cookies & Cream', color: '#F0F0F0' },
  { name: 'Banana Split', color: '#FFEB3B' },
  { name: 'Caramelo', color: '#D2691E' },
  { name: 'Cereza', color: '#DC143C' },
  { name: 'Stracciatella', color: '#FFFAF0' },
  { name: 'Ron con Pasas', color: '#A0826D' },
  { name: 'Maracuyá', color: '#FFD700' },
  { name: 'Turrón', color: '#DEB887' },
];

const priceMap = {
  '1/4': 5.99,
  '1/2': 10.99,
  '1': 19.99,
};

function App() {
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchaseCount, setPurchaseCount] = useState(0);

  const instagramImages = [
    'https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=Helado+Fresa',
    'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Helado+Chocolate',
    'https://via.placeholder.com/300x300/98FF98/FFFFFF?text=Helado+Menta',
    'https://via.placeholder.com/300x300/FFE135/FFFFFF?text=Helado+Limon',
    'https://via.placeholder.com/300x300/93C572/FFFFFF?text=Helado+Pistacho',
    'https://via.placeholder.com/300x300/E30B5C/FFFFFF?text=Helado+Frambuesa',
    'https://via.placeholder.com/300x300/F5F5DC/FFFFFF?text=Helado+Coco',
    'https://via.placeholder.com/300x300/C19A6B/FFFFFF?text=Dulce+de+Leche',
    'https://via.placeholder.com/300x300/FFA500/FFFFFF?text=Helado+Mango',
    'https://via.placeholder.com/300x300/4169E1/FFFFFF?text=Arandanos',
  ];

  const handleAddToCart = (flavor: string, size: '1/4' | '1/2' | '1') => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.flavor === flavor && item.size === size
    );

    if (existingItemIndex >= 0) {
      const newItems = [...cartItems];
      newItems[existingItemIndex].quantity += 1;
      setCartItems(newItems);
    } else {
      const newItem: CartItem = {
        id: `${flavor}-${size}-${Date.now()}`,
        flavor,
        size,
        price: priceMap[size],
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handlePurchaseConfirmed = () => {
    setPurchaseCount(prev => prev + 1);
    setCartItems([]); // Resetear carrito después de compra
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#BDB76B] to-cyan-400">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-300 to-purple-400 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <img 
              src={logoImage} 
              alt="Logo Heladería" 
              className="h-8 sm:h-12 w-auto object-contain"
            />
          </div>
          
          <div className="flex-1 flex justify-center">
            <h1 
              className="text-2xl sm:text-5xl font-bold text-gray-400 text-center welcome-title"
            >
              Bienvenidos
            </h1>
          </div>
          
          {/* Shopping Cart */}
          <div className="flex-1 flex justify-end">
            <ShoppingCart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              onPurchaseConfirmed={handlePurchaseConfirmed}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-64 sm:h-96 bg-cover bg-center bg-[url('https://via.placeholder.com/1200x600/FFB6C1/FFFFFF?text=Heladeria+Bienvenido')]">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">¡Los Mejores Helados de la Ciudad!</h2>
            <p className="text-lg sm:text-xl">Disfruta de nuestros sabores artesanales hechos con ingredientes frescos.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Flavor Menu */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 drop-shadow-lg text-center text-blue-700">
              Nuestros Sabores
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {iceCreamFlavors.map((flavor) => (
                <FlavorButton
                  key={flavor.name}
                  flavor={flavor}
                  onClick={() => setSelectedFlavor(flavor.name)}
                />
              ))}
            </div>
          </div>

          {/* Instagram Gallery */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 drop-shadow-lg text-center text-blue-700">
              Síguenos en Instagram
            </h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {instagramImages.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <img src={image} alt={`Instagram ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </main>

      {/* Size Selector Modal */}
      {selectedFlavor && (
        <SizeSelector
          flavor={selectedFlavor}
          onClose={() => setSelectedFlavor(null)}
          onAddToCart={(size) => handleAddToCart(selectedFlavor, size)}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;