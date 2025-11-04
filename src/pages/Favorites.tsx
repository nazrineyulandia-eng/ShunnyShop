import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './Favorites.css';

type Product = {
  id: number | string;
  title?: string;
  image?: string;
  price?: number;
};

export default function Favorites(): JSX.Element {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const favArray = Array.from(favorites ?? []);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(false);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (favArray.length === 0) return;
    const missing = favArray.filter((id) => !products[String(id)]);
    if (missing.length === 0) {
      // ensure qty defaults
      const defaults: Record<string, number> = {};
      favArray.forEach((id) => { defaults[String(id)] = qtyMap[String(id)] ?? 1; });
      setQtyMap((s) => ({ ...defaults, ...s }));
      return;
    }

    let mounted = true;
    setLoading(true);

    Promise.all(
      missing.map(async (id) => {
        try {
          const res = await fetch(`https://fakestoreapi.com/products/${id}`);
          if (!res.ok) throw new Error('not found');
          const data = await res.json();
          return { id: String(id), data };
        } catch {
          return { id: String(id), data: { id, title: `Produk #${id}`, image: undefined, price: undefined } };
        }
      })
    )
      .then((items) => {
        if (!mounted) return;
        setProducts((prev) => {
          const next = { ...prev };
          for (const item of items) next[item.id] = item.data;
          return next;
        });
        // set default qty 1 for new items
        setQtyMap((prev) => {
          const n = { ...prev };
          items.forEach((it) => { if (!n[it.id]) n[it.id] = 1; });
          return n;
        });
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favArray.join(',')]);

  const changeQty = (id: string, delta: number) => {
    setQtyMap((s) => {
      const cur = s[id] ?? 1;
      const next = Math.max(1, cur + delta);
      return { ...s, [id]: next };
    });
  };

  const handleAddToCart = (p?: Product, idRaw?: string | number) => {
    if (!p) return;
    const id = String(idRaw ?? p.id);
    const quantity = qtyMap[id] ?? 1;
    addToCart({ id: p.id, title: p.title, price: p.price, image: p.image, quantity } as any);
  };

  if (favArray.length === 0) {
    return (
      <section className="favorites container">
        <h1>My Favorites</h1>
        <p>No favorite products yet — explore <Link to="/">products</Link>.</p>
      </section>
    );
  }

  return (
    <section className="favorites container">
      <h1>My Favorites ({favArray.length})</h1>

      {loading && <p>Loading product data...</p>}

      <ul className="favorites-list">
        {favArray.map((idRaw) => {
          const id = String(idRaw);
          const p = products[id];
          return (
            <li key={id} className="favorite-row">
              <div className="fav-left">
                {p?.image ? <img src={p.image} alt={p?.title ?? `Produk ${id}`} /> : <div className="img-placeholder">No image</div>}
              </div>

              <div className="fav-center">
                <Link to={`/product/${id}`} className="fav-title">{p?.title ?? `Produk #${id}`}</Link>

                <div className="fav-controls">
                  <div className="qty">
                    <button type="button" onClick={() => changeQty(id, -1)} aria-label="Kurangi">−</button>
                    <input type="number" value={qtyMap[id] ?? 1} readOnly />
                    <button type="button" onClick={() => changeQty(id, +1)} aria-label="Tambah">+</button>
                  </div>

                  <div className="price-inline">{p?.price ? `Rp ${Number(p.price).toLocaleString()}` : '—'}</div>

                  {/* Add to Cart moved to the right column */}
                </div>
              </div>

              <div className="fav-right">
                <div className="fav-price">{p?.price ? `Rp ${Number(p.price).toLocaleString()}` : '—'}</div>
                <div className="fav-actions">
                  <button
                    type="button"
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(p, idRaw)}
                  >
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeFavorite(idRaw)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}