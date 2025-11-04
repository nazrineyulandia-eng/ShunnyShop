import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

type CartItem = Product & { quantity: number };

type CartContextValue = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Math.max(1, next[idx].quantity + quantity) };
        return next;
      }
      return [...prev, { ...product, quantity: Math.max(1, quantity) }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart(prev => prev.map(it => (it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it)));
  };

  // fungsi removeFromCart yang benar: hapus item berdasarkan id dan persist ke localStorage via useEffect
  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(it => it.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartContext;


