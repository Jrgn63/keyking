'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface ProductFormProps {
  initialData?: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  onSubmit: (data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    shortDescription: initialData?.shortDescription || '',
    longDescription: initialData?.longDescription || '',
    price: initialData?.price || 0,
    imageUrls: initialData?.imageUrls?.join(', ') || '',
    stock: initialData?.stock || 0,
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    discount: initialData?.discount || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const submitData = {
        ...formData,
        imageUrls: formData.imageUrls.split(',').map((url: string) => url.trim()).filter((url: string) => url),
      };
      await onSubmit(submitData);
      // Reset form if adding new
      if (!isEditing) {
        setFormData({
          name: '',
          shortDescription: '',
          longDescription: '',
          price: 0,
          imageUrls: '',
          stock: 0,
          category: '',
          tags: [],
          discount: 0,
        });
      }
    } catch (err) {
      setError('Failed to save product');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Short Description</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          rows={2}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Long Description</label>
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          step="0.01"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Discount (%)</label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          min="0"
          max="100"
          step="1"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URLs (comma-separated)</label>
        <input
          type="text"
          name="imageUrls"
          value={formData.imageUrls}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
            <div className="flex flex-wrap gap-2">
              {['100%', '87%', '75%', '65%', '60%'].map(size => (
                <label key={size} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(size)}
                    onChange={(e) => handleTagChange(size, e.target.checked)}
                    className="mr-1"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Use</label>
            <div className="flex flex-wrap gap-2">
              {['gaming', 'office', 'programming'].map(use => (
                <label key={use} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(use)}
                    onChange={(e) => handleTagChange(use, e.target.checked)}
                    className="mr-1"
                  />
                  {use}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Others</label>
            <div className="flex flex-wrap gap-2">
              {['rgb', 'ergonomical', 'mechanical'].map(other => (
                <label key={other} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(other)}
                    onChange={(e) => handleTagChange(other, e.target.checked)}
                    className="mr-1"
                  />
                  {other}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Connection</label>
            <div className="flex flex-wrap gap-2">
              {['wired', 'wireless'].map(connection => (
                <label key={connection} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(connection)}
                    onChange={(e) => handleTagChange(connection, e.target.checked)}
                    className="mr-1"
                  />
                  {connection}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
      </button>
    </form>
  );
}
