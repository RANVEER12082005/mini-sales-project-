import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/helpers';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = isRegister ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;
      const res = await axios.post(url, form);
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        onLogin(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}
    >
      <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '420px', margin: '20px' }}>
        <div className="card-header text-center py-4 border-0" style={{ backgroundColor: '#1e3a5f' }}>
          <div className="fs-1">🛒</div>
          <h4 className="text-white fw-bold mb-0">Sales Manager</h4>
          <small className="text-white-50">Manage your shops & coupons</small>
        </div>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4 text-center" style={{ color: '#1e3a5f' }}>
            {isRegister ? '📝 Create Account' : '🔐 Sign In'}
          </h5>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                  required={isRegister}
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label fw-bold">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn btn-warning fw-bold w-100 py-2"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isRegister ? '🚀 Create Account' : '🔐 Sign In'}
            </button>
          </form>

          <hr className="my-3" />

          <div className="text-center">
            <span className="text-muted">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              className="btn btn-link p-0 ms-1 fw-bold text-decoration-none"
              style={{ color: '#1e3a5f' }}
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;