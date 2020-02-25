import React, { Component } from 'react';

import logo from '../../../../images/logo/baandalogo-2.png';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer-bar">
        {/* <nav className="navbar fixed-bottom navbar-expand-sm bg-dark navbar-dark justify-content-center footer-msg"> */}
        <nav className="navbar fixed-bottom navbar-expand-sm bg-dark navbar-dark justify-content-center footer-msg footer-bar">
          Copyright &copy; {new Date().getFullYear()} Baanda Inc.&nbsp;{' '}
          {/* <img className="logof" src={logo} alt="logo" width="35" height="25"/> */}
          <img className="logof" src={logo} alt="logo" />
        </nav>
      </footer>
    );
  }
  z;
}

export default Footer;
