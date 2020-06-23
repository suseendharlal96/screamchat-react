import React from "react";
import { Link } from "react-router-dom";

import "./Header.css";

const Header = () => {
  return (
    <header className="header-login-signup">
      <div className="header-limiter">
        <h1>
          <Link to="/">
            Scream<span>Chat</span>
          </Link>
        </h1>
        <nav>
          <Link to="/">Home</Link>
          <a className="selected">
            <Link to="/">About App</Link>
          </a>
          <a>
            <Link to="/">Contact Us</Link>
          </a>
        </nav>
        <ul>
          <li>
            <Link to="/auth">Signin/Signup</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
