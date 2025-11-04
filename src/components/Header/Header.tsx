// TODO: Create Header component with logo and navigation

import './Header.css';
import Favorites from '../../pages/Favorites';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo">Shunny Shop</div>
      <nav>
        <ul>
          <li>Home</li>
          <li>Products</li>
          <li>About</li>
          <li>Contact</li>         
        </ul>
      </nav>
    </header>
  );
};

export default Header;
