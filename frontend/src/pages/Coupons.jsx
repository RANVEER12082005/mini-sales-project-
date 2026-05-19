import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CouponModal from '../components/CouponModal';
import { formatCurrency } from '../utils/helpers';

const Coupons = () => {
  const { shops } = useApp();
  const [selectedShop, setSelectedShop] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = shops.filter(s =>
    s.shopName?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-3 px-3">
      <h2 className="fw-bold mb-3" style={{ color: '#1e3a5f' }}>🎟️ Coupons</h2>

      <input className="form-control mb-3"
        placeholder="🔍 Search shop..."
        value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="row g-3">
        {filtered.map(shop => (
          <div key={shop._id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="fw-bold">{shop.shopName}</h6>
                <div className="text-muted small mb-3">{shop.city} | Beat {shop.beatNo}</div>
                <div className="row g-2 text-center mb-3">
                  <div className="col-4">
                    <div className="bg-warning bg-opacity-25 rounded p-1">
                      <div className="fw-bold">{shop.totalCoupons}</div>
                      <small>Total</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-success bg-opacity-25 rounded p-1">
                      <div className="fw-bold small">{formatCurrency(shop.totalEarned)}</div>
                      <small>Earned</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-info bg-opacity-25 rounded p-1">
                      <div className="fw-bold small">{formatCurrency(shop.totalPaid)}</div>
                      <small>Paid</small>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-danger fw-bold small">⏳ {formatCurrency(shop.totalEarned - shop.totalPaid)}</span>
                  <button className="btn btn-sm btn-warning fw-bold" onClick={() => setSelectedShop(shop)}>
                    🎟️ View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedShop && <CouponModal shop={selectedShop} onClose={() => setSelectedShop(null)} />}
    </div>
  );
};

export default Coupons;