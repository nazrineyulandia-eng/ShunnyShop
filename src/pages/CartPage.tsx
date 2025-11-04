// TODO: Create CartPage - show shopping cart and checkout

import React from 'react';
import ShoppingCart from '../components/ShoppingCart/ShoppingCart';
import './CartPage.css';


const CartPage: React.FC = () => {
  return (
    <main className="cart-page container">
      <h1>Shopping Cart</h1>
      <ShoppingCart />
    </main>
  );
}

export default CartPage;
