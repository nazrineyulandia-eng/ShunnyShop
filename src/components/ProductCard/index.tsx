import './ProductCard.css';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props): JSX.Element {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <img
        src={product.image}
        alt={product.title}
        className="product-card_image"
        loading="lazy"
      />
      <div className="product-card_info">
        <h3 className="product-card_name">{product.title}</h3>
        <p className="product-card_category">{product.category}</p>
        <p className="product-card_price">${Number(product.price).toFixed(2)}</p>
        <div className="product-card_rating">
          {product.rating?.rate ?? 0} ({product.rating?.count ?? 0})
        </div>
        <button
          type="button"
          className="product-card_add"
          onClick={() => addToCart(product, 1)}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
};

