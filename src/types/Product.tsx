export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    // tambahkan rating opsional agar komponen yang memakai product.rating tidak error
    rating?: { rate: number; count: number };
}
