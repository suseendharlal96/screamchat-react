import React from "react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer m-box is-center">
        <h2 variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          {"Scream Chat "}
          {new Date().getFullYear()}
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
