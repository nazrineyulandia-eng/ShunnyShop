import './ProductCard.css';
import { Product } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';

type Props = { product: Product };

export default function ProductCard({ product }: Props): JSX.Element {
    const rating = Number(product.rating?.rate ?? 0);
    const count = Number(product.rating?.count ?? 0);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const onClickCard = () => {
        navigate(`/product/${product.id}`);
    }

    return (
        <article className="product-card" onClick={onClickCard} role="button" tabIndex={0}>
            <img
                src={product.image}
                alt={product.title}
                className="product-card_image"
                loading="lazy"
            />
            <div className="product-card_info">
                <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
                    <h3 className="product-card_name">{product.title}</h3>
                </Link>
                <p className="product-card_category">{product.category}</p>
                <p
                    className="product-card_rating"
                    aria-label={`Rating ${rating.toFixed(1)} dari 5, ${count} ulasan`}
                >
                    <span aria-hidden="true">
                        {Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? '★' : '☆')).join('')}
                    </span>
                    <span className="sr-only">{rating.toFixed(1)} dari 5</span>
                    <span className="rating-count">({count})</span>
                </p>
                <div className="product-card_meta">
                    <div className="product-card_price">${product.price}</div>
                    <div className="meta-actions">
                        <button
                            className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                            aria-pressed={isFavorite(product.id)}
                            aria-label={isFavorite(product.id) ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
                        >
                            {/* heart SVG */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M20.8 7.6c0 5-8.8 10.8-8.8 10.8S3.2 12.6 3.2 7.6a4.4 4.4 0 018.8-1.2 4.4 4.4 0 018.8 1.2z" />
                            </svg>
                        </button>

                        <button
                            className="add-to-cart-btn primary"
                            type="button"
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            aria-label={`Add ${product.title} to cart`}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
