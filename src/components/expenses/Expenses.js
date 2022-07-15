import React from "react";
import "./Expenses.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export const Expenses = () => {
  const userEmail = sessionStorage.getItem("email");
  const offset = {
      right: 400,
      bottom: 50,
  };

  const handleCreateFormClick = () => {
    console.log("hello")

  }

  //NEED TO FINISH POPUP FORM TO CREATE DATA
    return (
        <div className="expenses--container">
            <div className="expenses-nav">
                <div className="nav-line1">
                    <h2>Expenses</h2>
                    <h5>{userEmail}</h5>
                </div>
                <div className="nav-line2">
                    <div className="nav-line2-left">
                        <button className="search-btn">O</button>
                        <input className="search" placeholder="Search"></input>
                    </div>
                    <div className="nav-line2-right">
                        <Popup
                            offset={offset}
                            show={true}
                            className="popup-main"
                            trigger={
                                <button className="create-expense-btn">
                                    Create Expense
                                </button>
                            }
                            position="bottom left"
                        >
                            <div className="popup--container">
                                <input
                                    className="popup-title"
                                    placeholder="Title"
                                ></input>
                                <input
                                    className="popup-amount"
                                    placeholder="Amount"
                                ></input>
                                <select
                                    className="popup-select"
                                    name="type"
                                    id="type"
                                >
                                    <option value="Mobile">Mobile</option>
                                    <option value="Entertainment">
                                        Entertainment
                                    </option>
                                    <option value="Software">Software</option>
                                    <option value="Technology">
                                        Technology
                                    </option>
                                    <option value="Withdraw">Withdraw</option>
                                    <option value="Payment">Payment</option>
                                </select>
                                <span>
                                    <input
                                        className="popup-date"
                                        type="date"
                                        placeholder="Title"
                                    ></input><input type="checkbox"></input><label>Recurring</label>
                                </span>
                                <button className="popup-submit">Add</button>
                            </div>
                        </Popup>
                        <button className="filter-btn">Filters</button>
                    </div>
                </div>
                <div className="row-header">
                    <p>NAME/BUSINESS</p>
                    <p>TYPE</p>
                    <p>AMOUNT</p>
                    <p>DATE</p>
                    <p>INVOICE ID</p>
                    <p>ACTION</p>
                </div>
                <h1>STILL WORKING ON THIS</h1>
            </div>
        </div>
    );
};
