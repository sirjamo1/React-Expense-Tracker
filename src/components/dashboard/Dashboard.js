import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { db } from "../../firebase-config";
import moment from "moment";
import { Link } from "react-router-dom";
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
    limit,
    // serverTimestamp
} from "firebase/firestore";

export const Dashboard = () => {
    const expenseDataRef = collection(db, "expenseData");
    const [expenseData, setExpenseData] = useState([]);
    const userUid = sessionStorage.getItem("uid");
    const [threeRecent, setThreeRecent] = useState([]);
    const [recurringData, setRecurringData] = useState([]);
     const userFirstName = sessionStorage.getItem("firstName");
     const userLastName = sessionStorage.getItem("lastName");

    useEffect(() => {
        const getThreeRecent = async () => {
            const data = await getDocs(
                query(expenseDataRef, orderBy("created", "desc"), limit(3))
            );
            const userData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            const currentUserData = [];
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].uid === userUid) {
                    currentUserData.push(userData[i]);
                }
            }
            setThreeRecent(currentUserData);
        };

        getThreeRecent();
    }, []);

    useEffect(() => {
        const getExpenseData = async () => {
            const data = await getDocs(expenseDataRef);
            const userData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            const currentUserData = [];
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].uid === userUid) {
                    currentUserData.push(userData[i]);
                }
            }
            setExpenseData(currentUserData);
        };
        getExpenseData();
    }, []);

    const getTotal = () => {
        let total = 0;
        for (let i = 0; i < expenseData.length; i++) {
            let number = parseInt(expenseData[i].amount);
            total += number;
        }
        return total;
    };

    const getMonthly = () => {
        let total = 0;
        for (let i = 0; i < expenseData.length; i++)
            if (expenseData[i].date.slice(0, 7) === theDate.slice(0, 7)) {
                let number = parseInt(expenseData[i].amount);
                total += number;
            }
        return total;
    };

    const getDaily = () => {
        let total = 0;
        for (let i = 0; i < expenseData.length; i++)
            if (expenseData[i].date === theDate) {
                let number = parseInt(expenseData[i].amount);
                total += number;
            }
        return total;
    };
    useEffect(() => {
        const getRecurring = () => {
            const recurringList = [];
            for (let i = 0; i < expenseData.length; i++) {
                if (expenseData[i].recurring) {
                    recurringList.push(expenseData[i]);
                }
            }
            setRecurringData(recurringList);
        };
        getRecurring();
    }, [expenseData]);
    const theDate = moment().format("YYYY-MM-DD");
    const total = getTotal();
    const monthly = getMonthly();
    const daily = getDaily();
    const recurring = recurringData.map((data) => (
        <div className="recurring-div">
            <p>{data.title}</p>
            <p>${data.amount}</p>
        </div>
    ));
    const threeMostRecent = threeRecent.map((data) => (
        <div className="recent-expenses-data">
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
        </div>
    ));
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <h4>{userFirstName} {userLastName}</h4>
            </div>
            <div className="left-and-right-container">
                <div className="leftside-container">
                    <div className="three-totals">
                        <h1>Total:{total}</h1>
                        <h1>Monthly Total:{monthly}</h1>
                        <h1>Daily Total:{daily}</h1>
                    </div>
                    <div className="recent-expenses-title">
                        <h4>Recent Expenses</h4>
                        <button>
                            <Link to="/expenses">View All</Link>
                        </button>
                    </div>
                    <div className="recent-expense-header">
                        <p>NAME/BUSINESS</p>
                        <p>TYPE</p>
                        <p>AMOUNT</p>
                        <p>DATE</p>
                    </div>
                    {threeMostRecent}
                </div>
                <div className="rightside-container"><h4>Recurring Expenses</h4>{recurring}</div>
            </div>
        </div>
    );
};
