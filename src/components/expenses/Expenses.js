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
    onSnapshot,
    query,
    setDoc,
    where,
    orderBy,
    // serverTimestamp
} from "firebase/firestore";

export const Expenses = () => {
    const userEmail = sessionStorage.getItem("email");
    const userUid = sessionStorage.getItem("uid");
    const userFirstName = sessionStorage.getItem("firstName");
    const userLastName = sessionStorage.getItem("lastName");
    const [expenseData, setExpenseData] = useState([]);
    const [dataTitle, setDataTitle] = useState();
    const [dataAmount, setDataAmount] = useState(0);
    const [dataType, setDataType] = useState();
    const [dataDate, setDataDate] = useState();
    const [dataRecurring, setDataRecurring] = useState(false);
    const expenseDataRef = collection(db, "expenseData");
    const [editBtnId, setEditBtnId] = useState();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const createOpen = () => {
        setIsCreateOpen(true);
    };
    const createClose = () => {
        setIsCreateOpen(false);
    };
    const [isEditOpen, setIsEditOpen] = useState(false);

    const editPopupOpen = () => {
        setIsEditOpen(true);
    };
    const editPopupClose = () => {
        setIsEditOpen(false);
    };
    const handleCurrentId = (e) => {
        setEditBtnId(e.currentTarget.id);
    };
    //userUid is from session storage
    const handleCreateData = async () => {
        await addDoc(expenseDataRef, {
            title: dataTitle,
            type: dataType,
            amount: dataAmount,
            date: dataDate,
            recurring: dataRecurring,
            key: nanoid(),
            uid: userUid,
        });
        setIsCreateOpen(false);
    };
    const handleEditData = async () => {
        const updateCurrent = doc(db, "expenseData", editBtnId);
        await updateDoc(updateCurrent, {
            title: dataTitle,
            type: dataType,
            amount: dataAmount,
            date: dataDate,
            recurring: dataRecurring,
            id: editBtnId,
        });
        setIsEditOpen(false);
    };
    const handleDeleteData = async () => {
        await deleteDoc(doc(db, "expenseData", editBtnId));
        setIsEditOpen(false);
    };
    const [currentExpense, setCurrentExpense] = useState([]);
    //when mouse enters the edit buttons parent div, it grabs it's id and compares it to expenseData id to make sure user edits/deletes the one they clicked on
    const changeExpense = () => {
        for (let i = 0; i < expenseData.length; i++) {
            if (expenseData[i].id === editBtnId) {
                setCurrentExpense(expenseData[i]);
                setDataTitle(expenseData[i].title);
                setDataAmount(expenseData[i].amount);
                setDataType(expenseData[i].type);
                setDataDate(expenseData[i].date);
                setDataRecurring(expenseData[i].recurring);
            }
        }
    };
    //renders rows of data each time edit or create expense popup is closed
    useEffect(() => {
        const getExpenseData = async () => {
            const data = await getDocs(expenseDataRef);
            const userData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            //only grabs the user who is logged in data
            const currentUserData = [];
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].uid === userUid) {
                    currentUserData.push(userData[i]);
                }
            }
            console.log(userData[0].uid);
            setExpenseData(currentUserData);
        };

        getExpenseData();
    }, [isCreateOpen, isEditOpen]);
    //offset is for popups placement
    const offset = {
        right: 400,
        bottom: 50,
    };
    const createPopup = (
        <Popup
            open={isCreateOpen}
            modal={true}
            closeOnDocumentClick
            offset={offset}
            show={true}
            className="popup-main"
            onClose={createClose}
            onOpen={createOpen}
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
                    <option value="" disabled selected>
                        Select your option
                    </option>
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
                        value="true"
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
            //open={isEditOpen} //here be dragons////////////////////
            modal={true}
            offset={offset}
            show={true}
            closeOnDocumentClick
            className="popup-main"
            onOpen={editPopupOpen}
            onClose={editPopupClose}
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
                    placeholder={currentExpense.title}
                    // value={currentExpense.title}
                ></input>
                <input
                    onChange={(event) => {
                        setDataAmount(event.target.value);
                    }}
                    type="number"
                    className="popup-amount"
                    placeholder={currentExpense.amount}
                    // value={currentExpense.amount}
                ></input>
                <select
                    onChange={(event) => {
                        setDataType(event.target.value);
                    }}
                    className="popup-select"
                    name="type"
                    // value={currentExpense.type}

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
                        value="1"
                    ></input>
                    <label>Recurring</label>
                </span>
                <p>{currentExpense.recurring}</p>
                <button className="popup-submit" onClick={handleEditData}>
                    Edit
                </button>
                <button className="popup-submit" onClick={handleDeleteData}>
                    Delete
                </button>
            </div>
        </Popup>
    );

    //rows of expense data
    const expenseDataElements = expenseData.map((data) => (
        <div className="row-data">
            <div>
                <p>{data.title}</p>
            </div>
            <div>
                <p>{data.type}</p>
            </div>
            <div>
                <p>${data.amount}</p>
            </div>
            <div>
                <p>{data.date}</p>
            </div>
            <div>
                <p>{data.id}</p>
            </div>
            <div onMouseEnter={handleCurrentId} id={data.id}>
                {editPopup}
            </div>
        </div>
    ));
    return (
        <div className="expenses--container">
            <div className="expenses-nav">
                <div className="nav-line1">
                    <h2>Expenses</h2>
                    <h5>Welcome {userFirstName}</h5>
                </div>
                <div className="nav-line2">
                    <div className="nav-line2-left">
                        <button className="search-btn">
                            {/* <i class="fa-solid fa-magnifying-glass-dollar"></i> */}
                        </button>
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
                    <li>get checkbox to return a boolean</li>
                    <li>
                        when clicking edit it opens all popups (sometimes) and
                        doesn't edit/delete the one that is clicked
                    </li>
                    <li>search bar</li>
                    <li>filter bar</li>
                    <li></li>
                </ul>
            </div>
        </div>
    );
};
