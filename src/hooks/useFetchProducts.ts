// TODO: Create useFetchProducts hook to fetch from FakeStoreAPI

import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types/Product';

type FetchOptions = {
    search?: string;
    category?: string;
    limit?: number;
};

const useFetchProducts = (options: FetchOptions) => {
    const [rawProducts, setRawProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);


            try {
                const url = options?.category
                    ? `https://fakestoreapi.com/products/category/${options.category}`
                    : 'https://fakestoreapi.com/products';

                const response = await fetch(url, { signal });
                if (!response.ok) throw new Error('Network response was not ok')
                const data: Product[] = await response.json();
                setRawProducts(data);
            } catch (error) {
                if ((error as any).name !== 'AbortError') {
                    setError((error as any).message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        return () => controller.abort();
    }, [options?.category]);

    const products = useMemo(() => {
        let result = rawProducts;

        if (options?.search) {
            const q = options.search.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(q));
        }

        if (options?.limit && options.limit > 0) {
            result = result.slice(0, options.limit);
        }

        return result;
    }, [rawProducts, options?.search, options?.limit]);

    return { products, loading, error, rawProducts };
};

export { useFetchProducts };
