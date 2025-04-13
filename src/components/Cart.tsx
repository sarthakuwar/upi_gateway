import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

// New interface for cart items with quantity
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  total: number;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  total,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 transition-all duration-300">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-medium">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 mb-6 pb-6 border-b border-gray-100"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">₹{item.price.toFixed(2)}</p>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center mt-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="mx-3 text-sm font-medium text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-800">Free</span>
                </div>
                <div className="flex justify-between items-center text-lg pt-2 border-t border-gray-100">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">₹{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
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