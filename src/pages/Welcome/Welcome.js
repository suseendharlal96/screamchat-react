import React from "react";

import "./Welcome.css";
const Welcome = (props) => {
  return (
    <div className="viewWelcomeBoard">
      <img src={props.profilePic} className="avatarWelcome" alt="" />
      <span className="textTileWelcome">{`Welcome, ${props.username}`}</span>
      <span className="textDescriptionWelcome">
        Let's get connected together
      </span>
    </div>
  );
};

export default Welcome;
