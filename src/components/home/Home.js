import React from 'react'
import "./Home.css"
import {Link} from "react-router-dom"

export const Home = () => {
  return (
      <div>
          {" "}
          <h4>
              Don't have an account?<Link to="/signin"> Create one</Link>
          </h4>
      </div>
  );
}
