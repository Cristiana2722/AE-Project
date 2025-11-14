import { axiosNoAuth } from "../axios/axiosNoAuth";
import { axiosAuth } from "../axios/axiosAuth";


export const registerUser = async (userData) => {
  try {
    const response = await axiosNoAuth.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return error.response?.data;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axiosAuth.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching user:', err);
    return err.response?.data;
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await axiosAuth.put(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    console.error('Error updating user:', err);
    return err.response?.data;
  }
};
