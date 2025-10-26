'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart();

  const updateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.product.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.product.id, quantity } });
    }
  };

  const removeItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.product.id });
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
      <div className="relative w-16 h-16">
        <Image
          src={item.product.imageUrls[0] || '/placeholder-image.jpg'}
          alt={item.product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-gray-600">
          {item.product.discount && item.product.discount > 0 ? (
            <>
              <span className="line-through">${item.product.price.toFixed(2)}</span>{' '}
              ${(item.product.price * (1 - item.product.discount / 100)).toFixed(2)} each
            </>
          ) : (
            `$${item.product.price.toFixed(2)} each`
          )}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
          className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          {item.product.discount && item.product.discount > 0 ? (
            <>
              <span className="line-through text-sm text-gray-500">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>{' '}
              ${(item.product.price * (1 - item.product.discount / 100) * item.quantity).toFixed(2)}
            </>
          ) : (
            `$${(item.product.price * item.quantity).toFixed(2)}`
          )}
        </p>
        <button
          onClick={removeItem}
          className="text-red-600 hover:text-red-800 mt-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
