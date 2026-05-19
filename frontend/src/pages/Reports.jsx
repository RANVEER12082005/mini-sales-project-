import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const Reports = () => {
  const { shops } = useApp();
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const states = [...new Set(shops.map(s => s.state).filter(Boolean))].sort();
  const cities = [...new Set(shops.filter(s => !filterState || s.state === filterState).map(s => s.city).filter(Boolean))].sort();

  const filtered = shops.filter(s =>
    (!filterState || s.state === filterState) &&
    (!filterCity || s.city === filterCity)
  );

  const totalEarned = filtered.reduce((s, x) => s + x.totalEarned, 0);
  const totalPaid = filtered.reduce((s, x) => s + x.totalPaid, 0);
  const totalCoupons = filtered.reduce((s, x) => s + x.totalCoupons, 0);
  const totalPending = totalEarned - totalPaid;

  return (
    <div className="container-fluid py-3 px-3">
      <h2 className="fw-bold mb-4" style={{ color: '#1e3a5f' }}>📈 Reports</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select className="form-select" value={filterState}
            onChange={(e) => { setFilterState(e.target.value); setFilterCity(''); }}>
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)} disabled={!filterState}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100"
            onClick={() => { setFilterState(''); setFilterCity(''); }}>
            🔄 Reset Filters
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Shops', value: filtered.length, icon: '🏪', color: 'primary' },
          { label: 'Coupons', value: totalCoupons, icon: '🎟️', color: 'warning' },
          { label: 'Earned', value: formatCurrency(totalEarned), icon: '💰', color: 'success' },
          { label: 'Paid', value: formatCurrency(totalPaid), icon: '✅', color: 'info' },
          { label: 'Pending', value: formatCurrency(totalPending), icon: '⏳', color: 'danger' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md">
            <div className="card border-0 shadow-sm text-center h-100">
              <div className="card-body py-3">
                <div className="fs-2">{s.icon}</div>
                <div className={`fw-bold text-${s.color}`}>{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header fw-bold" style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
          📋 Detailed Report {filterState ? `— ${filterState}` : ''} {filterCity ? `/ ${filterCity}` : ''}
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Shop</th>
                <th>Owner</th>
                <th>City</th>
                <th>State</th>
                <th>Beat</th>
                <th>Coupons</th>
                <th>Earned</th>
                <th>Paid</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-4 text-muted">No shops found</td></tr>
              ) : (
                filtered.map((shop, i) => (
                  <tr key={shop._id}>
                    <td>{i + 1}</td>
                    <td className="fw-bold">{shop.shopName}</td>
                    <td>{shop.ownerName}</td>
                    <td>{shop.city}</td>
                    <td>{shop.state}</td>
                    <td>{shop.beatNo}</td>
                    <td><span className="badge bg-warning text-dark">{shop.totalCoupons}</span></td>
                    <td className="text-success fw-bold">{formatCurrency(shop.totalEarned)}</td>
                    <td className="text-info fw-bold">{formatCurrency(shop.totalPaid)}</td>
                    <td className="text-danger fw-bold">{formatCurrency(shop.totalEarned - shop.totalPaid)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;