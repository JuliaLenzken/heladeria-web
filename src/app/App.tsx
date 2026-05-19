import { useEffect, useRef, useState } from 'react';
import { FlavorButton } from './components/FlavorButton';
import { SizeSelector } from './components/SizeSelector';
import { ShoppingCart, CartItem } from './components/ShoppingCart';
import { ChevronsLeft, ChevronsRight, IceCream } from 'lucide-react';
import logoImage from '../assets/Logo.png';
import { Carousel, CarouselContent, CarouselItem } from './components/ui/carousel';
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
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCarouselId, setSelectedCarouselId] = useState<string | null>(null);
  const [carouselTimer, setCarouselTimer] = useState<number | null>(null);

  const featuredItems = [
    {
      id: 'cono-2-bochas',
      title: 'Cono 2 bochas con caramelo y cubanito',
      imageUrl: new URL('../assets/image/cono 2 bochas con caramelo y cubanito.jpg', import.meta.url).href,
      flavor: 'Caramelo',
      size: '1/2' as const,
    },
    {
      id: 'sundae-crema-cereza',
      title: 'Sundae con crema y cereza',
      imageUrl: new URL('../assets/image/sundae con crema y cereza.jpg', import.meta.url).href,
      flavor: 'Cereza',
      size: '1/2' as const,
    },
    {
      id: 'milshake-cielo',
      title: 'Milshaek cielo',
      imageUrl: new URL('../assets/image/milshaek cielo.jpg', import.meta.url).href,
      flavor: 'Milshake Cielo',
      size: '1/2' as const,
    },
    {
      id: 'milshake-frutillas',
      title: 'Milshaek frutillas',
      imageUrl: new URL('../assets/image/milshaek frutillas.jpg', import.meta.url).href,
      flavor: 'Milshake Frutillas',
      size: '1/2' as const,
    },
    {
      id: 'copa-tentacion',
      title: 'Copa tentación',
      imageUrl: new URL('../assets/image/copa tentacion.jpg', import.meta.url).href,
      flavor: 'Copa Tentación',
      size: '1/2' as const,
    },
    {
      id: 'medio-frutas',
      title: 'Medio con frutas',
      imageUrl: new URL('../assets/image/medio con frutas.jpg', import.meta.url).href,
      flavor: 'Medio con frutas',
      size: '1/2' as const,
    },
    {
      id: 'kilo-4-sabores',
      title: 'Kilo 4 sabores',
      imageUrl: new URL('../assets/image/kilo 4 sabores.jpg', import.meta.url).href,
      flavor: 'Kilo 4 sabores',
      size: '1' as const,
    },
    {
      id: 'medio-3-sabores',
      title: 'Medio 3 sabores',
      imageUrl: new URL('../assets/image/medio 3 sabores.jpg', import.meta.url).href,
      flavor: 'Medio 3 sabores',
      size: '1/2' as const,
    },
    {
      id: 'cuarto-3-sabores',
      title: 'Cuarto 3 sabores',
      imageUrl: new URL('../assets/image/cuarto 3 sabores.jpg', import.meta.url).href,
      flavor: 'Cuarto 3 sabores',
      size: '1/4' as const,
    },
  ];

  const instagramImages = [
    new URL('../assets/instagran/Antiche.jpg', import.meta.url).href,
    new URL('../assets/instagran/Cadore.jpg', import.meta.url).href,
    new URL('../assets/instagran/Chocolate.jpg', import.meta.url).href,
    new URL('../assets/instagran/Florida.jpg', import.meta.url).href,
    new URL('../assets/instagran/Freddo.jpg', import.meta.url).href,
    new URL('../assets/instagran/Gruta.jpg', import.meta.url).href,
    new URL('../assets/instagran/Los Amores.jpg', import.meta.url).href,
    new URL('../assets/instagran/Scannapieco.jpg', import.meta.url).href,
    new URL('../assets/instagran/Trevi.jpg', import.meta.url).href,
    new URL('../assets/instagran/Tufic.jpg', import.meta.url).href,
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
    setPurchaseCount((prev) => prev + 1);
    setCartItems([]); // Resetear carrito después de compra
  };

  const handleCarouselSelect = (itemId: string) => {
    setSelectedCarouselId(itemId);
    if (carouselTimer) {
      window.clearTimeout(carouselTimer);
    }

    const timer = window.setTimeout(() => {
      setSelectedCarouselId(null);
      setCarouselTimer(null);
    }, 5000);

    setCarouselTimer(timer);
  };

  const featuredCarouselRef = useRef<HTMLDivElement | null>(null);
  const instagramCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollFeaturedCarousel = (direction: number) => {
    if (!featuredCarouselRef.current) return;
    const scrollAmount = featuredCarouselRef.current.clientWidth * 0.8;
    featuredCarouselRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollInstagramCarousel = (direction: number) => {
    if (!instagramCarouselRef.current) return;
    const scrollAmount = instagramCarouselRef.current.clientWidth * 0.8;
    instagramCarouselRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleCarouselClick = (item: (typeof featuredItems)[number]) => {
    handleAddToCart(item.flavor, item.size);
    setCartOpen(true);
    handleCarouselSelect(item.id);
  };

  useEffect(() => {
    return () => {
      if (carouselTimer) {
        window.clearTimeout(carouselTimer);
      }
    };
  }, [carouselTimer]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#BDB76B] to-cyan-400">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-300 to-purple-400 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <button className="relative w-16 h-16 sm:w-20 sm:h-20 p-0 rounded-full shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <img
                src={logoImage}
                alt="Logo Heladería"
                className="w-full h-full object-cover"
              />
            </button>
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
              open={cartOpen}
              onOpenChange={setCartOpen}
            />
          </div>
        </div>
      </header>

      {/* Featured Products Carousel */}
      <section className="container mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl border-4 border-violet-600 bg-white/15 backdrop-blur-xl p-4 shadow-xl overflow-visible">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-violet-950">
            Descubre nuestros destacados
          </h2>
          <div className="relative overflow-visible">
            <button
              type="button"
              onClick={() => scrollFeaturedCarousel(-1)}
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-violet-700/90 p-3 text-white shadow-xl transition hover:bg-violet-600"
              aria-label="Cargar imágenes desde la izquierda"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollFeaturedCarousel(1)}
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-violet-700/90 p-3 text-white shadow-xl transition hover:bg-violet-600"
              aria-label="Cargar imágenes desde la derecha"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
            <div
              ref={featuredCarouselRef}
              className="flex gap-4 overflow-x-auto overflow-y-hidden px-14 py-2 scroll-smooth scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-transparent"
            >
              {featuredItems.map((item) => {
                const isSelected = selectedCarouselId === item.id;
                return (
                  <div key={item.id} className="relative flex-shrink-0 overflow-visible">
                    <button
                      type="button"
                      onClick={() => handleCarouselClick(item)}
                      className={
                        `group relative block min-w-[10rem] h-28 sm:min-w-[11rem] sm:h-32 md:min-w-[12rem] md:h-[12rem] rounded-3xl border-[4px] border-violet-600 bg-white/90 shadow-lg transition-transform duration-300 ease-out overflow-visible ${
                          isSelected ? 'scale-[3] z-30 shadow-2xl' : 'scale-100'
                        }`
                      }
                      aria-label={item.title}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full rounded-3xl object-cover"
                      />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] sm:text-xs text-center rounded-b-3xl py-1">
                        {item.title}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-700">
            Selecciona cualquier imagen para agregar al carrito.
          </p>
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
          <div className="rounded-3xl border-4 border-violet-600 bg-white/15 backdrop-blur-xl p-4 shadow-xl overflow-visible">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-violet-950">
              Síguenos en Instagram
            </h2>
            <div className="relative overflow-visible">
              <button
                type="button"
                onClick={() => scrollInstagramCarousel(-1)}
                className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-violet-700/90 p-3 text-white shadow-xl transition hover:bg-violet-600"
                aria-label="Cargar imágenes desde la izquierda"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollInstagramCarousel(1)}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full bg-violet-700/90 p-3 text-white shadow-xl transition hover:bg-violet-600"
                aria-label="Cargar imágenes desde la derecha"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
              <div
                ref={instagramCarouselRef}
                className="flex gap-4 overflow-x-auto overflow-y-hidden px-14 py-2 scroll-smooth scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-transparent"
              >
                {instagramImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0 overflow-visible min-w-[16rem] sm:min-w-[18rem] md:min-w-[20rem] h-[20rem] rounded-3xl border-4 border-violet-600 bg-white/90 shadow-lg overflow-hidden">
                    <img src={image} alt={`Instagram ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
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

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-300 to-purple-400 py-6 text-center">
        <div className="flex items-center justify-center gap-6">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center p-1">
            <img src={logoImage} alt="logo left" className="max-w-full max-h-full object-contain" />
          </div>
          <p className="text-2xl font-bold footer-text text-center">
            Works on My Machine Ice Cream S.A
          </p>
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center p-1">
            <img src={logoImage} alt="logo right" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;