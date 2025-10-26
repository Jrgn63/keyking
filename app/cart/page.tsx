'use client';

import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import Link from 'next/link';

export default function CartPage() {
  const { state } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some keyboards to get started!</p>
          <Link
            href="/"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {state.items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">
            ${state.total.toFixed(2)}
          </span>
        </div>

        <div className="flex space-x-4">
          <Link
            href="/"
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/checkout"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
