'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const { dispatch } = useCart();

  useEffect(() => {
    // Clear the cart after successful payment
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
        </p>

        <div className="space-y-4">
          <p className="text-gray-700">
            Your keyboards will be shipped within 2-3 business days.
          </p>
          <p className="text-gray-700">
            You can track your order status in your account dashboard.
          </p>
        </div>

        <div className="mt-8 space-x-4">
          <Link
            href="/"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
