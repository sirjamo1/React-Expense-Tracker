import React, { useState, useEffect } from "react";
//import "react-schedule-job/dist/index.css";
import "./Expenses.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { nanoid } from "nanoid";
import { db } from "../../firebase-config";
import { useAuth } from "../../Auth";
import magnifyingGlass from "../icons/magnifyingGlass.png";
import filter from "../icons/filter.png";
import create from "../icons/create.png";
import userIcon from "../icons/userIcon.png";
import Schedule from "react-schedule-job";
import moment from "moment";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";

export const Expenses = () => {
    const { user } = useAuth();
    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const [expenseData, setExpenseData] = useState([]);
    const [dataTitle, setDataTitle] = useState();
    const [dataAmount, setDataAmount] = useState(0);
    const [dataType, setDataType] = useState();
    const [dataDate, setDataDate] = useState();
    const [dataRecurring, setDataRecurring] = useState("off");
    const expenseDataRef = collection(db, "expenseData");
    const [editBtnId, setEditBtnId] = useState();
    const [refresh, setRefresh] = useState(false);

    const handleCurrentId = (e) => {
        setEditBtnId(e.currentTarget.id);
    };
    const handleCreateData = async () => {
        await addDoc(expenseDataRef, {
            title: dataTitle,
            type: dataType,
            amount: dataAmount,
            date: dataDate,
            created: serverTimestamp(),
            recurring: dataRecurring,
            key: nanoid(),
            uid: user.uid,
            email: user.email,
        });
        setDataRecurring("off");
        //setRefresh(!refresh);
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
            editDate: serverTimestamp(),
        });
        setDataRecurring("off");
        // setRefresh(!refresh);
    };
    const handleDeleteData = async () => {
        await deleteDoc(doc(db, "expenseData", editBtnId));
        // setRefresh(!refresh);
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
    // useEffect(() => {
    //     console.log("i am getting data");
    //     const userUid = user.uid;
    //     const getExpenseData = async () => {
    //         const data = await getDocs(
    //             query(
    //                 expenseDataRef,
    //                 where("uid", "==", userUid),
    //                 orderBy("date", "desc")
    //             )
    //         );
    //         const userData = data.docs.map((doc) => ({
    //             ...doc.data(),
    //             id: doc.id,
    //         }));
    //         //console.log({ userData });
    //         setExpenseData(userData);
    //     };

    //     getExpenseData();
    // }, [refresh]); //refresh should go here
    useEffect(() => {
        const userUid = user.uid;
        const unsub = onSnapshot(
            query(
                expenseDataRef,
                where("uid", "==", userUid),
                orderBy("date", "desc")
            ),
            (snapshot) => {
                setExpenseData(
                    snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                );
            }
        );

        return unsub;
    }, []);

    console.log(expenseData);
    //RECURRING ZONE************************
    const monthToNumber = (getMonth) => {
        let monthNumber = "";
        if (getMonth === "Jan") {
            monthNumber = "01";
        } else if (getMonth === "Feb") {
            monthNumber = "02";
        } else if (getMonth === "Mar") {
            monthNumber = "03";
        } else if (getMonth === "Apr") {
            monthNumber = "04";
        } else if (getMonth === "May") {
            monthNumber = "05";
        } else if (getMonth === "Jun") {
            monthNumber = "06";
        } else if (getMonth === "Jul") {
            monthNumber = "07";
        } else if (getMonth === "Aug") {
            monthNumber = "08";
        } else if (getMonth === "Sep") {
            monthNumber = "09";
        } else if (getMonth === "Oct") {
            monthNumber = "10";
        } else if (getMonth === "Nov") {
            monthNumber = "11";
        } else if (getMonth === "Dec") {
            monthNumber = "12";
        }
        return monthNumber;
    };

    //NEED TO FIND A WAY for it to add slowly
    const monthBeforeDate = moment().subtract(1, "months").format("YYYY-MM-DD");
    useEffect(() => {
        const addRecurring = () => {
            console.log("starting recurring");
            for (let i = 0; i < expenseData.length; i++) {
                let expenseDate = new Date(expenseData[i].date.slice(0, 10));
                let oneMonthBeforeToday = new Date(monthBeforeDate);
                const twoYearsAgo = -63372000000;
                // console.log({expenseDate})
                // console.log({oneMonthBeforeToday})
                // console.log(expenseDate - oneMonthBeforeToday)
                // 63072000000 milliseconds == 2 years
                if (
                    expenseData[i].recurring === true &&
                    expenseDate - oneMonthBeforeToday <= 0 &&
                    expenseDate - oneMonthBeforeToday > twoYearsAgo
                ) {
                    //  console.log({ expenseDate });
                    let newDate = new Date(
                        expenseDate.setMonth(expenseDate.getMonth() + 1)
                    );
                    let getDay = newDate.toString().slice(8, 10);
                    // console.log({ getDay });
                    let getMonth = newDate.toString().slice(4, 7);
                    // console.log({ getMonth });
                    let getMonthNum = monthToNumber(getMonth);
                    //console.log({ getMonthNum });
                    let getYear = newDate.toString().slice(11, 15);
                    // console.log({ getYear });
                    let newDateFormatted = `${getYear}-${getMonthNum}-${getDay}`;
                    console.log({ newDateFormatted });
                    addDoc(expenseDataRef, {
                        title: expenseData[i].title,
                        type: expenseData[i].type,
                        amount: expenseData[i].amount,
                        date: newDateFormatted,
                        created: serverTimestamp(),
                        recurring: true,
                        key: nanoid(),
                        uid: user.uid,
                        email: user.email,
                    });
                    const updateCurrent = doc(
                        db,
                        "expenseData",
                        expenseData[i].id
                    );
                    updateDoc(updateCurrent, {
                        // title:expenseData[i].title,
                        // type:expenseData[i].type,
                        // amount:expenseData[i].amount,
                        date: expenseData[i].date,
                        recurring: false,
                        hasRecurred: true,
                        recurredDate: newDateFormatted,
                    });
                }
            }
        };
        addRecurring();
    }, []);

    // addRecurring();
    // const jobs = [
    //     {
    //         fn: addRecurring,
    //         id: "1",
    //         schedule: "* * * * *",
    //     },
    // ];
    //********************************************** */

    const offsetPopup = {
        right: 400,
        bottom: 50,
    };
    const hasItRecurred = !currentExpense.hasRecurred ? (
        <span>
            <input
                className="recurring"
                name="recurring"
                onChange={(event) => {
                    setDataRecurring(event.target.checked);
                }}
                type="checkbox"
                defaultChecked={currentExpense.recurring}
            ></input>
            <label>Recurring</label>
        </span>
    ) : (
        <span>
            {currentExpense.title} recurred on {currentExpense.recurredDate}
        </span>
    );
    const createPopup = (
        <Popup
            modal={true}
            closeOnDocumentClick
            offset={offsetPopup}
            show={true}
            className="popup-main"
            // onClose={createClose}
            // onOpen={createOpen}
            trigger={
                <button className="create-expense-btn">
                    <img
                        src={create}
                        className="create-icon"
                        alt="create expense icon"
                    />
                    Create Expense
                </button>
            }
        >
            {(close) => (
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
                        <option defaultValue="" disabled selected>
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
                            type="datetime-local"
                            placeholder="Title"
                        ></input>
                        <input
                            className="recurring"
                            name="recurring"
                            onChange={(event) => {
                                setDataRecurring(event.target.checked);
                            }}
                            type="checkbox"
                        ></input>
                        <label>Recurring</label>
                    </span>
                    <button
                        className="popup-add"
                        onClick={() => {
                            handleCreateData();
                            close();
                        }}
                    >
                        Add
                    </button>
                </div>
            )}
        </Popup>
    );
    const editPopup = (
        <Popup
            modal={true}
            offset={offsetPopup}
            show={false}
            closeOnDocumentClick
            className="popup-main"
            nested
            trigger={
                <button
                    onMouseDown={changeExpense}
                    className="edit-expense-btn"
                >
                    Edit
                </button>
            }
        >
            {(close) => (
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
                            type="datetime-local"
                            value={currentExpense.date}
                        ></input>
                        {hasItRecurred}
                    </span>
                    <button
                        className="popup-edit"
                        onClick={() => {
                            handleEditData();
                            close();
                        }}
                    >
                        Edit
                    </button>
                    <Popup
                        trigger={
                            <button className="popup-delete">Delete</button>
                        }
                        position="top"
                    >
                        <div className="RUSure-container">
                            <p>Are you sure?</p>
                            <span>
                                {" "}
                                <button
                                    className="RUSure-yes-btn"
                                    onClick={() => {
                                        handleDeleteData();
                                        close();
                                    }}
                                >
                                    Yes
                                </button>
                                <button
                                    className="RUSure-no-btn"
                                    onClick={close}
                                >
                                    No
                                </button>
                            </span>
                        </div>
                    </Popup>
                </div>
            )}
        </Popup>
    );
    console.log(expenseData.map((data) => data.id));
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
                <p>{data.date.substring(0, 10)}</p>
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
                    <h1>Expenses</h1>
                    <h4>
                        <img
                            src={userIcon}
                            alt="user icon"
                            className="user-icon"
                        />
                        {userDisplayName}
                    </h4>
                </div>
                <div className="nav-line2">
                    <div className="nav-line2-left">
                        <button className="search-btn">
                            <img
                                src={magnifyingGlass}
                                alt="magnifying glass icon"
                            />
                        </button>
                        <input className="search" placeholder="Search"></input>
                    </div>
                    <div className="nav-line2-right">
                        {createPopup}
                        <button className="filter-btn">
                            <img
                                src={filter}
                                alt="filter -icon"
                                className="filter-icon"
                            />
                            Filters
                        </button>
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
                {/* <Schedule
                    jobs={jobs}
                    timeZone="UTC"
                    dashboard={{ hidden: true }}
                /> */}
            </div>
        </div>
    );
};
