// TODO: Create useFetchProducts hook to fetch from FakeStoreAPI

import { useState, useEffect, useMemo } from 'react';

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: number;
    createdAt?: string;
    updatedAt?: string;
};

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
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch dari backend API (bukan FakeStoreAPI)
                const response = await fetch('http://localhost:5000/api/products', {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                
                // Backend return format: { success: true, data: [...] }
                setRawProducts(data.data || []);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                    console.error('Fetch error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [options?.category]);

    // Filter products based on search dan limit
    const products = useMemo(() => {
        let filtered = [...rawProducts];

        // Filter by search
        if (options?.search) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(options.search?.toLowerCase() || '')
            );
        }

        // Filter by category
        if (options?.category) {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === options.category?.toLowerCase()
            );
        }

        // Limit results
        if (options?.limit) {
            filtered = filtered.slice(0, options.limit);
        }

        return filtered;
    }, [rawProducts, options?.search, options?.limit]);

    return { products, loading, error, rawProducts };
};

export { useFetchProducts };
