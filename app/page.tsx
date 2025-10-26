import { Suspense } from 'react';
import { getProducts } from '@/lib/products';
import { getReviews } from '@/lib/reviews';
import ProductList from '@/components/ProductList';

export default async function Home() {
  const products = await getProducts();
  const reviews = await getReviews();

  // Calculate average ratings and review counts for each product
  const ratingMap = new Map<string, number>();
  const countMap = new Map<string, number>();
  products.forEach(product => {
    const productReviews = reviews.filter(review => review.productId === product.id);
    if (productReviews.length > 0) {
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round((totalRating / productReviews.length) * 10) / 10;
      ratingMap.set(product.id, averageRating);
      countMap.set(product.id, productReviews.length);
    }
  });

  // Add averageRating and reviewCount to products
  const productsWithRatings = products.map(product => ({
    ...product,
    averageRating: ratingMap.get(product.id) || undefined,
    reviewCount: countMap.get(product.id) || undefined,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Keyboard Shop
        </h1>
        <p className="text-xl text-gray-600">
          Discover premium mechanical keyboards for gaming and productivity
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-4">Loading products...</div>}>
        <ProductList initialProducts={productsWithRatings} />
      </Suspense>
    </div>
  );
}
