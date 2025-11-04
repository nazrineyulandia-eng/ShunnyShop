# Shopee Clone - React Learning Project

Template project untuk belajar React dengan membuat Shopee Clone menggunakan FakeStoreAPI.

## 📁 Project Structure

```
shopee-clone/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Header/              # Top navigation & logo
│   │   ├── SearchBar/           # Product search input
│   │   ├── FilterSidebar/       # Category & sort filters
│   │   ├── ProductCard/         # Single product card
│   │   ├── ProductGrid/         # Grid of products
│   │   ├── ShoppingCart/        # Cart items display
│   │   ├── Footer/              # Footer
│   │   └── Navigation/          # Additional navigation
│   ├── pages/                   # Page components
│   │   ├── Home.tsx             # Product listing page
│   │   ├── ProductDetail.tsx    # Single product detail
│   │   └── CartPage.tsx         # Shopping cart page
│   ├── context/                 # Context API
│   │   └── CartContext.tsx      # Global cart state
│   ├── hooks/                   # Custom hooks
│   │   └── useFetchProducts.ts  # Fetch products from API
│   ├── types/                   # TypeScript interfaces
│   │   └── index.ts             # Type definitions
│   ├── styles/                  # Global styles
│   │   └── globals.css          # Global CSS
│   ├── App.tsx                  # Main App component with routing
│   └── main.tsx                 # Entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── vite.config.ts               # Vite config
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /home/azizah/Desktop/react-2/shopee-clone
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Aplikasi akan buka di `http://localhost:5173`

## 📋 Implementation Checklist

### Step 1: Types & Interfaces (`src/types/index.ts`)
- [ ] Define `Product` interface dari FakeStoreAPI response
- [ ] Define `CartItem` interface (Product + quantity)
- [ ] Define `FilterState` interface (search, category, sortBy)
- [ ] Define `CartContextType` interface (untuk context)

### Step 2: Context & State Management (`src/context/CartContext.tsx`)
- [ ] Create CartContext dengan createContext
- [ ] Create CartProvider component
- [ ] Implement state: cartItems (useState + localStorage)
- [ ] Implement actions: addToCart, removeFromCart, updateQuantity, clearCart
- [ ] Implement helpers: getTotalPrice, getTotalItems
- [ ] Create useCart hook untuk easy access

### Step 3: Custom Hooks (`src/hooks/useFetchProducts.ts`)
- [ ] Create useFetchProducts hook
- [ ] Fetch data dari https://fakestoreapi.com/products
- [ ] Handle loading, error, success states
- [ ] Return { products, loading, error }

### Step 4: Components - Display (`src/components/`)
- [ ] **Header.tsx**: Logo + navigation links (Home, Cart)
  - Display cart item count (badge)
- [ ] **SearchBar.tsx**: Input search field
  - Callback ke parent dengan query string
- [ ] **FilterSidebar.tsx**: Category radio buttons + sort dropdown
  - Kategori: electronics, jewelery, men's clothing, women's clothing
  - Sort options: default, price-asc, price-desc, rating
- [ ] **ProductCard.tsx**: Single product display
  - Image, title, category, price, rating
  - "Add to Cart" button
- [ ] **ProductGrid.tsx**: Display multiple ProductCards
  - Grid layout dengan responsive columns
- [ ] **ShoppingCart.tsx**: Display cart items
  - Product image, name, price, quantity
  - +/- buttons untuk quantity
  - Remove button
  - Subtotal per item
- [ ] **Footer.tsx**: Simple footer

### Step 5: Pages (`src/pages/`)
- [ ] **Home.tsx**: 
  - Use useFetchProducts hook
  - State: searchQuery, selectedCategory, sortBy
  - Combine: SearchBar + FilterSidebar + ProductGrid
  - Filter & sort logic
  - Use useCart untuk addToCart
- [ ] **ProductDetail.tsx**:
  - Get productId dari URL param
  - Fetch single product
  - Display: image, name, description, price, rating
  - Quantity selector
  - Add to Cart button
- [ ] **CartPage.tsx**:
  - Use useCart hook untuk cartItems
  - Display ShoppingCart component
  - Show total price
  - "Continue Shopping" button (link ke Home)
  - "Checkout" button (mock alert)

### Step 6: Main App (`src/App.tsx` & `src/main.tsx`)
- [ ] **main.tsx**:
  - Import React, ReactDOM
  - Import App component
  - Create root dan render
- [ ] **App.tsx**:
  - Setup BrowserRouter
  - Wrap dengan CartProvider
  - Setup Routes:
    - "/" → Home
    - "/product/:id" → ProductDetail
    - "/cart" → CartPage

### Step 7: Styling (`src/styles/` & `.css` files)
- [ ] Global styles di `globals.css`
  - Reset default styles
  - Font family, base colors
  - Responsive breakpoints
- [ ] Component styles (setiap `.css` file):
  - Header: flexbox layout, Shopee red color (#ee4d2d)
  - ProductCard: hover effect, shadow
  - ProductGrid: CSS grid dengan responsive columns
  - Others: sesuai kebutuhan

## 🔗 API Reference

**FakeStoreAPI Base URL**: `https://fakestoreapi.com`

### Endpoints:
```
GET /products                    # Get all 20 products
GET /products/:id              # Get single product
GET /products/categories       # Get all categories
GET /products/category/:type   # Get products by category
```

### Response Example:
```json
{
  "id": 1,
  "title": "Fjallraven - Backpack",
  "price": 109.95,
  "description": "Your perfect pack for...",
  "category": "electronics",
  "image": "https://...",
  "rating": {
    "rate": 3.9,
    "count": 120
  }
}
```

## 💡 Learning Tips

1. **Start Small**: Mulai dari types dulu, terus context, terus hooks
2. **Test Each Component**: Buat component sederhana, test di browser
3. **Use React DevTools**: Extension untuk debug React
4. **Read Errors**: Error message biasanya sudah jelas, baca dengan teliti
5. **Use Console.log**: Debug dengan console.log di berbagai tahap

## 📚 Resources

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [TypeScript Docs](https://www.typescriptlang.org)
- [FakeStoreAPI](https://fakestoreapi.com)
- [Axios Docs](https://axios-http.com)

## ❓ Troubleshooting

### Port sudah digunakan
```bash
# Ubah port di vite.config.ts atau:
npm run dev -- --port 3000
```

### Module not found error
- Pastikan import path benar
- Pastikan file udah dibuat
- Check tsconfig.json paths

### CORS error dari API
- FakeStoreAPI support CORS, jadi seharusnya tidak ada masalah
- Check network tab di browser DevTools

## 🎯 Next Steps (Optional)

Setelah MVP selesai, bisa menambah:
- [ ] Wishlist feature (localStorage)
- [ ] Price range filter (slider)
- [ ] Product reviews
- [ ] Dark mode
- [ ] Checkout form (form validation)
- [ ] Order history

Good luck belajarnya! 🚀
