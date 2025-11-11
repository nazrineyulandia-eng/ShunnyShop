// TODO: Create Home page - product listing with filters and search

import React, { useState } from 'react'; 
import { ProductGrid } from '../components/ProductGrid';
import AddProductForm from '../components/AddProductForm';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
      setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          ➕ Tambah Product
        </button>
      </div>

      {showForm && (
        <AddProductForm
          onProductAdded={handleProductAdded}
          onClose={() => setShowForm(false)}
        />
      )}

      <ProductGrid key={refreshKey} />
    </div>
  );
};

export default Home;
