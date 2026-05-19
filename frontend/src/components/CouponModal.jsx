import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ── Scratch Card Component ──────────────────────────────────────────
const ScratchCard = ({ coupon, onScratched }) => {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(coupon.isScratched);
  const [revealedAmount, setRevealedAmount] = useState(coupon.isScratched ? coupon.amount : null);
  const doneRef = useRef(coupon.isScratched);

  useEffect(() => {
    if (coupon.isScratched) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Silver scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#b0b0b0');
    gradient.addColorStop(0.5, '#d8d8d8');
    gradient.addColorStop(1, '#b0b0b0');
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 10);
    ctx.fill();

    // Coin icons
    ctx.font = '18px Arial';
    ctx.fillText('🪙', 14, 30);
    ctx.fillText('🪙', canvas.width - 34, 30);
    ctx.fillText('🪙', 14, canvas.height - 10);
    ctx.fillText('🪙', canvas.width - 34, canvas.height - 10);

    // Text
    ctx.fillStyle = '#555';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = '11px Arial';
    ctx.fillStyle = '#777';
    ctx.fillText('to reveal your prize!', canvas.width / 2, canvas.height / 2 + 10);
  }, [coupon.isScratched]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const doScratch = (e) => {
    if (!isScratching || revealed || doneRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratched percentage
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
    }
    const pct = (transparent / (data.length / 4)) * 100;

    if (pct > 50 && !doneRef.current) {
      doneRef.current = true;
      setRevealed(true);
      onScratched(coupon._id, (amount) => {
        setRevealedAmount(amount);
      });
    }
  };

  // Already scratched — show prize directly
  if (coupon.isScratched) {
    return (
      <div style={{
        height: 110,
        background: 'linear-gradient(135deg, #fff8e1, #ffe082)',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #f0a500',
      }}>
        <div style={{ fontSize: 26 }}>🎉</div>
        <div style={{ fontWeight: 'bold', fontSize: 28, color: '#e53935' }}>
          ₹{coupon.amount}
        </div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Prize Won!</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: 110, borderRadius: 10, overflow: 'hidden' }}>
      {/* Prize layer underneath */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #fff8e1, #ffe082)',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #f0a500',
      }}>
        {revealed && revealedAmount ? (
          <>
            <div style={{ fontSize: 26 }}>🎉</div>
            <div style={{ fontWeight: 'bold', fontSize: 28, color: '#e53935' }}>
              ₹{revealedAmount}
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Prize Won!</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28 }}>🎁</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Revealing...</div>
          </>
        )}
      </div>

      {/* Scratch canvas on top */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          width={300}
          height={110}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: 10,
            touchAction: 'none',
            cursor: 'crosshair',
            zIndex: 2,
          }}
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onMouseMove={doScratch}
          onTouchStart={(e) => { e.preventDefault(); setIsScratching(true); }}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={doScratch}
        />
      )}
    </div>
  );
};

// ── Coupon Modal ────────────────────────────────────────────────────
const CouponModal = ({ shop, onClose }) => {
  const { getCoupons, scratchCoupon, redeemCoupon } = useApp();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setLoading(true);
    const res = await getCoupons(shop._id);
    if (res.success) setCoupons(res.data);
    setLoading(false);
  };

  // Called when canvas is scratched enough
  const handleScratched = async (couponId, onReveal) => {
    const res = await scratchCoupon(couponId);
    if (res.success) {
      const amount = res.data.data.amount;
      // 1. Show prize on the card immediately
      onReveal(amount);
      // 2. Update coupons state instantly — stats recalculate automatically
      setCoupons(prev => prev.map(c =>
        c._id === couponId
          ? { ...c, isScratched: true, amount }
          : c
      ));
    }
  };

  // Called when "Mark as Paid" is clicked
  const handleRedeem = async (couponId) => {
    const res = await redeemCoupon(couponId);
    if (res.success) {
      setCoupons(prev => prev.map(c =>
        c._id === couponId
          ? { ...c, isRedeemed: true }
          : c
      ));
    }
  };

  // Stats — recalculate every render from coupons state (instant!)
  const totalCoupons   = coupons.length;
  const unscratched    = coupons.filter(c => !c.isScratched).length;
  const totalEarned    = coupons.filter(c => c.isScratched).reduce((s, c) => s + (c.amount || 0), 0);
  const totalPaid      = coupons.filter(c => c.isRedeemed).reduce((s, c) => s + (c.amount || 0), 0);
  const pending        = totalEarned - totalPaid;

  const stats = [
    { label: 'Total',       value: totalCoupons,    color: '#1e3a5f', icon: '🎟️' },
    { label: 'Unscratched', value: unscratched,      color: '#888',    icon: '🪙' },
    { label: 'Earned',      value: `₹${totalEarned}`,color: '#28a745', icon: '💰' },
    { label: 'Paid',        value: `₹${totalPaid}`,  color: '#17a2b8', icon: '✅' },
    { label: 'Pending',     value: `₹${pending}`,    color: '#dc3545', icon: '⏳' },
  ];

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1050, overflowY: 'auto' }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-scrollable"
        style={{ margin: '10px auto', maxWidth: 720 }}
      >
        <div className="modal-content" style={{ borderRadius: 14 }}>

          {/* Header */}
          <div
            className="modal-header border-0"
            style={{ backgroundColor: '#1e3a5f', borderRadius: '14px 14px 0 0' }}
          >
            <div>
              <h5 className="modal-title text-white fw-bold mb-0">🎟️ {shop.shopName}</h5>
              <small className="text-white-50">{shop.city} · Beat {shop.beatNo}</small>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-3">

            {/* Stats bar — updates instantly on scratch/redeem */}
            <div className="row g-2 mb-4">
              {stats.map((s, i) => (
                <div key={i} className="col">
                  <div
                    className="text-center py-2 px-1 rounded"
                    style={{ backgroundColor: '#f8f9fa', transition: 'all 0.3s' }}
                  >
                    <div style={{ fontSize: 18 }}>{s.icon}</div>
                    <div
                      className="fw-bold"
                      style={{ color: s.color, fontSize: 14, transition: 'all 0.3s' }}
                    >
                      {s.value}
                    </div>
                    <small className="text-muted" style={{ fontSize: 10 }}>{s.label}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons grid */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning"></div>
                <div className="mt-2 text-muted">Loading coupons...</div>
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: 48 }}>🎟️</div>
                <p className="mt-2">No coupons yet.</p>
                <small>Add orders worth ₹5000 to generate coupons!</small>
              </div>
            ) : (
              <div className="row g-3">
                {coupons.map(coupon => (
                  <div key={coupon._id} className="col-12 col-sm-6">
                    <div
                      className="card h-100"
                      style={{
                        border: `2px solid ${coupon.isRedeemed ? '#28a745' : coupon.isScratched ? '#f0a500' : '#ccc'}`,
                        borderRadius: 12,
                        opacity: coupon.isRedeemed ? 0.75 : 1,
                        transition: 'all 0.3s',
                      }}
                    >
                      <div className="card-body p-3">
                        {/* Coupon header */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted fw-bold">
                            #{coupon._id.slice(-5).toUpperCase()}
                          </small>
                          {coupon.isRedeemed
                            ? <span className="badge bg-success">✅ Paid</span>
                            : coupon.isScratched
                            ? <span className="badge bg-warning text-dark">🎉 Scratched</span>
                            : <span className="badge bg-secondary">🪙 Scratch Me!</span>
                          }
                        </div>

                        {/* Scratch card */}
                        <ScratchCard coupon={coupon} onScratched={handleScratched} />

                        {/* Pay button — only after scratched and not yet paid */}
                        {coupon.isScratched && !coupon.isRedeemed && (
                          <button
                            className="btn btn-warning fw-bold w-100 mt-2"
                            style={{ borderRadius: 8 }}
                            onClick={() => handleRedeem(coupon._id)}
                          >
                            💰 Mark as Paid — ₹{coupon.amount}
                          </button>
                        )}

                        {coupon.isRedeemed && (
                          <div
                            className="text-center mt-2 py-1 rounded fw-bold"
                            style={{ backgroundColor: '#d4edda', color: '#155724', fontSize: 13 }}
                          >
                            ✅ ₹{coupon.amount} Paid
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="modal-footer border-0 pt-0"
            style={{ borderRadius: '0 0 14px 14px' }}
          >
            <button className="btn btn-secondary w-100" onClick={onClose}>
              ✕ Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CouponModal;