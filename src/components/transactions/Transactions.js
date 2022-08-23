import React, { useState, useEffect } from "react";
import "./Transactions.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { nanoid } from "nanoid";
import { db } from "../../firebase-config";
import { useAuth } from "../../Auth";
import magnifyingGlass from "../icons/magnifyingGlass.png";
import filter from "../icons/filter.png";
import create from "../icons/create.png";
import userIcon from "../icons/userIcon.png";
import moment from "moment";
import Header from "../header/Header";
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

export const Transactions = () => {
    const { user } = useAuth();
    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const [expenseData, setExpenseData] = useState([]);
    const [dataTitle, setDataTitle] = useState();
    const [dataAmount, setDataAmount] = useState(0);
    const [dataType, setDataType] = useState();
    const [dataDate, setDataDate] = useState();
    const [dataRecurring, setDataRecurring] = useState(false);
    const [searchBar, setSearchBar] = useState("");
    const expenseDataRef = collection(db, "expenseData");
    const [editBtnId, setEditBtnId] = useState();
    const [dataForRows, setDataForRows] = useState(expenseData);
    const [reverseOrder, setReverseOrder] = useState(true);
    const [filterOption, setFilterOption] = useState("date");
    const [xDaysAgo, setXDaysAgo] = useState(0);
    const [redoRecurring, setRedoRecurring] = useState(false);
    const [incomeOrExpense, setIncomeOrExpense] = useState();
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
            incomeOrExpense: incomeOrExpense,
        });
        setDataRecurring(false);
        setRedoRecurring(!redoRecurring);
    };

    const handleCurrentId = (e) => {
        setEditBtnId(e.currentTarget.id);
    };
    console.log({ xDaysAgo });
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
        setDataRecurring(false);
        setRedoRecurring(!redoRecurring);
    };
    const handleDeleteData = async () => {
        await deleteDoc(doc(db, "expenseData", editBtnId));
        setDataRecurring(false);
    };
    const [currentExpense, setCurrentExpense] = useState([]);
    useEffect(() => {
        const changeExpense = (e) => {
            expenseData.map((data) => {
                if (data.id === editBtnId) {
                    setCurrentExpense(data);
                    setDataTitle(data.title);
                    setDataAmount(data.amount);
                    setDataType(data.type);
                    setDataDate(data.date);
                    setDataRecurring(data.recurring);
                    setIncomeOrExpense(data.incomeOrExpense);
                }
            });
        };

        changeExpense();
    }, [editBtnId]);
    console.log(user);
    useEffect(() => {
        console.log("getting data");
        const userUid = user.uid;
        const getExpenseData = async () => {
            const unsub = await onSnapshot(
                query(
                    expenseDataRef,
                    where("uid", "==", userUid),
                    orderBy("date", "desc")
                ),
                (snapshot) => {
                    setExpenseData(
                        snapshot.docs.map((doc) => ({
                            ...doc.data(),
                            id: doc.id,
                        }))
                    );
                }
            );
            return unsub;
        };
        getExpenseData();
    }, []);

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
    const monthBeforeDate = moment().subtract(1, "months").format("YYYY-MM-DD");

    useEffect(() => {
        const addRecurring = async () => {
            const data = await getDocs(
                query(
                    expenseDataRef,
                    where("uid", "==", user.uid),
                    where("recurring", "==", true),
                    orderBy("date", "desc")
                )
            );
            const expenseData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            for (let i = 0; i < expenseData.length; i++) {
                let expenseDate = new Date(expenseData[i].date.slice(0, 10));
                let oneMonthBeforeToday = new Date(monthBeforeDate);
                const twoYearsAgo = -63372000000;
                if (
                    expenseData[i].recurring === true &&
                    expenseDate - oneMonthBeforeToday <= 0 &&
                    expenseDate - oneMonthBeforeToday > twoYearsAgo
                ) {
                    let newDate = new Date(
                        expenseDate.setMonth(expenseDate.getMonth() + 1)
                    );
                    let getDay = newDate.toString().slice(8, 10);
                    let getMonth = newDate.toString().slice(4, 7);
                    let getMonthNum = monthToNumber(getMonth);
                    let getYear = newDate.toString().slice(11, 15);
                    let newDateFormatted = `${getYear}-${getMonthNum}-${getDay}`;
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
                        incomeOrExpense: expenseData[i].incomeOrExpense,
                    });
                    const updateCurrent = await doc(
                        db,
                        "expenseData",
                        expenseData[i].id
                    );
                    updateDoc(updateCurrent, {
                        date: expenseData[i].date,
                        recurring: false,
                        hasRecurred: true,
                        recurredDate: newDateFormatted,
                        incomeOrExpense: expenseData[i].incomeOrExpense,
                    });
                    setRedoRecurring(!redoRecurring);
                }
            }
        };
        addRecurring();
    }, [redoRecurring]);

    const offsetPopup = {
        right: 400,
        bottom: 50,
    };
    const hasItRecurred = !currentExpense.hasRecurred ? (
        <div className="recurring-container">
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
        </div>
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
            onOpen={(event) => {
                setDataRecurring(false);
            }}
            trigger={
                <button className="create-transaction-btn">
                    <img
                        src={create}
                        className="create-icon"
                        alt="create transaction icon"
                    />
                    Create Income/Expense
                </button>
            }
        >
            {(close) => (
                <form className="popup--container">
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
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        onChange={(event) => {
                            setDataDate(event.target.value);
                        }}
                        className="popup-date"
                        type="datetime-local"
                        placeholder="Title"
                    ></input>
                    <div className="recurring-container">
                        <input
                            className="recurring"
                            name="recurring"
                            onChange={(event) => {
                                setDataRecurring(event.target.checked);
                            }}
                            type="checkbox"
                        ></input>

                        <label className="recurring-label">
                            Recurring <span>(up to 2 years prior)</span>
                        </label>
                    </div>
                    <div className="radio-btn-container">
                        <input
                            className="radio-btn"
                            type="radio"
                            name="size"
                            value="income"
                            id="income"
                            onChange={(event) => {
                                setIncomeOrExpense(event.target.value);
                            }}
                        ></input>
                        <label for="income">Income</label>

                        <input
                            className="radio-btn"
                            type="radio"
                            name="size"
                            value="expense"
                            id="expense"
                            onChange={(event) => {
                                setIncomeOrExpense(event.target.value);
                            }}
                        ></input>
                        <label for="expense">Expense</label>
                    </div>

                    <button
                        className="popup-add"
                        onClick={(e) => {
                            e.preventDefault();
                            handleCreateData();
                            close();
                        }}
                    >
                        Add
                    </button>
                </form>
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
            trigger={<button className="edit-transaction-btn">Edit</button>}
        >
            {(close) => (
                <form className="popup--container">
                    <input
                        onChange={(event) => {
                            setDataTitle(event.target.value);
                        }}
                        className="popup-title"
                        placeholder={currentExpense.title}
                    ></input>
                    <input
                        onChange={(event) => {
                            setDataAmount(event.target.value);
                        }}
                        type="number"
                        className="popup-amount"
                        placeholder={currentExpense.amount}
                    ></input>
                    <select
                        onChange={(event) => {
                            setDataType(event.target.value);
                        }}
                        className="popup-select"
                        name="type"
                        placeholder={currentExpense.type}
                        id="type"
                    >
                        <option value="Mobile">Mobile</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Software">Software</option>
                        <option value="Technology">Technology</option>
                        <option value="Withdraw">Withdraw</option>
                        <option value="Payment">Payment</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        onChange={(event) => {
                            setDataDate(event.target.value);
                        }}
                        className="popup-date"
                        type="datetime-local"
                        value={currentExpense.date}
                    ></input>
                    <div className="recurred-container">{hasItRecurred}</div>

                    <button
                        className="popup-edit"
                        onClick={(e) => {
                            e.preventDefault();
                            handleEditData();
                            close();
                        }}
                    >
                        Edit
                    </button>
                    <Popup
                        trigger={
                            <button
                                type="button"
                                className="popup-delete"
                                onClick={(e) => e.preventDefault()}
                            >
                                Delete
                            </button>
                        }
                        position="top"
                    >
                        <div className="RUSure-container">
                            <p>Are you sure?</p>
                            <span>
                                <button
                                    type="button"
                                    className="RUSure-yes-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteData();
                                        close();
                                    }}
                                >
                                    Yes
                                </button>
                                <button
                                    className="RUSure-no-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        close();
                                    }}
                                >
                                    No
                                </button>
                            </span>
                        </div>
                    </Popup>
                </form>
            )}
        </Popup>
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [searchBar, expenseData]);

    const handleSearch = () => {
        console.log("searching..");
        if (searchBar === "") {
            setDataForRows(expenseData);
        } else {
            let searchedData = [];
            expenseData.map((data) => {
                let n = searchBar.length;
                if (
                    searchBar.toLowerCase() ===
                        data.title.toLowerCase().slice(0, [n]) ||
                    searchBar.toLowerCase() ===
                        data.type.toLowerCase().slice(0, [n]) ||
                    searchBar === data.date.slice(0, [n]) ||
                    searchBar === data.amount.slice(0, [n])
                ) {
                    searchedData.push(data);
                }
            });
            setDataForRows(searchedData);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleXDaysSearch();
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [xDaysAgo, expenseData]);

    const handleXDaysSearch = () => {
        if (xDaysAgo === 0 || xDaysAgo === "") {
            setDataForRows(expenseData);
            handleSearch();
        } else {
            handleSearch();
            let xDaysAgoData = [];
            const days = xDaysAgo;
            const xDaysBefore = moment()
                .subtract({ days }, "days")
                .format("YYYY-MM-DD");
            dataForRows.map((data) => {
                let expenseDate = new Date(data.date.slice(0, 10));
                let xDaysDate = new Date(xDaysBefore);
                if (xDaysDate - expenseDate <= 0) {
                    xDaysAgoData.push(data);
                }
            });
            setDataForRows(xDaysAgoData);
        }
    };

    dataForRows.sort((a, b) => {
        if (filterOption === "title") {
            const A = a.title.toLowerCase();
            const B = b.title.toLowerCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        } else if (filterOption === "type") {
            const A = a.type.toLowerCase();
            const B = b.type.toLowerCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        } else if (filterOption === "date") {
            const A = a.date;
            const B = b.date;
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        } else if (filterOption === "amount") {
            const A =
                a.incomeOrExpense === "expense"
                    ? -parseInt(a.amount)
                    : parseInt(a.amount);
            console.log(A);
            const B =
                b.incomeOrExpense === "expense"
                    ? -parseInt(b.amount)
                    : parseInt(b.amount);
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        } else if (filterOption === "id") {
            const A = a.amount.toLowerCase();
            const B = b.amount.toLowerCase();
            if (A < B) {
                return -1;
            }
            if (A > B) {
                return 1;
            }
            return 0;
        }
        return a - b;
    });

    const filterPopup = (
        <Popup
            closeOnDocumentClick
            show={true}
            className="popup-filter"
            position="left top"
            trigger={
                <button className="filter-btn">
                    <img
                        src={filter}
                        alt="filter -icon"
                        className="filter-icon"
                    />
                    Filters
                </button>
            }
        >
            {(close) => (
                <div className="popup-filter-container">
                    <div
                        style={{
                            backgroundColor:
                                filterOption === "date" ? "aqua" : "white",
                        }}
                        onClick={() => {
                            setFilterOption("date");

                            close();
                        }}
                    >
                        Date
                    </div>
                    <div
                        style={{
                            backgroundColor:
                                filterOption === "title" ? "aqua" : "white",
                        }}
                        onClick={() => {
                            setFilterOption("title");

                            close();
                        }}
                    >
                        Name/Business
                    </div>
                    <div
                        style={{
                            backgroundColor:
                                filterOption === "type" ? "aqua" : "white",
                        }}
                        onClick={() => {
                            setFilterOption("type");

                            close();
                        }}
                    >
                        Type
                    </div>
                    <div
                        style={{
                            backgroundColor:
                                filterOption === "amount" ? "aqua" : "white",
                        }}
                        onClick={() => {
                            setFilterOption("amount");

                            close();
                        }}
                    >
                        Amount
                    </div>
                    <div
                        style={{
                            backgroundColor:
                                filterOption === "id" ? "aqua" : "white",
                        }}
                        onClick={() => {
                            setFilterOption("id");

                            close();
                        }}
                    >
                        Invoice Id
                    </div>
                    <div
                        onClick={() => {
                            setReverseOrder(!reverseOrder);
                            close();
                        }}
                    >
                        {reverseOrder === false
                            ? "Descending Order"
                            : "Ascending Order"}
                    </div>
                </div>
            )}
        </Popup>
    );
    const expenseDataElements = (
        reverseOrder === false ? dataForRows : dataForRows.reverse()
    ).map((data) => (
        <div
            className={
                data.incomeOrExpense === "income"
                    ? "row-data income"
                    : "row-data expense"
            }
        >
            <div>
                <p>{data.title}</p>
            </div>
            <div>
                <p>{data.type}</p>
            </div>
            <div>
                {data.incomeOrExpense === "income" ? (
                    <p>${data.amount}</p>
                ) : (
                    <p>-${data.amount}</p>
                )}
            </div>
            <div>
                <p>{data.date.substring(0, 10)}</p>
            </div>
            <div>
                <p>{data.id}</p>
            </div>
            <div onMouseDownCapture={handleCurrentId} id={data.id}>
                {editPopup}
            </div>
        </div>
    ));
    return (
        <div className="transactions--container">
            <Header headerTitle={"Transactions"} />
            <div className="transactions-div">
                <div className="nav-line2">
                    <div className="nav-line2-left">
                        <button
                            className="search-btn"
                            onClick={() => handleSearch()}
                        >
                            <img
                                className="magnifyingGlass"
                                src={magnifyingGlass}
                                alt="magnifying glass icon"
                            />
                        </button>
                        <input
                            className="search"
                            placeholder="Search"
                            onChange={(event) => {
                                setSearchBar(event.target.value);
                            }}
                        ></input>
                    </div>
                    <div className="nav-line2-right">
                        {createPopup}
                        {filterPopup}
                        <div>
                            <input
                                className="x-days-ago"
                                type="number"
                                placeholder="X Days Ago"
                                onChange={(event) => {
                                    setXDaysAgo(event.target.value);
                                }}
                            />
                        </div>
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
                <div className="row-data-container">{expenseDataElements}</div>
            </div>
        </div>
    );
};
