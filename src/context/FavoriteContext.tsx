import React, { createContext, useContext, useEffect, useState } from 'react';

type FavoritesState = {
  favorites: Set<string | number>;
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (id: string | number) => void;
  addFavorite: (id: string | number) => void;
  removeFavorite: (id: string | number) => void;
};

const FavoriteContext = createContext<FavoritesState | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string | number>>(() => {
    try {
      if (typeof window === 'undefined') return new Set();
      const raw = localStorage.getItem('favorites');
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as Array<string | number>;
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    } catch {
      // ignore
    }
  }, [favorites]);

  const isFavorite = (id: string | number) => favorites.has(id);
  const addFavorite = (id: string | number) => setFavorites((s) => new Set([...s, id]));
  const removeFavorite = (id: string | number) =>
    setFavorites((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  const toggleFavorite = (id: string | number) =>
    setFavorites((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <FavoriteContext.Provider value={{ favorites, isFavorite, toggleFavorite, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoriteContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoriteProvider');
  return ctx;
}