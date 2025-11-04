// TODO: Create ProductDetail page - show single product details

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import './ProductDetail.css';

export default function ProductDetail(): JSX.Element {
    const { isFavorite, toggleFavorite } = useFavorites();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);

    // new: selected color
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://fakestoreapi.com/products/${id}`, { signal });
                if (!res.ok) throw new Error('Failed to fetch product');
                const data: Product = await res.json();
                setProduct(data);
                const first = (data as any).images?.[0] ?? data.image;
                setSelectedImage(first);
            } catch (err) {
                if ((err as any).name !== 'AbortError') setError((err as any).message ?? 'Error');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (!product) return;
        const first = (product as any).images?.[0] ?? product.image;
        setSelectedImage(first);

        // jika product menyediakan warna, gunakan; jika tidak, pakai fallback
        const productColors: string[] = (product as any).colors ?? [
            '#FFFFFF', '#000000', '#FF3B30', '#34C759', '#FFCC00'
        ];
        setSelectedColor(productColors[0] ?? null);
    }, [product]);

    // reset quantity saat product berubah
    useEffect(() => setQuantity(1), [product]);

    const thumbs: string[] = ((product as any)?.images ?? [(product as any)?.image]).filter(Boolean) as string[];

    // normalize color options: support array of strings, or array of objects { name/label, hex/value, image }
    type ColorOption = { id: string; value: string; label: string; image?: string | null };

    // helper: detect hex and map to friendly name
    const isHex = (s: string) => /^#?[0-9A-Fa-f]{3,6}$/.test(s);
    const hexToName = (hexRaw: string) => {
        const hex = hexRaw.replace('#', '').toUpperCase();
        const map: Record<string, string> = {
            'FFFFFF': 'White', '000000': 'Black', 'FF3B30': 'Red', 'FF0000': 'Red', '34C759': 'Green',
            '00FF00': 'Lime', 'FFCC00': 'Yellow', 'FFFF00': 'Yellow', 'C0C0C0': 'Silver', '808080': 'Gray',
            'F5F5F5': 'Off white', 'F0F0F0': 'Cream', '8B4513': 'Bronze', '87CEEB': 'Cloud', 'FFC0CB': 'Candy',
            '0000FF': 'Blue', '000080': 'Navy', 'ADD8E6': 'Light Blue', '00FFFF': 'Cyan', '4B0082': 'Indigo'
        };
        return map[hex] ?? `Color ${hexRaw}`;
    };

    const colorOptions: ColorOption[] = (() => {
        const raw = (product as any)?.colors ?? [];
        if (!Array.isArray(raw) || raw.length === 0) {
            const imgs = (product as any)?.colorImages ?? (product as any)?.images ?? [];
            return imgs.map((img: string, i: number) => ({ id: String(i), value: `#ccc`, label: `Option ${i + 1}`, image: img }));
        }
        return raw.map((c: any, i: number) => {
            if (typeof c === 'string') {
                const img = (product as any).colorImages?.[i] ?? (product as any).images?.[i] ?? null;
                const val = c.startsWith('#') ? c : c;
                const label = isHex(c) ? hexToName(c) : c;
                return { id: String(i), value: val, label, image: img };
            }
            return {
                id: c.id ?? String(i),
                value: c.hex ?? c.value ?? '#ccc',
                label: c.name ?? c.label ?? (isHex(c.hex ?? c.value ?? '') ? hexToName(c.hex ?? c.value ?? '') : String(c)),
                image: c.image ?? (product as any).colorImages?.[i] ?? (product as any).images?.[i] ?? null
            };
        });
    })();

    // helper: apakah ada gambar per-warna
    const hasColorImages = colorOptions.some((o) => Boolean(o.image));

    // if product changes set initial selected color / image to first available option
    useEffect(() => {
        if (!product) return;
        if (colorOptions.length) {
            setSelectedColor(colorOptions[0].value ?? null);
            if (colorOptions[0].image) setSelectedImage(colorOptions[0].image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    if (loading) return <div className="product-detail">Loading product…</div>;
    if (error) return <div className="product-detail error">Error: {error}</div>;
    if (!product) return <div className="product-detail">Product not found</div>;

    // rating values (use any to avoid TS error if Product type lacks rating)
    const rate: number = Number(((product as any).rating?.rate ?? 0));
    const count: number = Number(((product as any).rating?.count ?? 0));
    const rounded = Math.round(rate);
    const stars = Array.from({ length: 5 }).map((_, i) => (i < rounded ? '★' : '☆')).join('');

    return (
        <div className="product-detail container">
            <div className="product-detail__back">
                <button
                    type="button"
                    className="btn-back-home"
                    onClick={() => {
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="Back to home"
                >
                    {/* left arrow SVG icon */}
                    <svg className="icon-back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <span className="sr-only">Back to home</span>
                </button>
            </div>

            <div className="product-detail__left">
                <div
                    className="product-detail__image"
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsLightboxOpen(true)}
                    onKeyDown={(e) => (e.key === 'Enter' ? setIsLightboxOpen(true) : null)}
                    aria-label="Open image"
                >
                    {selectedImage ? (
                        <div className="image-wrapper">
                            <img src={selectedImage} alt={product.title} loading="lazy" />
                            {/* jika tidak ada gambar per-warna, tampilkan tint overlay berdasarkan selectedColor */}
                            {!hasColorImages && selectedColor && isHex(selectedColor) && (
                                <span
                                    className="image-tint"
                                    style={{ background: selectedColor }}
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="image-placeholder">No image</div>
                    )}
                </div>

                <div className="product-detail__thumbs" aria-label="Product thumbnails">
                    {thumbs.map((src) => (
                        <button
                            key={src}
                            type="button"
                            className={`thumb-btn ${selectedImage === src ? 'active' : ''}`}
                            onClick={() => setSelectedImage(src)}
                            aria-label="Select product image"
                        >
                            <img src={src} alt={product.title} loading="lazy" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="product-detail__right">
                <h1>
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                </h1>
                <button
                    className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    aria-pressed={isFavorite(product.id)}
                    aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20.8 7.6c0 5-8.8 10.8-8.8 10.8S3.2 12.6 3.2 7.6a4.4 4.4 0 018.8-1.2 4.4 4.4 0 018.8 1.2z" />
                    </svg>
                </button>
                <div className="category-badge" aria-label={`Category ${product.category}`}>{product.category}</div>
                <p className="price">${Number(product.price).toFixed(2)}</p>
                <p className="description">{product.description}</p>

                <div className="product-detail__rating" aria-label="Product rating">
                    <span className="stars">{stars}</span>
                    <span className="rating-count">({count})</span>
                </div>
                <div className="product-detail__actions">
                    {/* quantity controls bisa diaktifkan kembali jika mau */}
                    <button
                        className="btn-add-to-cart"
                        type="button"
                        onClick={() => {
                            // sertakan selectedColor saat menambah ke keranjang
                            // cast ke any agar kompatibel jika signature addToCart berbeda
                            (addToCart as any)({ ...product, selectedColor }, quantity);
                        }}
                        aria-label={`Add ${quantity} to cart`}
                    >
                        Add to cart
                    </button>
                </div>
            </div>

            {isLightboxOpen && (
                <div
                    className="lightbox"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div className="lightbox__content">
                        <button
                            className="lightbox__prev"
                            onClick={() => {
                                const currentIndex = thumbs.indexOf(selectedImage ?? thumbs[0] ?? '');
                                const prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
                                setSelectedImage(thumbs[prevIndex]);
                            }}
                            aria-label="Previous image"
                        >
                            &lt;
                        </button>
                        <button
                            className="lightbox__next"
                            onClick={() => {
                                const currentIndex = thumbs.indexOf(selectedImage ?? thumbs[0] ?? '');
                                const nextIndex = (currentIndex + 1) % thumbs.length;
                                setSelectedImage(thumbs[nextIndex]);
                            }}
                            aria-label="Next image"
                        >
                            &gt;
                        </button>
                        <button
                            className="lightbox__close"
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Close"
                        >
                            close
                        </button>
                        {selectedImage && <img src={selectedImage} alt={product.title} />}
                    </div>
                </div>
            )}
        </div>
    );
}
