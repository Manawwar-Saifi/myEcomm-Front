import React from "react";
import {NavLink} from 'react-router-dom';

import thanks from "../../public/bg/thank.webp";

const Thanks = () => {
  return (
    <div className="thanksPage">
      <div className="inner-div">
        <img src={thanks} alt="" />
        <NavLink to="/" className="btn btn-outline-danger">Back to Home</NavLink>
      </div>
    </div>
  );
};

export default Thanks;
