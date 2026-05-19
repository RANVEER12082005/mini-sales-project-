import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AddShopModal from '../components/AddShopModal';
import AddOrderModal from '../components/AddOrderModal';
import CouponModal from '../components/CouponModal';
import { formatCurrency } from '../utils/helpers';

const Shops = () => {
  const { shops, loading, deleteShop } = useApp();
  const [showAddShop, setShowAddShop] = useState(false);
  const [editShop, setEditShop] = useState(null);
  const [orderShop, setOrderShop] = useState(null);
  const [couponShop, setCouponShop] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedShop, setExpandedShop] = useState(null);

  const filtered = shops.filter(s =>
    s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase()) ||
    s.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
    s.beatNo?.toString().includes(search)
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container-fluid py-3 px-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0 fs-5" style={{ color: '#1e3a5f' }}>
          🏪 Shops ({shops.length})
        </h2>
        <button
          className="btn btn-warning fw-bold btn-sm"
          onClick={() => setShowAddShop(true)}
        >
          ➕ Add Shop
        </button>
      </div>

      {/* Search */}
      <input
        className="form-control mb-3"
        placeholder="🔍 Search by name, city, owner or beat no..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Shop List */}
      {filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div className="fs-1">🏪</div>
          <p>No shops found.</p>
          <button className="btn btn-warning fw-bold" onClick={() => setShowAddShop(true)}>
            ➕ Add First Shop
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(shop => (
            <div key={shop._id} className="card border-0 shadow-sm">
              {/* Shop Header - always visible */}
              <div
                className="card-header border-0 d-flex justify-content-between align-items-center"
                style={{ backgroundColor: '#1e3a5f', color: 'white', cursor: 'pointer', borderRadius: expandedShop === shop._id ? '12px 12px 0 0' : '12px' }}
                onClick={() => setExpandedShop(expandedShop === shop._id ? null : shop._id)}
              >
                <div>
                  <span className="fw-bold">🏪 {shop.shopName}</span>
                  <span className="badge bg-warning text-dark ms-2">Beat {shop.beatNo}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark">{shop.totalCoupons} 🎟️</span>
                  <span>{expandedShop === shop._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Shop Details - expandable */}
              {expandedShop === shop._id && (
                <div className="card-body">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <small className="text-muted">👤 Owner</small>
                      <div className="fw-bold">{shop.ownerName}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">📞 Phone</small>
                      <div className="fw-bold">
                        <a href={`tel:${shop.ownerPhone}`} className="text-decoration-none">
                          {shop.ownerPhone}
                        </a>
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">📍 City</small>
                      <div>{shop.city}, {shop.state}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">🏘️ Town</small>
                      <div>{shop.town || '—'}</div>
                    </div>
                    <div className="col-12">
                      <small className="text-muted">📫 Address</small>
                      <div>{shop.address || '—'}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="row g-2 mb-3 text-center">
                    <div className="col-4">
                      <div className="bg-warning bg-opacity-25 rounded p-2">
                        <div className="fw-bold">{shop.totalCoupons}</div>
                        <small>Coupons</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="bg-success bg-opacity-25 rounded p-2">
                        <div className="fw-bold small">{formatCurrency(shop.totalEarned)}</div>
                        <small>Earned</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="bg-danger bg-opacity-25 rounded p-2">
                        <div className="fw-bold small">{formatCurrency(shop.totalEarned - shop.totalPaid)}</div>
                        <small>Pending</small>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        className="btn btn-warning fw-bold w-100"
                        onClick={() => setOrderShop(shop)}
                      >
                        📦 Add Order
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-primary fw-bold w-100"
                        onClick={() => setCouponShop(shop)}
                      >
                        🎟️ Coupons
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => setEditShop(shop)}
                      >
                        ✏️ Edit Shop
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() => {
                          if (window.confirm(`Delete "${shop.shopName}"?`)) deleteShop(shop._id);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddShop && <AddShopModal onClose={() => setShowAddShop(false)} />}
      {editShop && <AddShopModal editData={editShop} onClose={() => setEditShop(null)} />}
      {orderShop && <AddOrderModal shop={orderShop} onClose={() => setOrderShop(null)} />}
      {couponShop && <CouponModal shop={couponShop} onClose={() => setCouponShop(null)} />}
    </div>
  );
};

export default Shops;