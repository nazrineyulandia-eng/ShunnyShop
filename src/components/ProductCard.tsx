type ProductCardProps = {
    id: number;
    title: string;
    image: string;
    price: number;
    rating: number;
    onDelete?: (id: number) => void;
};

export default function ProductCard({ id, title, image, price, rating, onDelete }: ProductCardProps) {
    const handleDelete = async () => {
        if (window.confirm('Yakin ingin menghapus product ini?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    onDelete?.(id);
                    alert('Product berhasil dihapus');
                } else {
                    alert('Gagal menghapus product');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error menghapus product');
            }
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-bold truncate">{title}</h3>
                <p className="text-red-500 font-bold text-lg">${price}</p>
                <div className="flex justify-between items-center mt-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                        Add to Cart
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
}