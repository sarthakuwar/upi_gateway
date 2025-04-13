import React from 'react';
import { X } from 'lucide-react';
import { products } from '../data/products';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: typeof products;
  removeFromCart: (id: number) => void;
  total: number;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cart,
  removeFromCart,
  total,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-4 pb-4 border-b border-gray-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-gray-100 rounded-full h-fit"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;