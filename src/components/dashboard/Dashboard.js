import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { db } from "../../firebase-config";
import moment from "moment";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../Auth";
// import { Bar } from "react-chartjs-2";
// import { chart as chartjs} from "chart.js/auto"
import { BarChart } from "../barChart/BarChart";

export const Dashboard = () => {
    const { user } = useAuth();
    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const expenseDataRef = collection(db, "expenseData");
    const userDataRef = collection(db, "userData");
    const [expenseData, setExpenseData] = useState([]);
    const userUid = sessionStorage.getItem("uid");
    const [threeRecent, setThreeRecent] = useState([]);
    const [recurringData, setRecurringData] = useState([]);
    const [barData, setBarData] = useState({
        labels: "No Data",
        datasets: [
            {
                label: "No Data",
                //fill: true,
                data: "0",
            },
        ],
    });
    

    // useEffect(() => { 
        // this is to add displayname to account if the user signed up by email 
        if (user.displayName == null) {
            const getUserData = async () => {
                const data = await getDocs(userDataRef);
                const userData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                const currentUserData = [];
                for (let i = 0; i < userData.length; i++) {
                    if (userData[i].uid === userUid) {
                        currentUserData.push(userData[i].fullName);
                    }
                }
                updateProfile(user, {
                    displayName: currentUserData[0],
                });
            };
            getUserData();
        }
    // }, [expenseData]);

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
            const currentUserExpenseData = [];
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].uid === userUid) {
                    currentUserExpenseData.push(userData[i]);
                }
            }
            setExpenseData(currentUserExpenseData);
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
                if (expenseData[i].recurring === true) {
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


useEffect(() => {
    const getData = async () => {
        if (expenseData !== {}) {
            console.log("larger");
            setBarData({
                labels: expenseData.map((data) => data.date),
                datasets: [
                    {
                        label: "Expenses",
                        //fill: true,
                        data: expenseData.map((data) => data.amount),
                    },
                ],
            });
        } else {
            console.log("less then");
            setBarData({
                labels: "No Data",
                datasets: [
                    {
                        label: "No Data",
                        //fill: true,
                        data: "0",
                    },
                ],
            });
        }
    };
    getData();
},[expenseData]);
console.log(barData)


    



    //CHART ZONE END*******************
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <h4>{userDisplayName}</h4>
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
                    <div className="chart-container">
                        <BarChart chartData={barData} />
                        
                    </div>
                    <div className="recent-expense-header">
                        <p>NAME/BUSINESS</p>
                        <p>TYPE</p>
                        <p>AMOUNT</p>
                        <p>DATE</p>
                    </div>
                    {threeMostRecent}
                </div>
                <div className="rightside-container">
                    <h4>Recurring Expenses</h4>
                    {recurring}
                </div>
            </div>
        </div>
    );
};
