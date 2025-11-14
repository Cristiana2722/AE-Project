import axiosAuth from "../axios/axiosAuth";

export const addToCart = async (cartData) => {
  try {
    const response = await axiosAuth.post('cart', cartData);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return error.response?.data;
  }
};

export const getCart = async () => {
  try {
    const response = await axiosAuth.get('cart');
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return error.response?.data;
  }
};

export const updateCartItem = async (cartId, updateData) => {
  try {
    const response = await axiosAuth.put(`cart/${cartId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return error.response?.data;
  }
};

export const deleteCartItem = async (cartId) => {
  try {
    const response = await axiosAuth.delete(`cart/${cartId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return error.response?.data;
  }
};

export const clearCart = async () => {
  try {
    const response = await axiosAuth.delete('cart');
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return error.response?.data;
  }
};
