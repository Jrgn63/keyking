'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <button
      onClick={addToCart}
      disabled={product.stock === 0}
      className="w-full md:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
    >
      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
}
