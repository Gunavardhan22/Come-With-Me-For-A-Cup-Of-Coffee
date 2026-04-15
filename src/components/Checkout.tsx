import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  onBack: () => void;
}

export default function Checkout({ onBack }: CheckoutProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = getTotalPrice();
  const subtotal = total;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const grandTotal = Number((subtotal + tax).toFixed(2));

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ total_amount: grandTotal, status: 'completed' }])
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.coffee.id,
        product_name: item.coffee.name,
        quantity: item.quantity,
        unit_price: item.coffee.price,
        product_type: item.coffee.category || 'product'
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      alert(`Order placed successfully! Total: $${grandTotal.toFixed(2)}`);
      clearCart();
      onBack();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Shop</span>
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>

              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
                  <button
                    onClick={onBack}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.coffee.id} className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 hover:border-amber-400 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <img
                          src={item.coffee.image_url}
                          alt={item.coffee.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{item.coffee.name}</h3>
                          <p className="text-amber-600 font-semibold">${item.coffee.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.coffee.id, item.quantity - 1)}
                            className="text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.coffee.id, item.quantity + 1)}
                            className="text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="font-bold text-gray-800 w-20 text-right">
                          ${(Number(item.coffee.price) * item.quantity).toFixed(2)}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.coffee.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-amber-600">${grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Stripe
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span>100% satisfaction guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
