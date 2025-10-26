'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48">
          <Image
            src={product.imageUrls[0] || '/placeholder-image.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.shortDescription}
        </p>
        {product.averageRating && product.reviewCount && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.floor(product.averageRating!) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.averageRating.toFixed(1)} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto">
          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-2"
          >
            Add to Cart
          </button>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-sm text-red-600 font-semibold">
                    {product.discount}% off
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
