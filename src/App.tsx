import React, { useState } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { products } from "./data/products";
import PaymentModal from "./components/PaymentModal";
import Cart from "./components/Cart";
import { upiClient } from "./utils/upigateway";
import { createRequestResponse } from "upigateway";

// Define the CartItem interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [response, setResponse] = useState<createRequestResponse>();
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product: (typeof products)[0]) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // If item exists, increase its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setCart((prevCart) => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total based on price * quantity
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get total number of items (sum of quantities)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleCheckout() {
    setIsCartOpen(false);

    const responsex = await upiClient.createRequest({
      amount: total.toFixed(2),
    });

    setResponse(responsex);

    if (responsex) {
      setIsPaymentModalOpen(true);
    }
  }

  // Handle successful payment
  const handlePaymentSuccess = () => {
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium text-lg">Minimal Store</span>
            </div>
            
            <div className="hidden md:flex items-center relative flex-1 max-w-md mx-8">
              <div className="absolute left-3 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full py-2 pl-10 pr-4 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search for mobile */}
      <div className="md:hidden bg-white px-6 pb-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full py-2 pl-10 pr-4 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-medium mb-8">Featured Products</h1>
        
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-500 mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-medium mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2025 Minimal Store. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        total={total}
        onCheckout={handleCheckout}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        data={response}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default App;