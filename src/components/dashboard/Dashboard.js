import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { db } from "../../firebase-config";
import moment from "moment";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import userIcon from "../icons/userIcon.png";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
} from "firebase/firestore";
import { useAuth } from "../../Auth";
// import { Bar } from "react-chartjs-2";
// import { chart as chartjs} from "chart.js/auto"
import { BarChart } from "../charts/BarChart";
import { LineChart } from "../charts/LineChart";

const Dashboard = () => {
    const { user } = useAuth();
    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const expenseDataRef = collection(db, "expenseData");
    const userDataRef = collection(db, "userData");
    const [expenseData, setExpenseData] = useState([]);
    const userUid = sessionStorage.getItem("uid");
    const [recurringData, setRecurringData] = useState([]);
    const [threeRecent, setThreeRecent] = useState([]);
    const [expenseTotal, setExpenseTotal] = useState();
    const [monthlyChart, setMonthlyChart] = useState();
    const [monthlyTotal, setMonthlyTotal] = useState();
    const [dailyChart, setDailyChart] = useState();
    const [dailyTotal, setDailyTotal] = useState();
    const [dailyMonthlyTotal, setDailyMonthlyTotal] = useState("total");
    const [lineOrBar, setLineOrBar] = useState("Bar");
    const [chartData, setChartData] = useState({
        labels: "No Data",
        datasets: [
            {
                label: "No Data",
                data: "0",
            },
        ],
    });
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const time = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
    ];
    if (user.displayName == null) {
        const getUserData = async () => {
            const data = await getDocs(
                query(userDataRef, where("uid", "==", userUid))
            );
            console.log(data);
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

    useEffect(() => {
        const getExpenseData = async () => {
            const data = await getDocs(
                query(
                    expenseDataRef,
                    where("uid", "==", userUid),
                    orderBy("date", "desc")
                )
            );
            const userData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            const currentUserExpenseData = [];
            let expenseAmount = 0;
            const monthlyExpense = [];
            let monthlyAmount = 0;
            const dailyExpense = [];
            let dailyAmount = 0;
            const three = [];
            for (let i = 0; i < userData.length; i++) {
                currentUserExpenseData.push(userData[i]);
                three.push(userData[i]);
                expenseAmount += parseInt(userData[i].amount);
                if (userData[i].date.slice(0, 7) === theDate.slice(0, 7)) {
                    monthlyExpense.push(userData[i]);
                    monthlyAmount += parseInt(userData[i].amount);
                }
                if (userData[i].date.slice(0, 10) === theDate) {
                    dailyExpense.push(userData[i]);
                    dailyAmount += parseInt(userData[i].amount);
                }
            }
            setExpenseData(currentUserExpenseData.reverse());
            setExpenseTotal(expenseAmount);
            setMonthlyChart(monthlyExpense.reverse());
            setMonthlyTotal(monthlyAmount);
            setDailyChart(dailyExpense.reverse());
            setDailyTotal(dailyAmount);
            setThreeRecent(three);
        };
        getExpenseData();
    }, []);

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
    console.log(theDate);
    const recurring = recurringData.map((data) => (
        <div className="recurring-div">
            <p>{data.title}</p>
            <p>${data.amount}</p>
        </div>
    ));
    const threeMostRecent = threeRecent.slice(0, 3).map((data) => (
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
                <p>{data.date.substring(0, 10)}</p>
            </div>
        </div>
    ));

    const thisMonth = theDate.slice(5, 7);
    const getCurrentMonth = () => {
        let today = new Date();
        let end = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0
        ).getDate();
        let result = [];
        for (let i = 1; i <= end; i++) {
            result.push(
                today.getFullYear() +
                    "-" +
                    thisMonth +
                    "-" +
                    (i < 10 ? "0" + i : i)
            );
        }
        return result;
    };
    const currentMonth = getCurrentMonth();
//**********************************NEED TO:***************************************
//change labels to repersent what expense they were for */
    useEffect(() => {
        const getData = async () => {
            if (expenseData !== {} && dailyMonthlyTotal === "total") {
                const totalFinal = [];
                expenseData.forEach(function (expenseData) {
                    let tChart = {
                        x: expenseData.date.substring(0, 10),
                        y: expenseData.amount,
                        label: expenseData.title,
                    };
                    totalFinal.push(tChart);
                });
                console.log(totalFinal);
                setChartData({
                    labels: expenseData.map((data) =>
                        data.date.substring(0, 10)
                    ),
                    datasets: [
                        {
                            label: "All Expenses",
                            fill: true,
                            data: totalFinal,
                            backgroundColor: "rgba(243, 86, 223, 0.5)",
                            borderRadius: 2,                    
                        },
                    ],
                });
            } else if (monthlyChart !== {} && dailyMonthlyTotal === "monthly") {
                const monthlyFinal = [];
                monthlyChart.forEach(function (monthlyChart) {
                    let chart = {
                        x: monthlyChart.date.substring(0, 10),
                        y: monthlyChart.amount,
                        label: monthlyChart.title,
                    };
                    monthlyFinal.push(chart);
                });
                console.log(monthlyFinal);
                setChartData({
                    labels: currentMonth.map((data) => data),
                    datasets: [
                        {
                            label: months[parseInt(thisMonth) - 1],
                            data: monthlyFinal,
                            fill: true,
                            backgroundColor: "rgba(243, 86, 223, 0.5)",
                            borderRadius: 2,
                        },
                    ],
                });
            } else if (dailyChart !== {} && dailyMonthlyTotal === "daily") {
                const dailyFinal = [];
                dailyChart.forEach(function (dailyChart) {
                    let chart = {
                        x: dailyChart.date.substring(11, 13),
                        y: dailyChart.amount,
                        label: dailyChart.title,
                    };
                    dailyFinal.push(chart);
                });
                setChartData({
                    labels: time.map((data) => data),

                    datasets: [
                        {
                            label: "Daily Expenses",
                            data: dailyFinal,
                            fill: true,
                            backgroundColor: "rgba(243, 86, 223, 0.5)",
                            borderRadius: 2,
                            active: true,
                        },
                    ],
                });
            }
        };
        getData();
    }, [expenseData, dailyMonthlyTotal]);
    const changeLineOrBar = () => {
        if (lineOrBar === "Bar") {
            setLineOrBar("Line");
        } else {
            setLineOrBar("Bar");
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <h4>
                   
                    <img
                        src={userIcon}
                        alt="user icon"
                        className="user-icon"
                    />
                    {userDisplayName}
                </h4>
            </div>
            <div className="left-and-right-container">
                <div className="leftside-container">
                    <div className="three-totals">
                        <div
                            value="total"
                            className={
                                dailyMonthlyTotal === "total"
                                    ? "three-totals-activated"
                                    : null
                            }
                            onClick={() => {
                                setDailyMonthlyTotal("total");
                            }}
                        >
                            <h5>Total</h5>
                            <h3>${expenseTotal}</h3>
                        </div>
                        <div
                            className={
                                dailyMonthlyTotal === "monthly"
                                    ? "three-totals-activated"
                                    : null
                            }
                            onClick={() => {
                                setDailyMonthlyTotal("monthly");
                            }}
                        >
                            <h5>Monthly Total</h5> <h3>${monthlyTotal}</h3>
                        </div>
                        <div
                            className={
                                dailyMonthlyTotal === "daily"
                                    ? "three-totals-activated"
                                    : null
                            }
                            onClick={() => {
                                setDailyMonthlyTotal("daily");
                            }}
                        >
                            <h5>Daily Total</h5> <h3>${dailyTotal}</h3>
                        </div>
                    </div>
                    <div className="chart-container">
                        {lineOrBar === "Bar" ? (
                            <LineChart chartData={chartData} />
                        ) : (
                            <BarChart chartData={chartData} />
                        )}
                    </div>
                    <div className="recent-expenses-title">
                        <h4>Recent Expenses</h4>
                        <h5 onClick={changeLineOrBar}>
                            Change to {lineOrBar} Chart
                        </h5>
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
                <div className="rightside-container">
                    <h4>Recurring Expenses</h4>
                    {recurring}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
