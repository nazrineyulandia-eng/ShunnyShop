// TODO: Define Product interface from FakeStoreAPI
// TODO: Define CartItem interface
// TODO: Define FilterState interface
// TODO: Define CartContextType interface

/**
 * Simple types untuk FakeStoreAPI.
 * (Penjelasan singkat: interface = "kontrak" bentuk data.
 *  Ini bantu editor kasih autocomplete & mencegah salah pakai field.)
 */

/** Rating yang dikembalikan API */
export interface Rating {
  rate: number;
  count: number;
}

/** Bentuk product dari FakeStoreAPI */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

/** Item di cart: simpan id + jumlah, boleh juga simpan product lengkap optional */
export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

/** Opsi sorting sederhana untuk UI */
export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | '';

/** State untuk filter / search / pagination di ProductGrid */
export interface FilterState {
  search: string;        // kata kunci pencarian
  category: string;      // 'all' atau nama kategori
  sort: SortOption;      // cara urut
  page?: number;         // untuk pagination (opsional)
  perPage?: number;      // jumlah item per halaman (opsional)
}

/** Tipe untuk CartContext (fungsi-fungsi yang akan kamu implement) */
export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
