'use client';

import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/products';
import { getReviews, addReview, updateReview, deleteReview } from '@/lib/reviews';
import { Product, Review } from '@/types';
import ProductForm from '@/components/ProductForm';
import ReviewForm from '@/components/ReviewForm';

const ADMIN_PASSWORD = '10e10e1.5';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchReviews();
    }
  }, [isLoggedIn]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.map((review: any) => ({
          ...review,
          createdAt: new Date(review.createdAt)
        })));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setEditingProduct(null);
    setEditingReview(null);
    setSelectedProductId('');
  };

  const handleAddProduct = async (data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_PASSWORD}`,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      fetchProducts();
    } else {
      alert('Failed to add product');
    }
  };

  const handleUpdateProduct = async (data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({ id: editingProduct.id, ...data }),
      });
      if (response.ok) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert('Failed to update product');
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
      });
      if (response.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateReview = async (data: any) => {
    if (editingReview) {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
        body: JSON.stringify({ id: editingReview.id, ...data }),
      });
      if (response.ok) {
        setEditingReview(null);
        fetchReviews();
      } else {
        alert('Failed to update review');
      }
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`,
        },
      });
      if (response.ok) {
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="space-y-4 max-w-md w-full p-6 border rounded">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          {loginError && <p className="text-red-500">{loginError}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <ProductForm onSubmit={handleAddProduct} />
          </div>
          <div>
            {editingProduct && (
              <div>
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <ProductForm
                  initialData={editingProduct}
                  onSubmit={handleUpdateProduct}
                  isEditing
                />
                <button
                  onClick={() => setEditingProduct(null)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Add Review</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedProductId && (
              <ReviewForm
                productId={selectedProductId}
                onSubmit={async (data) => {
                  const response = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${ADMIN_PASSWORD}`,
                    },
                    body: JSON.stringify(data),
                  });
                  if (response.ok) {
                    alert('Review added successfully');
                    fetchReviews();
                  } else {
                    alert('Failed to add review');
                  }
                }}
              />
            )}
            {editingReview && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Edit Review</h3>
                <ReviewForm
                  initialData={editingReview}
                  productId={editingReview.productId}
                  onSubmit={handleUpdateReview}
                  isEditing
                />
                <button
                  onClick={() => setEditingReview(null)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Current Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded">
                <img src={product.imageUrls[0] || '/placeholder-image.jpg'} alt={product.name} className="w-full h-32 object-cover mb-2" />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.shortDescription}</p>
                <p className="text-xs text-gray-500">Tags: {product.tags.join(', ') || 'None'}</p>
                <p className="text-sm">Price: ${product.price}</p>
                <p className="text-sm">Stock: {product.stock}</p>
                <p className="text-sm">Category: {product.category}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => {
              const product = products.find(p => p.id === review.productId);
              return (
                <div key={review.id} className="border p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{product?.name || 'Unknown Product'}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        {review.author && <span className="text-sm text-gray-600">by {review.author}</span>}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.createdAt.toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => setEditingReview(review)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            {reviews.length === 0 && (
              <p className="text-gray-500 text-center py-4">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
