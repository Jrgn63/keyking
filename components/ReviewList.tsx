'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.map((review: any) => ({
          ...review,
          createdAt: new Date(review.createdAt)
        })));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</span>
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
        </div>
        <span className="text-gray-600">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                {review.author && (
                  <span className="font-medium text-gray-900">{review.author}</span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {review.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
