import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STATES_AND_CITIES } from '../utils/helpers';

const AddShopModal = ({ onClose, editData = null }) => {
  const { addShop, updateShop } = useApp();
  const [form, setForm] = useState(editData || {
    shopName: '', telephone: '', location: '',
    address: '', city: '', state: '', town: '',
    beatNo: '', ownerName: '', ownerPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const states = Object.keys(STATES_AND_CITIES).sort();
  const cities = form.state ? STATES_AND_CITIES[form.state] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'telephone' || name === 'ownerPhone') && !/^\d*$/.test(value)) return;
    if (name === 'state') {
      setForm({ ...form, state: value, city: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = editData
      ? await updateShop(editData._id, form)
      : await addShop(form);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError('Failed to save shop. Please try again.');
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, overflowY: 'auto' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable" style={{ margin: '20px auto' }}>
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#1e3a5f' }}>
            <h5 className="modal-title text-white">
              {editData ? '✏️ Edit Shop' : '🏪 Add New Shop'}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Shop Name *</label>
                  <input name="shopName" value={form.shopName} onChange={handleChange}
                    className="form-control" placeholder="Enter shop name" required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Telephone No.</label>
                  <input name="telephone" value={form.telephone} onChange={handleChange}
                    className="form-control" placeholder="Numbers only" maxLength={10}
                    inputMode="numeric" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Owner Name *</label>
                  <input name="ownerName" value={form.ownerName} onChange={handleChange}
                    className="form-control" placeholder="Enter owner name" required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Owner Phone *</label>
                  <input name="ownerPhone" value={form.ownerPhone} onChange={handleChange}
                    className="form-control" placeholder="Numbers only" maxLength={10}
                    inputMode="numeric" required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">State *</label>
                  <select name="state" value={form.state} onChange={handleChange}
                    className="form-select" required>
                    <option value="">-- Select State --</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">City *</label>
                  <select name="city" value={form.city} onChange={handleChange}
                    className="form-select" required disabled={!form.state}>
                    <option value="">-- Select City --</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Town</label>
                  <input name="town" value={form.town} onChange={handleChange}
                    className="form-control" placeholder="Enter town name" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-bold">Beat No.</label>
                  <input name="beatNo" value={form.beatNo} onChange={handleChange}
                    className="form-control" placeholder="Enter beat number" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    className="form-control" placeholder="Enter full address" rows={2} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Location / Landmark</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    className="form-control" placeholder="Nearby landmark" />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  onClick={onClose}
                >
                  ✕ Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning fw-bold flex-grow-1"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editData ? '✏️ Update Shop' : '➕ Add Shop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShopModal;