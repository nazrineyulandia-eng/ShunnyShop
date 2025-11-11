import { useState } from 'react';

type AddProductFormProps = {
    onProductAdded: () => void;
    onClose: () => void;
};

export default function AddProductForm({ onProductAdded, onClose }: AddProductFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: 'electronics',
        image: '',
        rating: '4.5'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    rating: parseFloat(formData.rating)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            setFormData({
                title: '',
                price: '',
                description: '',
                category: 'electronics',
                image: '',
                rating: '4.5'
            });

            onProductAdded(); // Refresh parent component
            onClose(); // Close form
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Tambah Product</h2>

                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Harga</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Deskripsi</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-2 py-1 h-20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Kategori</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="food">Food</option>
                            <option value="books">Books</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Link Gambar</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Rating</label>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            min="0"
                            max="5"
                            step="0.1"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-500 text-white rounded px-4 py-2 disabled:bg-gray-400"
                        >
                            {loading ? 'Loading...' : 'Tambah'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-black rounded px-4 py-2"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}