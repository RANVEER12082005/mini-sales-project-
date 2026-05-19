import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/helpers';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/shops`, getHeaders());
      setShops(res.data.data);
    } catch (err) {
      console.error('Failed to fetch shops', err);
    } finally {
      setLoading(false);
    }
  };

  const addShop = async (shopData) => {
    try {
      const res = await axios.post(`${API_URL}/shops`, shopData, getHeaders());
      await fetchShops();
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateShop = async (id, shopData) => {
    try {
      const res = await axios.put(`${API_URL}/shops/${id}`, shopData, getHeaders());
      await fetchShops();
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteShop = async (id) => {
    try {
      await axios.delete(`${API_URL}/shops/${id}`, getHeaders());
      await fetchShops();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  const addOrder = async (shopId, amount, note) => {
    try {
      const res = await axios.post(`${API_URL}/orders`, { shopId, amount, note }, getHeaders());
      await fetchShops();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const getOrders = async (shopId) => {
    try {
      const res = await axios.get(`${API_URL}/orders/shop/${shopId}`, getHeaders());
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const getCoupons = async (shopId) => {
    try {
      const res = await axios.get(`${API_URL}/coupons/shop/${shopId}`, getHeaders());
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const scratchCoupon = async (couponId) => {
    try {
      const res = await axios.put(`${API_URL}/coupons/scratch/${couponId}`, {}, getHeaders());
      // Refresh shops in background so card stats update too
      fetchShops();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const redeemCoupon = async (couponId) => {
    try {
      const res = await axios.put(`${API_URL}/coupons/redeem/${couponId}`, {}, getHeaders());
      // Refresh shops in background
      fetchShops();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) fetchShops();
  }, []);

  return (
    <AppContext.Provider value={{
      shops, loading,
      fetchShops, addShop, updateShop, deleteShop,
      addOrder, getOrders,
      getCoupons, scratchCoupon, redeemCoupon
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);