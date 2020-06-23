import React, { useState, useEffect } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";

import Home from "./pages/Home/Home";
import Chat from "./pages/Chat/Chat";
import Profile from "./pages/Profile/Profile";
import Auth from "./pages/Auth/Auth";
import firebase from "./services/firebase";
import "./App.css";

const App = (props) => {
  const showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
        break;
      default:
        break;
    }
  };
  // const [auth, setAuth] = useState(false);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       setAuth(true);
  //       setLoading(false);
  //     } else {
  //       setAuth(false);
  //       setLoading(false);
  //     }
  //   });
  // }, []);
  //  loading ? (
  //   <div className="spinner-border text-success" role="status">
  //     <span className="sr-only">Loading...</span>
  //   </div>
  // ) :
  //  (
  return (
    <BrowserRouter>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        position={toast.POSITION.TOP_RIGHT}
      />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          path="/auth"
          render={(props) => <Auth showToast={showToast} {...props} />}
        />
        <Route
          path="/profile"
          render={(props) => <Profile showToast={showToast} {...props} />}
        />
        <Route
          path="/chat"
          render={(props) => <Chat showToast={showToast} {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
