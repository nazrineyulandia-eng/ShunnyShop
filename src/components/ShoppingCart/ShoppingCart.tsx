// TODO: Create ShoppingCart component (display cart items)

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ShoppingCart.css';

type CartItem = {
  id: number | string;
  title?: string;
  image?: string;
  price?: number;
  quantity?: number;
};

export default function ShoppingCart(): JSX.Element {
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalPrimaryLabel, setModalPrimaryLabel] = useState('OK');

  // key to force remount modal so it can open multiple times reliably
  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      cart.forEach((it: CartItem) => {
        const key = String(it.id);
        next[key] = prev[key] ?? false;
      });
      return next;
    });
  }, [cart]);

  const toggleOne = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const allSelected = useMemo(() => {
    if (!cart || cart.length === 0) return false;
    return cart.every((it: CartItem) => !!selected[String(it.id)]);
  }, [cart, selected]);

  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    const target = !allSelected;
    cart.forEach((it: CartItem) => (next[String(it.id)] = target));
    setSelected(next);
  };

  const selectedItems = useMemo(
    () => cart.filter((it: CartItem) => selected[String(it.id)]),
    [cart, selected]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (s: number, it: CartItem) => s + Number(it.price ?? 0) * (it.quantity ?? 1),
        0
      ),
    [selectedItems]
  );

  const showModal = (title: string, body: string, primaryLabel = 'OK') => {
    setModalTitle(title);
    setModalBody(body);
    setModalPrimaryLabel(primaryLabel);
    setModalKey((k) => k + 1); // change key each time
    setModalOpen(true);
  };

  const handleCheckout = () => {
    console.log('Checkout', selectedItems, subtotal);
    
    if (selectedItems.length === 0) {
      showModal('No items selected', 'Please select at least one item to checkout.');
      return;
    }

    const currentBalance = Number(localStorage.getItem('balance') ?? 5000000);
    if (currentBalance < subtotal) {
      showModal('Insufficient balance', `Your balance is not enough. Required: Rp ${subtotal.toLocaleString('id-ID')}`);
      return;
    }

    const newBalance = currentBalance - subtotal;
    localStorage.setItem('balance', String(newBalance));
    window.dispatchEvent(new CustomEvent('balanceChange', { detail: newBalance }));

    // show modal first (so modal appears even if cart becomes empty after removal)
    showModal(
      'Checkout successful',
      `${selectedItems.length} item(s) purchased.\nTotal: Rp ${subtotal.toLocaleString('id-ID')}\nRemaining balance: Rp ${newBalance.toLocaleString('id-ID')}`,
      'Done'
    );

    // then remove items from cart
    if (typeof removeFromCart === 'function') {
      selectedItems.forEach((it: CartItem) => removeFromCart(it.id as string | number));
    }
  };

  const isEmpty = !cart || cart.length === 0;

  return (
    <>
      {isEmpty ? (
        <div className="shopping-cart-empty">Cart is empty</div>
      ) : (
        <section className="shopping-cart">
          <div className="cart-controls">
            <label className="select-all">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all items" />
              Select all
            </label>

            <div className="cart-summary" aria-live="polite">
              <div className="subtotal-label">Subtotal</div>
              <div className="subtotal-value">Rp {subtotal.toLocaleString('id-ID')}</div>
              <button type="button" className="btn-checkout" disabled={subtotal === 0} onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>

          <ul className="cart-list">
            {cart.map((it: CartItem) => {
              const id = String(it.id);
              return (
                <li key={id} className="cart-row">
                  <label className="cart-checkbox">
                    <input type="checkbox" checked={!!selected[id]} onChange={() => toggleOne(id)} aria-label={`Select ${it.title}`} />
                  </label>

                  <div className="cart-thumb">
                    {it.image ? <img src={it.image} alt={it.title} /> : <div className="img-placeholder">No image</div>}
                  </div>

                  <div className="cart-info">
                    <div className="cart-title">{it.title}</div>
                    <div className="cart-meta">
                      <div className="cart-qty" aria-label={`Quantity of ${it.title}`}>
                        {typeof updateQuantity === 'function' ? (
                          <>
                            <button type="button" onClick={() => updateQuantity(it.id as string | number, Math.max(1, (it.quantity ?? 1) - 1))} aria-label="Decrease quantity">−</button>
                            <input type="number" value={it.quantity ?? 1} readOnly aria-readonly />
                            <button type="button" onClick={() => updateQuantity(it.id as string | number, (it.quantity ?? 1) + 1)} aria-label="Increase quantity">+</button>
                          </>
                        ) : (
                          <span>Qty: {it.quantity ?? 1}</span>
                        )}
                      </div>

                      <div className="cart-price">Rp {Number(it.price ?? 0).toLocaleString('id-ID')}</div>
                    </div>
                  </div>

                  <div className="cart-actions">
                    <button type="button" className="btn-remove" onClick={() => typeof removeFromCart === 'function' && removeFromCart(it.id as string | number)}>
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {modalOpen && (
        <div className="sc-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setModalOpen(false)}>
          <div className="sc-modal" key={modalKey} onClick={(e) => e.stopPropagation()}>
            <div className="sc-modal-header">
              <h3>{modalTitle}</h3>
            </div>
            <div className="sc-modal-body">
              {modalBody.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="sc-modal-actions">
              <button className="sc-btn sc-btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
              <button className="sc-btn sc-btn-primary" onClick={() => setModalOpen(false)}>{modalPrimaryLabel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
