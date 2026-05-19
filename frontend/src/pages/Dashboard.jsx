import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { shops, loading } = useApp();

  const totalShops = shops.length;
  const totalCoupons = shops.reduce((s, x) => s + x.totalCoupons, 0);
  const totalEarned = shops.reduce((s, x) => s + x.totalEarned, 0);
  const totalPaid = shops.reduce((s, x) => s + x.totalPaid, 0);
  const totalPending = totalEarned - totalPaid;

  const stats = [
    { label: 'Total Shops', value: totalShops, icon: '🏪', color: '#1e3a5f' },
    { label: 'Total Coupons', value: totalCoupons, icon: '🎟️', color: '#f0a500' },
    { label: 'Total Earned', value: formatCurrency(totalEarned), icon: '💰', color: '#28a745' },
    { label: 'Total Paid', value: formatCurrency(totalPaid), icon: '✅', color: '#17a2b8' },
    { label: 'Pending', value: formatCurrency(totalPending), icon: '⏳', color: '#dc3545' },
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container-fluid py-3 px-3">
      <h2 className="fw-bold mb-4" style={{ color: '#1e3a5f' }}>📊 Dashboard</h2>

      <div className="row g-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="col-6 col-md-4 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3">
                <div className="fs-2">{stat.icon}</div>
                <div className="fw-bold fs-5" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-muted small">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header fw-bold" style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
          🏆 Shop Rankings by Coupons
        </div>
        {shops.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            <div className="fs-1">🏪</div>
            <p>No shops yet.</p>
            <Link to="/shops" className="btn btn-warning fw-bold">➕ Add First Shop</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Shop</th>
                  <th>Owner</th>
                  <th>City</th>
                  <th>Beat</th>
                  <th>Coupons</th>
                  <th>Earned</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {[...shops].sort((a, b) => b.totalCoupons - a.totalCoupons).map((shop, i) => (
                  <tr key={shop._id}>
                    <td>{i + 1}</td>
                    <td className="fw-bold">{shop.shopName}</td>
                    <td>{shop.ownerName}</td>
                    <td>{shop.city}</td>
                    <td>{shop.beatNo}</td>
                    <td><span className="badge bg-warning text-dark">{shop.totalCoupons}</span></td>
                    <td className="text-success fw-bold">{formatCurrency(shop.totalEarned)}</td>
                    <td className="text-info fw-bold">{formatCurrency(shop.totalPaid)}</td>
                    <td className="text-danger fw-bold">{formatCurrency(shop.totalEarned - shop.totalPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;