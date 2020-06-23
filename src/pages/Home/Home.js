import React from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Images from "../../images/images";
import "./Home.css";

const Home = () => {
  return (
    <React.Fragment>
      <Header />
      <div className="splash-container">
        <div className="splash">
          <h1 className="splash-head">Scream Chat</h1>
          <p className="splash-subhead">Let's get connected together</p>
          <div id="custom-button-wrapper">
            <Link to="/auth">
              <a className="my-super-cool-btn">
                <div className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <span className="buttoncoolText">Get Started</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="content-wrapper">
          <div className="content">
            <h2 className="content-head is-center">Features of Scream Chat</h2>
            <div className="Appfeatures">
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-rocket"></i>
                  Get Started Rapidly
                </h3>
                <p>Register once and connect with your loved ones</p>
              </div>
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-sign-in"></i>
                  Firebase Authentication
                </h3>
                <p>Firebase Authentication to ensure Secured chat</p>
              </div>
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-th-large"></i>
                  Media
                </h3>
                <p>Share images with your loved ones</p>
              </div>
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <i className="fa fa-refresh"></i>
                  Updates
                </h3>
                <p>
                  Constant updates will be released for better user experiance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
