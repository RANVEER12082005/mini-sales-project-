import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AddOrderModal from '../components/AddOrderModal';
import { formatCurrency } from '../utils/helpers';

const Orders = () => {
  const { shops, getOrders } = useApp();
  const [selectedShop, setSelectedShop] = useState(null);
  const [orderModal, setOrderModal] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = shops.filter(s =>
    s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewHistory = async (shop) => {
    setSelectedShop(shop);
    setLoadingOrders(true);
    const res = await getOrders(shop._id);
    if (res.success) setOrders(res.data);
    setLoadingOrders(false);
  };

  return (
    <div className="container-fluid py-3 px-3">
      <h2 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>📦 Orders</h2>

      <input className="form-control mb-3"
        placeholder="🔍 Search shop..."
        value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header fw-bold" style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              🏪 Select Shop
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Shop</th>
                      <th>City</th>
                      <th>Coupons</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(shop => (
                      <tr key={shop._id} className={selectedShop?._id === shop._id ? 'table-warning' : ''}>
                        <td className="fw-bold">{shop.shopName}</td>
                        <td>{shop.city}</td>
                        <td><span className="badge bg-warning text-dark">{shop.totalCoupons}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-warning" onClick={() => setOrderModal(shop)}>➕</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewHistory(shop)}>📋</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header fw-bold" style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              📋 {selectedShop ? `Order History — ${selectedShop.shopName}` : 'Select a shop to view history'}
            </div>
            <div className="card-body p-0">
              {loadingOrders ? (
                <div className="text-center py-4"><div className="spinner-border text-warning"></div></div>
              ) : !selectedShop ? (
                <div className="text-center py-4 text-muted">Click 📋 on a shop to view orders</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-4 text-muted">No orders yet for this shop</div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Amount</th>
                        <th>Note</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr key={order._id}>
                          <td>{i + 1}</td>
                          <td className="fw-bold text-success">{formatCurrency(order.amount)}</td>
                          <td>{order.note || '—'}</td>
                          <td className="text-muted small">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan={2} className="fw-bold">
                          Total: {formatCurrency(orders.reduce((s, o) => s + o.amount, 0))}
                        </td>
                        <td colSpan={2} className="text-muted">{orders.length} orders</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {orderModal && <AddOrderModal shop={orderModal} onClose={() => { setOrderModal(null); if (selectedShop?._id === orderModal._id) handleViewHistory(orderModal); }} />}
    </div>
  );
};

export default Orders;