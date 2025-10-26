'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  initialProducts: Product[];
}

function ProductListContent({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState<string>(searchParams.get('sortBy') && searchParams.get('sortOrder') ? `${searchParams.get('sortBy')}-${searchParams.get('sortOrder')}` : 'createdAt-desc');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category') || null);
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get('tags')?.split(',').filter(Boolean) || []);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories and tags from initialProducts
  const uniqueCategories = Array.from(new Set(initialProducts.map(p => p.category)));
  const uniqueTags = Array.from(new Set(initialProducts.flatMap(p => p.tags)));

  // Define tag sections
  const tagSections = {
    'Size': ['100%', '87%', '75%', '65%', '60%'],
    'Use': ['gaming', 'office', 'programming'],
    'Others': ['rgb', 'ergonomical', 'mechanical'],
    'Connection': ['wired', 'wireless']
  };

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

  const updateParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    updateParams({ search: value || undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);
    const [sortBy, sortOrder] = value.split('-');
    updateParams({ sortBy, sortOrder });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value === 'all' ? null : value);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags(prev => [...prev, tag]);
    } else {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    }
  };

  const applyFilters = () => {
    const tagsStr = selectedTags.length > 0 ? selectedTags.join(',') : undefined;
    updateParams({ category: selectedCategory || undefined, tags: tagsStr });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    updateParams({ category: undefined, tags: undefined });
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    updateParams({ category: undefined, tags: undefined });
  };

  return (
    <div>
      {/* Controls: Search, Sort, Filters in a row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 relative">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            Filters
          </button>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-red-200 text-red-700 rounded-md hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap"
          >
            Clear All
          </button>
        </div>
        {showFilters && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-10">
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                value={selectedCategory || 'all'}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="space-y-2">
                {Object.entries(tagSections).map(([sectionName, sectionTags]) => {
                  const availableTags = uniqueTags.filter(tag => sectionTags.includes(tag));
                  if (availableTags.length === 0) return null;
                  return (
                    <div key={sectionName}>
                      <h4 className="text-xs font-semibold text-gray-600 uppercase mb-1">{sectionName}</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                          <label key={tag} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={(e) => handleTagChange(tag, e.target.checked)}
                              className="mr-2"
                            />
                            {tag}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {uniqueTags.filter(tag => !Object.values(tagSections).flat().includes(tag)).length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-600 uppercase mb-1">Other</h4>
                    <div className="flex flex-wrap gap-2">
                      {uniqueTags.filter(tag => !Object.values(tagSections).flat().includes(tag)).map(tag => (
                        <label key={tag} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={(e) => handleTagChange(tag, e.target.checked)}
                            className="mr-2"
                          />
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

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
