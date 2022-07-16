import React, { useState, useEffect } from "react";
import "./Expenses.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { nanoid } from "nanoid";
import { db } from "../../firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    //query,
    // serverTimestamp
} from "firebase/firestore";

export const Expenses = () => {
    const userEmail = sessionStorage.getItem("email");
    const offset = {
        right: 400,
        bottom: 50,
    };
    const [expenseData, setExpenseData] = useState([]);
    const [dataTitle, setDataTitle] = useState();
    const [dataAmount, setDataAmount] = useState(0);
    const [dataType, setDataType] = useState();
    const [dataDate, setDataDate] = useState();
    const [dataRecurring, setDataRecurring] = useState(false);
    const expenseDataRef = collection(db, "expenseData");
    const [editBtnId, setEditBtnId] = useState();
    const handleCurrentId = (e) => {
        setEditBtnId(e.currentTarget.id);
    };
    const handleCreateData = async () => {
        await addDoc(expenseDataRef, {
            title: dataTitle,
            type: dataType,
            amount: dataAmount,
            date: dataDate,
            recurring: dataRecurring,
            id: nanoid(),
            key: nanoid(),
        });
        console.log(expenseDataRef);
    };
    const handleEditData = async () => {
        await updateDoc(expenseDataRef, {
            title: dataTitle,
            type: dataType,
            amount: dataAmount,
            date: dataDate,
            recurring: dataRecurring,
            id: nanoid(),
            
        });
        console.log(expenseDataRef);
    };
    const [currentExpense, setCurrentExpense] = useState([])
        const changeExpense = () => {
            let checked = "checked"
            for(let i = 0; i < expenseData.length; i++) {
                if (expenseData[i].id == editBtnId) {
                    setCurrentExpense(expenseData[i])
                    
                } 
            }          
        };
console.log({currentExpense})
    useEffect(() => {
        const getExpenseData = async () => {
            const data = await getDocs(expenseDataRef);
            setExpenseData(
                data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        };
        getExpenseData();
    }, []);
  
    const createPopup = (
        <Popup
            offset={offset}
            show={true}
            className="popup-main"
            trigger={
                <button className="create-expense-btn">Create Expense</button>
            }
        >
            <div className="popup--container">
                <input
                    onChange={(event) => {
                        setDataTitle(event.target.value);
                    }}
                    className="popup-title"
                    placeholder="Title"
                ></input>
                <input
                    onChange={(event) => {
                        setDataAmount(event.target.value);
                    }}
                    type="number"
                    className="popup-amount"
                    placeholder="Amount"
                ></input>
                <select
                    onChange={(event) => {
                        setDataType(event.target.value);
                    }}
                    className="popup-select"
                    name="type"
                    id="type"
                >
                    <option value="Mobile">Mobile</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Software">Software</option>
                    <option value="Technology">Technology</option>
                    <option value="Withdraw">Withdraw</option>
                    <option value="Payment">Payment</option>
                </select>
                <span>
                    <input
                        onChange={(event) => {
                            setDataDate(event.target.value);
                        }}
                        className="popup-date"
                        type="date"
                        placeholder="Title"
                    ></input>
                    <input
                        onChange={(event) => {
                            setDataRecurring(event.target.value);
                        }}
                        type="checkbox"
                    ></input>
                    <label>Recurring</label>
                </span>
                <button className="popup-submit" onClick={handleCreateData}>
                    Add
                </button>
            </div>
        </Popup>
    );
    const editPopup = (
        <Popup
            offset={offset}
            show={true}
            className="popup-main"
            trigger={
                <button
                    onMouseDown={changeExpense}
                    className="edit-expense-btn"
                >
                    Edit
                </button>
            }
        >
            <div className="popup--container">
                <input
                    onChange={(event) => {
                        setDataTitle(event.target.value);
                    }}
                    className="popup-title"
                    placeholder="Title"
                    value={currentExpense.title}
                ></input>
                <input
                    onChange={(event) => {
                        setDataAmount(event.target.value);
                    }}
                    type="number"
                    className="popup-amount"
                    placeholder="Amount"
                    value={currentExpense.amount}
                ></input>
                <select
                    onChange={(event) => {
                        setDataType(event.target.value);
                    }}
                    className="popup-select"
                    name="type"
                    value={currentExpense.type}
                    id="type"
                >
                    <option value="Mobile">Mobile</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Software">Software</option>
                    <option value="Technology">Technology</option>
                    <option value="Withdraw">Withdraw</option>
                    <option value="Payment">Payment</option>
                </select>
                <span>
                    <input
                        onChange={(event) => {
                            setDataDate(event.target.value);
                        }}
                        className="popup-date"
                        type="date"
                        value={currentExpense.date}
                    ></input>
                    <input
                        onChange={(event) => {
                            setDataRecurring(event.target.value);
                        }}
                        type="checkbox"
                        defaultChecked={currentExpense.recurring}
                    ></input>
                    <label>Recurring</label>
                </span>
                <p>{currentExpense.recurring}</p>
                <button className="popup-submit" onClick={handleEditData}>
                    Edit
                </button>
            </div>
        </Popup>
    );
    const expenseDataElements = expenseData.map((data) => (
        <div className="row-data">
            <div>
                <p>{data.title}</p>
            </div>
            <div>
                <p>{data.type}</p>
            </div>
            <div>
                <p>{data.amount}</p>
            </div>
            <div>
                <p>{data.date}</p>
            </div>
            <div>
                <p>{data.id}</p>
            </div>
            <div onMouseEnter={handleCurrentId} id={data.id}>{editPopup}</div>
        </div>
    ));
    //NEED TO :
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
                        {createPopup}
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
                {expenseDataElements}
                <h1>NEED TO: </h1>
                <ul>
                    <li>update firebase expense</li>
                    <li>after creating expense popup goes away</li>
                    <li>delete expense button</li>
                    <li>after creating page update</li>
                    <li></li>
                </ul>
            </div>
        </div>
    );
};
