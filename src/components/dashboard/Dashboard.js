import React from 'react'
import "./Dashboard.css"

export const Dashboard = () => {
  return (
      <div className="popup--container">
          <input className="popup-title" placeholder="Title"></input>
          <input className="popup-amount" placeholder="Amount"></input>
          <select className="popup-select" name="type" id="type">
              <option value="Mobile">Mobile</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Software">Software</option>
              <option value="Technology">Technology</option>
              <option value="Withdraw">Withdraw</option>
              <option value="Payment">Payment</option>
          </select>
          <input
              className="popup-date"
              type="date"
              placeholder="Title"
          ></input>
          <button className='popup-submit'>Add</button>
      </div>
  );
}
