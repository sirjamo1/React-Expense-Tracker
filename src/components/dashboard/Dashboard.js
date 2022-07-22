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
    const getRecurring = () => {
        
    };

    const theDate = moment().format("YYYY-MM-DD");
    const total = getTotal();
    const monthly = getMonthly();
    const daily = getDaily();

    const threeMostRecent = threeRecent.map((data) => (
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
        </div>
    ));
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="three-totals">
                <h1>Total:{total}</h1>
                <h1>Monthly Total:{monthly}</h1>
                <h1>Daily Total:{daily}</h1>
            </div>
            <div className="recent-expenses-header">
                <h4>Recent Expenses</h4>
                <button>
                    <Link to="/expenses">View All</Link>
                </button>
            </div>
            <div className="row-header">
                <p>NAME/BUSINESS</p>
                <p>TYPE</p>
                <p>AMOUNT</p>
                <p>DATE</p>
            </div>
            {threeMostRecent}
        </div>
    );
};
