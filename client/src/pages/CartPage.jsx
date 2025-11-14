import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCart, updateCartItem, deleteCartItem, clearCart } from '../api/cart.routes';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      if (res?.success) {
        setCart(res.data);
        if (!res.data.items || res.data.items.length === 0) {
          navigate('/products');
        }
      } else {
        toast.error(res?.message || 'Failed to load cart');
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching cart');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      setUpdatingId(cartItemId);
      const res = await updateCartItem(cartItemId, { quantity });
      if (res?.success) {
        fetchCart();
        toast.success('Cart updated');
      } else {
        toast.error(res?.message || 'Failed to update cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating cart');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      setUpdatingId(cartItemId);
      const res = await deleteCartItem(cartItemId);
      if (res?.success) {
        const updatedItems = cart.items.filter((item) => item.cart_id !== cartItemId);
        setCart({ ...cart, items: updatedItems });
        toast.success('Item removed from cart');

        if (updatedItems.length === 0) {
          navigate('/products');
        }
      } else {
        toast.error(res?.message || 'Failed to remove item');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error removing item');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await clearCart();
      if (res?.success) {
        setCart({ items: [] });
        toast.success('Cart cleared');
        navigate('/products');
      } else {
        toast.error(res?.message || 'Failed to clear cart');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error clearing cart');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Your Cart</h2>

      <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-4 lg:gap-x-8">
        <div className="lg:col-span-3">
          {cart.items.map((item) => (
            <div key={item.cart_id} className="flex items-center border-b border-gray-200 py-4">
              <img
                src={item.product.image || 'https://via.placeholder.com/150'}
                alt={item.product.name}
                className="h-24 w-24 rounded-md object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-500">{item.product.category}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">${item.product.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    disabled={updatingId === item.cart_id}
                    onClick={() =>
                      handleQuantityChange(item.cart_id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    disabled={updatingId === item.cart_id}
                    onClick={() =>
                      handleQuantityChange(item.cart_id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                  <button
                    disabled={updatingId === item.cart_id}
                    onClick={() => handleRemoveItem(item.cart_id)}
                    className="ml-4 text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 border border-gray-200 rounded-md p-4 h-fit">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={() => toast('Checkout not implemented')}
            className="mt-4 w-full rounded-md px-4 py-2 text-white bg-rose-400 hover:bg-rose-600"
          >
            Checkout
          </button>
          <button
            onClick={handleClearCart}
            className="mt-2 w-full rounded-md border border-red-500 text-red-500 hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
