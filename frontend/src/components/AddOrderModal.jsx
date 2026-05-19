import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const AddOrderModal = ({ shop, onClose }) => {
  const { addOrder } = useApp();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d+$/.test(amount)) return;
    setLoading(true);
    const res = await addOrder(shop._id, parseFloat(amount), note);
    setLoading(false);
    if (res.success) setResult(res.data);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#1e3a5f' }}>
            <h5 className="modal-title text-white">📦 Add Order — {shop.shopName}</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {!result ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Order Amount (₹) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-control form-control-lg"
                    placeholder="Enter amount (numbers only)"
                    value={amount}
                    onChange={(e) => { if (/^\d*$/.test(e.target.value)) setAmount(e.target.value); }}
                    required
                  />
                  <small className="text-muted">🎟️ Every ₹5000 generates 1 scratch coupon</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Note (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a note for this order"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-warning fw-bold" disabled={loading}>
                    {loading ? 'Adding...' : '➕ Add Order'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-3">
                <div className="fs-1">🎉</div>
                <h5 className="fw-bold text-success">Order Added!</h5>
                <p className="text-muted">Amount: {formatCurrency(parseFloat(amount))}</p>
                {result.newCoupons?.length > 0 && (
                  <div className="alert alert-warning mt-3">
                    <div className="fs-3">🎟️</div>
                    <strong>{result.newCoupons.length} Scratch Coupon(s) Generated!</strong>
                    <p className="mt-1 mb-0 text-muted small">Go to Coupons to scratch them!</p>
                  </div>
                )}
                <button className="btn btn-primary mt-3" onClick={onClose}>Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrderModal;