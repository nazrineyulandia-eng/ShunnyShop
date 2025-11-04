import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import './styles/header.css';
import Routes from './Routes';

export default function App() {
  const { cart } = useCart();
  const navigate = useNavigate();

  // init from localStorage or default to 5.000.000 (do NOT overwrite on mount)
  const [balance, setBalance] = useState<number>(() => {
    const raw = localStorage.getItem('balance');
    return raw ? Number(raw) : 5000000;
  });

  // persist when balance changes
  useEffect(() => {
    localStorage.setItem('balance', String(balance));
  }, [balance]);

  // listen for external balance updates (e.g. ShoppingCart)
  useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent with detail = newBalance
      const ce = e as CustomEvent<number>;
      if (typeof ce.detail === 'number') setBalance(ce.detail);
    };
    window.addEventListener('balanceChange', handler as EventListener);
    return () => window.removeEventListener('balanceChange', handler as EventListener);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="header-inner container">
          <div className="header-left">
            <Link to="/" className="brand">
              <span className="brand-icon">S</span>
              <span className="brand-name">Shunny Shop</span>
            </Link>
          </div>

          <div className="header-right">
            {/* Tombol Favorites */}
            <button
              type="button"
              className="favorites-button"
              aria-label="Open favorites"
              onClick={() => { navigate('/favorites'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <svg className="favorites-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Tombol Cart */}
            <button
              type="button"
              className="cart-button"
              aria-label="Open cart"
              onClick={() => { navigate('/cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <svg className="cart-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {cart && cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>

            {/* Saldo / Balance */}
            <div className="balance-wrapper" title={`Saldo Anda: Rp ${balance.toLocaleString('id-ID')}`}>
              <div className="balance-label">Saldo Anda</div>
              <div className="balance">Rp {balance.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Routes />
      </main>
    </>
  );
}

