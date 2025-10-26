'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  initialProducts: Product[];
}

function ProductListContent({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL params on mount and update products accordingly
    const urlParams = new URLSearchParams(searchParams.toString());
    if (urlParams.toString()) {
      fetchProducts(urlParams);
    } else {
      setProducts(initialProducts);
    }
  }, [initialProducts, searchParams]);

  const fetchProducts = async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div className="text-center py-4">Loading...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductList({ initialProducts }: ProductListProps) {
  return <ProductListContent initialProducts={initialProducts} />;
}
