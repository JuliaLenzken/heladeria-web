import { useState, useRef, useEffect, useCallback } from 'react';
import { FlavorButton } from './components/FlavorButton';
import { SizeSelector } from './components/SizeSelector';
import { ShoppingCart, CartItem } from './components/ShoppingCart';
import { Eye, EyeOff, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import logoImage from 'figma:asset/bf0e6fa0c4b7f45dba63b5d16e13c8d67715be8b.png';
import { api } from '../lib/api';

import imgCielo from '../imports/milshaek_cielo.jpg';
import imgFrutilla from '../imports/milshaek_frutilla.jpg';
import imgBochas from '../imports/3_bochas_con_crema.jpg';
import imgTentacion from '../imports/tentacion.jpg';
import imgBosque from '../imports/frutos_del_bosque.jpg';
import imgCuarto from '../imports/cuarto_3_sabores.jpg';
import imgMedio from '../imports/medio_3_sabores.jpg';
import imgCompartir from '../imports/helado_con_crema_para_compartir.jpg';
import imgKilo from '../imports/kilo_4_sabores.jpg';

type CarouselItem = {
  img: string;
  title: string;
  description: string;
  price: number;
  size: '1/4' | '1/2' | '1';
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  size: '1/4' | '1/2' | '1';
  image: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const fallbackCarouselItems: CarouselItem[] = [
  { img: imgCuarto, title: '¼ Kg — 3 Sabores', description: 'Elegí 3 sabores en porción individual', price: 5.99, size: '1/4' },
  { img: imgMedio, title: '½ Kg — 3 Sabores', description: 'Perfecta para compartir en familia', price: 10.99, size: '1/2' },
  { img: imgKilo, title: '1 Kg — 4 Sabores', description: 'La opción más elegida del local', price: 19.99, size: '1' },
  { img: imgBochas, title: '3 Bochas con Crema', description: 'Bochas artesanales con crema batida', price: 7.5, size: '1/4' },
  { img: imgCompartir, title: 'Para Compartir con Crema', description: 'Bandeja familiar con crema y frutos', price: 22.5, size: '1' },
  { img: imgTentacion, title: 'La Tentación', description: 'Combinación especial de la casa', price: 8.9, size: '1/2' },
  { img: imgBosque, title: 'Frutos del Bosque', description: 'Mix de frambuesa, arándanos y cereza', price: 9.5, size: '1/2' },
  { img: imgCielo, title: 'Milshaek Cielo', description: 'Milkshake cremoso sabor cielo', price: 6.5, size: '1/4' },
  { img: imgFrutilla, title: 'Milshaek Frutilla', description: 'Milkshake intenso de frutilla', price: 6.5, size: '1/4' },
];

function FeaturedCarousel({ items, onOrder }: { items: CarouselItem[]; onOrder: (item: CarouselItem) => void }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = items.length || 1;

  const go = useCallback((dir: number) => {
    setCurrent((c) => (c + dir + total) % total);
  }, [total]);

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [go]);

  const visible = [-1, 0, 1].map((offset) => ({
    item: items[(current + offset + total) % total],
    offset,
    index: (current + offset + total) % total,
  }));

  return (
    <div className="relative mx-auto overflow-hidden featured-carousel">
      <div className="flex h-full items-center justify-center gap-3 px-14">
        {visible.map(({ item, offset, index }) => {
          const isCenter = offset === 0;
          return (
            <div
              key={`${item.title}-${index}`}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer select-none carousel-slide ${isCenter ? 'carousel-slide-center' : 'carousel-slide-side'}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {isCenter && (
                <div className="absolute inset-0 flex flex-col justify-end carousel-gradient">
                  <div className="px-4 pb-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-white font-bold text-sm leading-tight drop-shadow">{item.title}</p>
                      <p className="text-gray-300 text-xs leading-tight">{item.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[#FFD700] font-extrabold text-base leading-none">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => onOrder(item)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all carousel-order-button"
                      >
                        <ShoppingBag size={12} />
                        Pedir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => go(-1)}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white shadow-lg hover:scale-110 transition-transform carousel-arrow"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white shadow-lg hover:scale-110 transition-transform carousel-arrow"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((_, i) => (
          <button
            key={`${items[i].title}-${i}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`rounded-full transition-all ${i === current ? 'w-[18px] h-[7px] bg-[#BDB76B]' : 'w-[7px] h-[7px] bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}

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

type AuthMode = 'login' | 'register';

function AuthScreen({ onEnter }: { onEnter: (mode: AuthMode, data: { username: string; name: string; email: string; password: string }) => Promise<void> }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ username: 'julia', name: 'Julia Lenzken', email: 'julia@heladeria.com', password: 'lenzken' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onEnter(mode, form);
    } catch (err) {
      setError((err as Error).message || 'No se pudo completar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white/85 border-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#BDB76B] transition-colors';

  return (
    <div className="min-h-screen auth-shell flex items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center rounded-[28px] shadow-[0_25px_80px_rgba(22,16,76,0.38)] overflow-hidden auth-card">
        <div className="flex justify-center pt-5 pb-3">
          <img src={logoImage} alt="Logo" className="h-14 w-auto object-contain" />
        </div>

        <div className="w-full px-4 mb-3">
          <div className="rounded-2xl bg-white/20 p-1.5 flex gap-1.5">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${mode === 'login' ? 'auth-tab-button-active' : 'auth-tab-button-inactive'}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${mode === 'register' ? 'auth-tab-button-active' : 'auth-tab-button-inactive'}`}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        <div className="w-full px-4 pb-5">
          <p className="text-xs text-center text-white/90 mb-3 font-semibold">
            <Sparkles className="inline-block mr-1" size={14} />
            Admin por defecto: <strong>julia</strong> / <strong>lenzken</strong>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
            {mode === 'register' && (
              <input
                className={inputClass}
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}

            <input
              className={inputClass}
              placeholder={mode === 'login' ? 'Usuario o correo' : 'Correo electrónico'}
              type="text"
              value={mode === 'login' ? form.username : form.email}
              onChange={(e) => setForm({ ...form, ...(mode === 'login' ? { username: e.target.value } : { email: e.target.value }) })}
              required
            />

            {mode === 'register' && (
              <input
                className={inputClass}
                placeholder="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            )}

            <div className="relative">
              <input
                className={`${inputClass} pr-10`}
                placeholder="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && <p className="text-sm font-semibold text-rose-900 bg-white/90 rounded-lg px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 mb-1 w-full py-3 rounded-xl font-black text-white text-sm shadow-md transition-all hover:opacity-90 active:scale-95 auth-submit-button disabled:opacity-70"
            >
              {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

type Comment = { id: number; text: string; author: string };

function CommentsSection({ comments, onSubmit }: { comments: Comment[]; onSubmit: (draft: { author: string; text: string }) => Promise<void> }) {
  const [draft, setDraft] = useState({ author: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.text.trim() || !draft.author.trim()) return;

    setLoading(true);
    await onSubmit({ author: draft.author.trim(), text: draft.text.trim() });
    setDraft({ author: '', text: '' });
    setLoading(false);
  };

  return (
    <section className="container mx-auto mt-8 comments-section">
      <div className="w-full px-8 py-6 comments-card">
        <h2 className="text-2xl font-extrabold mb-5 tracking-wide comments-heading">Comentarios</h2>

        {comments.length > 0 && (
          <ul className="mb-5 flex flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3 items-start">
                <span className="mt-1 text-xl leading-none flex-shrink-0 select-none comments-author">✦</span>
                <div>
                  <span className="font-bold text-sm comment-author-text">{comment.author}</span>
                  <p className="text-slate-700 text-sm leading-snug">{comment.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="w-full rounded-lg px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none bg-white/75 comments-input"
            placeholder="Tu nombre"
            value={draft.author}
            onChange={(e) => setDraft({ ...draft, author: e.target.value })}
            required
          />
          <textarea
            className="w-full rounded-lg px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none bg-white/75 resize-none comments-textarea"
            placeholder="Escribí tu comentario..."
            rows={3}
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-white font-bold text-sm shadow hover:opacity-90 active:scale-95 transition-all comments-submit-button disabled:opacity-70"
            >
              {loading ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [products, setProducts] = useState<CarouselItem[]>(fallbackCarouselItems);
  const [comments, setComments] = useState<Comment[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catalog, commentsResponse] = await Promise.all([
          api.get<Product[]>('/products'),
          api.get<Comment[]>('/comments'),
        ]);

        const mappedProducts = catalog.map((item) => ({
          img: item.image || fallbackCarouselItems[0].img,
          title: item.title,
          description: item.description,
          price: item.price,
          size: item.size,
        }));

        setProducts(mappedProducts.length > 0 ? mappedProducts : fallbackCarouselItems);
        setComments(commentsResponse);
      } catch {
        setProducts(fallbackCarouselItems);
        setComments([
          { id: 1, author: 'Lucía', text: 'Excelente atención y sabores impecables.' },
          { id: 2, author: 'Mateo', text: 'La presentación es muy refinada y el carrito se siente muy fluido.' },
        ]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const handleLogin = async (mode: AuthMode, payload: { username: string; name: string; email: string; password: string }) => {
    const endpoint = mode === 'login' ? '/login' : '/register';
    const body = mode === 'login'
      ? { email: payload.username, username: payload.username, password: payload.password }
      : { name: payload.name, email: payload.email, password: payload.password };

    const response = await api.post<{ success: boolean; user?: User; message?: string }>(endpoint, body);

    if (!response.success || !response.user) {
      throw new Error(response.message ?? 'No se pudo autenticar');
    }

    setCurrentUser(response.user);
  };

  const handleAddComment = async (draft: { author: string; text: string }) => {
    const saved = await api.post<Comment>('/comments', draft);
    setComments((prev) => [saved, ...prev]);
  };

  const handleCheckout = async () => {
    if (!currentUser || cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await api.post('/orders', {
      customer: currentUser.name,
      email: currentUser.email,
      items: cartItems,
      total,
    });

    setCartItems([]);
    setCheckoutMessage('Pedido confirmado con éxito. La experiencia quedó registrada en el backend mock.');
  };

  const handleCarouselOrder = (item: CarouselItem) => {
    const existingIndex = cartItems.findIndex((c) => c.flavor === item.title && c.size === item.size);

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        { id: `${item.title}-${item.size}-${Date.now()}`, flavor: item.title, size: item.size, price: item.price, quantity: 1 },
      ]);
    }
  };

  const handleAddToCart = (flavor: string, size: '1/4' | '1/2' | '1') => {
    const existingItemIndex = cartItems.findIndex((item) => item.flavor === flavor && item.size === size);

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
        .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  if (!currentUser) {
    return <AuthScreen onEnter={handleLogin} />;
  }

  return (
    <div className="min-h-screen app-shell">
      <header className="sticky top-0 z-40 header-glow">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div className="flex-1 flex justify-start">
            <img src={logoImage} alt="Logo" className="h-12 w-auto object-contain" />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black app-heading">Bienvenidos</h1>
              <p className="text-xs text-slate-700 font-semibold uppercase tracking-[0.35em]">Heladería de autor</p>
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center gap-3">
            <div className="hidden md:block text-right text-sm font-semibold text-slate-800">
              <div>{currentUser.name}</div>
              <div className="text-xs text-slate-600">{currentUser.role}</div>
            </div>
            <ShoppingCart items={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemove} onCheckout={handleCheckout} />
          </div>
        </div>
      </header>

      <div className="flex justify-center py-5">
        <FeaturedCarousel items={products} onOrder={handleCarouselOrder} />
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8">
          <section className="glass-panel rounded-[30px] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Nuestros Sabores</h2>
                <p className="text-sm text-slate-600">Explora texturas, crema, frutos y una experiencia más premium para cada pedido.</p>
              </div>
              <a href="https://wa.me/c/5491130352563" target="_blank" rel="noopener noreferrer" title="Contactanos por WhatsApp" className="whatsapp-link">
                <svg viewBox="0 0 48 48" width="72" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#25D366"/>
                  <path d="M34.5 13.5A14.5 14.5 0 0 0 9.5 24c0 2.56.67 5.06 1.95 7.27L9 39l7.93-2.08A14.5 14.5 0 0 0 38.5 24c0-3.87-1.51-7.5-4.25-10.24 0 0 .25.24 0 0z" fill="#25D366"/>
                  <path d="M34.5 13.5A14.47 14.47 0 0 0 24 9.5 14.5 14.5 0 0 0 9.5 24c0 2.56.67 5.06 1.95 7.27L9 39l7.93-2.08A14.5 14.5 0 0 0 38.5 24c0-3.87-1.51-7.5-4-10.5z" fill="white" fillOpacity="0.08"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M29.73 26.5c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07a8.17 8.17 0 0 1-2.4-1.48 9.03 9.03 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.05 2.85 1.2 3.05c.15.2 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" fill="white"/>
                </svg>
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {iceCreamFlavors.map((flavor) => (
                <FlavorButton key={flavor.name} flavor={flavor} onClick={() => setSelectedFlavor(flavor.name)} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {checkoutMessage && (
        <div className="container mx-auto px-6 -mt-2">
          <div className="rounded-2xl bg-emerald-100 text-emerald-950 px-4 py-3 text-sm font-semibold border border-emerald-300">{checkoutMessage}</div>
        </div>
      )}

      <CommentsSection comments={comments} onSubmit={handleAddComment} />

      <footer className="footer-glow shadow-lg mt-8">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <img src={logoImage} alt="Logo" className="h-10 w-auto object-contain" />
          <div className="flex flex-col items-center leading-tight text-center">
            <span className="font-black text-lg tracking-wide footer-code">{'< WORKS ON MY MACHINE>'}</span>
            <span className="font-black text-lg tracking-wide footer-code">{'</ ICE CREAM/>'}</span>
          </div>
          <img src={logoImage} alt="Logo" className="h-10 w-auto object-contain" />
        </div>
      </footer>

      {selectedFlavor && (
        <SizeSelector
          flavor={selectedFlavor}
          onClose={() => setSelectedFlavor(null)}
          onAddToCart={(size) => handleAddToCart(selectedFlavor, size)}
        />
      )}
    </div>
  );
}

export default App;