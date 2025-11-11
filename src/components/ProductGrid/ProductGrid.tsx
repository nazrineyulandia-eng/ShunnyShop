import { useState, useMemo, useEffect } from 'react';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import ProductCard from '../ProductCard/ProductCard';
import { Product } from '../../types';
import './ProductGrid.css';
// removed useCategory import because CategoryContext doesn't provide a selected "category" value
// and ProductGrid already has its own localCategory state.
import usePagination from '../../utils/pagination';

// moved categories to module scope to avoid scope/HMR issues
const categories = [
    'all',
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
];

function ProductGrid(): JSX.Element {
    const [search, setSearch] = useState<string>('');
    const [localCategory, setLocalCategory] = useState<string>('all');
    const [sort, setSort] = useState<string>('');

    // pagination/loading state
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    // derive effectiveCategory from local state (use 'all' => undefined to fetch all)
    const effectiveCategory = localCategory === 'all' ? undefined : localCategory;
    const { products = [], loading, error } = useFetchProducts({ category: effectiveCategory });

    const filteredProducts = useMemo(() => {
        const list: Product[] = (products ?? []).map((p: any) => ({
            ...p,
            rating: p?.rating ?? { rate: 0, count: 0 },
        }));

        const q = search.trim().toLowerCase();
        let result = list;

        if (q) {
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    (p.description ?? '').toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
            );
        }

        if (sort === 'price-asc') {
            result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        } else if (sort === 'price-desc') {
            result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        } else if (sort === 'rating-desc') {
            result = [...result].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
        }

        return result;
    }, [products, search, sort]);

    // define page size before using it
    const PAGE_SIZE = 12;

    // pagination: buat setelah filteredProducts tersedia
    const pagination = usePagination(filteredProducts, PAGE_SIZE);
    const { paginatedData = [], currentPage, setCurrentPage, totalPages } = pagination;

    // compute fallback total pages from client-side data
    const computedTotalPages = Math.ceil((filteredProducts.length ?? 0) / PAGE_SIZE);

    // single source: jika tidak ada produk => 0, else pakai totalPages dari hook jika ada, kalau tidak pakai computedTotalPages
    const displayTotalPages =
        filteredProducts.length === 0
            ? 0
            : (typeof totalPages === 'number' ? totalPages : Math.max(1, computedTotalPages));

    // hasMore derived from the chosen total pages
    const hasMore = currentPage < displayTotalPages;

    // matikan loadingMore ketika paginatedData berubah (data baru sudah siap)
    useEffect(() => {
        setLoadingMore(false);
    }, [paginatedData]);

    // reset page saat hasil akhir berubah (filter/sort/search)
    useEffect(() => {
        setCurrentPage(1);
        setLoadingMore(false);
    }, [filteredProducts, setCurrentPage]);


    return (
        <section className="product-grid container">
            <div className="product-grid__controls" role="toolbar" aria-label="Product filters and search">
                <select
                    className="product-grid__category"
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    aria-label="Filter by category"
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c === 'all' ? 'All Categories' : c}
                        </option>
                    ))}
                </select>

                <select
                    className="product-grid__sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort products"
                >
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="rating-desc">Rating: High → Low</option>
                </select>

                <div className="product-grid__search-wrap">
                    <input
                        type="text"
                        className="product-grid__search"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search products by name"
                    />
                    {search && (
                        <button
                            type="button"
                            className="product-grid__clear"
                            aria-label="Clear search"
                            onClick={() => setSearch('')}
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="product-grid__meta" aria-live="polite">
                    {loading ? 'Loading...' : `${filteredProducts.length} items`}
                </div>
            </div>

            {error && <div className="product-grid__status error">Error: {error}</div>}

            <div className="product-grid__list">
                {loading && !products.length ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div className="product-card placeholder" key={i} />
                    ))
                ) : (
                    paginatedData.map((product: Product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product}
                            onRefresh={() => {
                                // Refresh data
                                setCurrentPage(1);
                            }}
                        />
                    ))
                )}
            </div>

            <div className="product-grid__pagination" aria-label="Pagination">
                <button
                    type="button"
                    onClick={() => {
                        if (loadingMore || currentPage <= 1) return;
                        setLoadingMore(true);
                        setCurrentPage(Math.max(1, currentPage - 1));
                    }}
                    disabled={loadingMore || currentPage <= 1}
                    aria-label="Previous page"
                >
                    Prev
                </button>

                {displayTotalPages === 0 ? (
                    <span aria-live="polite">No products</span>
                ) : (
                    <span aria-live="polite">
                        Page {currentPage} / {displayTotalPages}
                    </span>
                )}

                <button
                    type="button"
                    onClick={() => {
                        if (loadingMore || !hasMore || displayTotalPages === 0) return;
                        setLoadingMore(true);
                        setCurrentPage(Math.min(displayTotalPages, currentPage + 1));
                    }}
                    disabled={loadingMore || !hasMore || displayTotalPages === 0}
                    aria-label="Next page"
                >
                    {loadingMore ? 'Loading…' : 'Next'}
                </button>
            </div>
        </section>
    );
}

export default ProductGrid;
