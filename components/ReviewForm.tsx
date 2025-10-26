'use client';

import { useState } from 'react';
import { Review, ReviewInput } from '@/types';

interface ReviewFormProps {
  initialData?: Review;
  productId: string;
  onSubmit: (data: ReviewInput) => Promise<void>;
  isEditing?: boolean;
}

export default function ReviewForm({ initialData, productId, onSubmit, isEditing = false }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    productId,
    rating: initialData?.rating || 5,
    text: initialData?.text || '',
    author: initialData?.author || '',
    createdAt: initialData?.createdAt ? new Date(initialData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      // Reset form if adding new
      if (!isEditing) {
        setFormData({
          productId,
          rating: 5,
          text: '',
          author: '',
          createdAt: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      setError('Failed to save review');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'rating') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 5,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">{isEditing ? 'Edit Review' : 'Add New Review'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Review Text</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Write your review here..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Author (Optional)</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="createdAt"
          value={formData.createdAt}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Saving...' : (isEditing ? 'Update Review' : 'Add Review')}
      </button>
    </form>
  );
}
