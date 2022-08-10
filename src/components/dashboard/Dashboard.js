import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { db } from "../../firebase-config";
import moment from "moment";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import Header from "../header/Header";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
} from "firebase/firestore";
import { useAuth } from "../../Auth";
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
    const [yearlyExpenseChart, setYearlyExpenseChart] = useState(); 
    const [yearlyExpenseTotal, setYearlyExpenseTotal] = useState();
    const [yearlyIncomeChart, setYearlyIncomeChart] = useState(); 
    const [yearlyIncomeTotal, setYearlyIncomeTotal] = useState(); 
    const [monthlyExpenseChart, setMonthlyExpenseChart] = useState(); 
    const [monthlyIncomeChart, setMonthlyIncomeChart] = useState();
    const [monthlyIncomeTotal, setMonthlyIncomeTotal] = useState();
    const [monthlyExpenseTotal, setMonthlyExpenseTotal] = useState();
    const [dailyExpenseChart, setDailyExpenseChart] = useState();
    const [dailyExpenseTotal, setDailyExpenseTotal] = useState();
    const [dailyIncomeChart, setDailyIncomeChart] = useState();
    const [dailyIncomeTotal, setDailyIncomeTotal] = useState();
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
            const yearlyExpense = [];
            let yearlyExpenseAmount = 0;
            const yearlyIncome = [];
            let yearlyIncomeAmount = 0;
            const monthlyExpense = [];
            let monthlyExpenseAmount = 0;
            const monthlyIncome = [];
            let monthlyIncomeAmount = 0;
            const dailyExpense = [];
            let dailyExpenseAmount = 0;
            const dailyIncome = [];
            let dailyIncomeAmount = 0;

            const three = [];
            for (let i = 0; i < userData.length; i++) {
                currentUserExpenseData.push(userData[i]);
                three.push(userData[i]);
                if (userData[i].date.slice(0, 4) === theDate.slice(0, 4)) {
                    if (userData[i].incomeOrExpense === "expense") {
                        yearlyExpense.push(userData[i]); 
                        yearlyExpenseAmount += parseInt(userData[i].amount); 
                    } else {
                        yearlyIncome.push(userData[i]); 
                        yearlyIncomeAmount += parseInt(userData[i].amount); 
                    }
                }
                if (userData[i].date.slice(0, 7) === theDate.slice(0, 7)) {
                    if (userData[i].incomeOrExpense === "expense") {
                        monthlyExpense.push(userData[i]);
                        monthlyExpenseAmount += parseInt(userData[i].amount); 
                    } else {
                        monthlyIncome.push(userData[i]);
                        monthlyIncomeAmount += parseInt(userData[i].amount);
                    }
                }
                if (userData[i].date.slice(0, 10) === theDate) {
                    if (userData[i].incomeOrExpense === "expense") {
                        dailyExpense.push(userData[i]);
                        dailyExpenseAmount += parseInt(userData[i].amount);
                    } else {
                        dailyIncome.push(userData[i]);
                        dailyIncomeAmount += parseInt(userData[i].amount);
                    }
                }
            }

            setExpenseData(currentUserExpenseData.reverse());
            setYearlyExpenseChart(yearlyExpense.reverse());
            setYearlyExpenseTotal(yearlyExpenseAmount);
            setYearlyIncomeChart(yearlyIncome.reverse());
            setYearlyIncomeTotal(yearlyIncomeAmount);
            setMonthlyExpenseChart(monthlyExpense.reverse());
            setMonthlyExpenseTotal(monthlyExpenseAmount);
            setMonthlyIncomeChart(monthlyIncome.reverse());
            setMonthlyIncomeTotal(monthlyIncomeAmount);
            setDailyExpenseChart(dailyExpense.reverse());
            setDailyExpenseTotal(dailyExpenseAmount);
            setDailyIncomeChart(dailyIncome.reverse());
            setDailyIncomeTotal(dailyIncomeAmount);
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
    const recurring = recurringData.map((data) => (
        <div className={data.incomeOrExpense === "income" ? "recurring-div-income" : "recurring-div-expense"}>
            <p>{data.title}</p>
            <p>${data.amount}</p>
        </div>
    ));
    const threeMostRecent = threeRecent.slice(0, 3).map((data) => (
        <div
            className={
                data.incomeOrExpense === "income"
                    ? "recent-expenses-data income"
                    : "recent-expenses-data expense"
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

    useEffect(() => {
        const getData = async () => {
            if (yearlyExpenseChart !== {} && dailyMonthlyTotal === "total") {
                const monthsExpense = [];
                months.forEach((month) => {
                    let monthPlusAmount = {
                        month: month,
                        amount: 0,
                        label: month,
                    };
                    monthsExpense.push(monthPlusAmount);
                });
                yearlyExpenseChart.map((expense) => {
                    let month = parseInt(expense.date.substring(5, 7), 10) - 1;
                    monthsExpense[month].amount += parseInt(expense.amount);
                });
                const totalExpenseFinal = [];
                monthsExpense.forEach(function (yearlyExpenseChart) {
                    let chartExpense = {
                        x: yearlyExpenseChart.month,
                        y: yearlyExpenseChart.amount,
                        label: yearlyExpenseChart.month,
                    };
                    totalExpenseFinal.push(chartExpense);
                });
                const monthsIncome = [];
                months.forEach((month) => {
                    let monthPlusAmount = {
                        month: month,
                        amount: 0,
                        label: month,
                    };
                    monthsIncome.push(monthPlusAmount);
                });
                yearlyIncomeChart.map((income) => {
                    let month = parseInt(income.date.substring(5, 7), 10) - 1;
                    monthsIncome[month].amount += parseInt(income.amount);
                });
                const totalIncomeFinal = [];
                monthsIncome.forEach(function (yearlyIncomeChart) {
                    let chartIncome = {
                        x: yearlyIncomeChart.month,
                        y: yearlyIncomeChart.amount,
                        label: yearlyIncomeChart.month,
                    };
                    totalIncomeFinal.push(chartIncome);
                });
                setChartData({
                    labels: months.map((data) => data),
                    datasets: [
                        {
                            label: "Yearly Expenses",
                            fill: true,
                            data: totalExpenseFinal,
                            borderColor: "rgba(255, 6, 6, 1)",
                            backgroundColor: "rgba(255, 6, 6, 0.3)",
                            borderRadius: 2,
                        },
                        {
                            label: "Yearly Income",
                            fill: true,
                            data: totalIncomeFinal,
                            borderColor: "rgba(6, 236, 6, 1)",
                            backgroundColor: "rgba(6, 236, 6, 0.3)",
                            borderRadius: 2,
                        },
                    ],
                });
            } else if (
                monthlyExpenseChart !== {} &&
                dailyMonthlyTotal === "monthly"
            ) {
                const monthlyExpenseFinal = [];
                monthlyExpenseChart.forEach(function (monthlyExpenseChart) {
                    let chartExpense = {
                        x: monthlyExpenseChart.date.substring(0, 10),
                        y: monthlyExpenseChart.amount,
                        label: monthlyExpenseChart.title,
                    };
                    monthlyExpenseFinal.push(chartExpense);
                });
                const monthlyIncomeFinal = [];
                monthlyIncomeChart.forEach(function (monthlyIncomeChart) {
                    let chartIncome = {
                        x: monthlyIncomeChart.date.substring(0, 10),
                        y: monthlyIncomeChart.amount,
                        label: monthlyIncomeChart.title,
                    };
                    monthlyIncomeFinal.push(chartIncome);
                });
                setChartData({
                    labels: currentMonth.map((data) => data),
                    datasets: [
                        {
                            label: months[parseInt(thisMonth) - 1],
                            data: monthlyExpenseFinal,
                            fill: true,
                            borderColor: "rgba(255, 6, 6, 1)",
                            backgroundColor: "rgba(255, 6, 6, 0.3)",
                            borderRadius: 2,
                        },
                        {
                            label: months[parseInt(thisMonth) - 1],
                            data: monthlyIncomeFinal,
                            fill: true,
                            borderColor: "rgba(6, 236, 6, 1)",
                            backgroundColor: "rgba(6, 236, 6, 0.3)",
                            borderRadius: 2,
                        },
                    ],
                });
            } else if (
                dailyExpenseChart !== {} &&
                dailyMonthlyTotal === "daily"
            ) {
                const dailyExpenseFinal = [];
                dailyExpenseChart.forEach(function (dailyExpenseChart) {
                    let chart = {
                        x: dailyExpenseChart.date.substring(11, 13),
                        y: dailyExpenseChart.amount,
                        label: dailyExpenseChart.title,
                    };
                    dailyExpenseFinal.push(chart);
                });
                const dailyIncomeFinal = [];
                dailyIncomeChart.forEach(function (dailyIncomeChart) {
                    let chart = {
                        x: dailyIncomeChart.date.substring(11, 13),
                        y: dailyIncomeChart.amount,
                        label: dailyIncomeChart.title,
                    };
                    dailyIncomeFinal.push(chart);
                });
                setChartData({
                    labels: time.map((data) => data),

                    datasets: [
                        {
                            label: "Daily Expenses",
                            data: dailyExpenseFinal,
                            fill: true,
                            borderColor: "rgba(255, 6, 6, 1)",
                            backgroundColor: "rgba(255, 6, 6, 0.3)",
                            borderRadius: 2,
                            active: true,
                        },
                        {
                            label: "Daily Income",
                            data: dailyIncomeFinal,
                            fill: true,
                            borderColor: "rgba(6, 236, 6, 1)",
                            backgroundColor: "rgba(6, 236, 6, 0.3)",
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
            <Header headerTitle={"Dashboard"}/>

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
                            <h5>Yearly</h5>
                            <h6>Income : ${yearlyIncomeTotal}</h6>
                            <h6>Expenses : $-{yearlyExpenseTotal}</h6>
                            <h6>
                                Total : $
                                {yearlyIncomeTotal - yearlyExpenseTotal}{" "}
                            </h6>
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
                            <h5>Monthly</h5>
                            <h6>Income : ${monthlyIncomeTotal}</h6>
                            <h6>Expenses : $-{monthlyExpenseTotal}</h6>
                            <h6>
                                Total : $
                                {monthlyIncomeTotal - monthlyExpenseTotal}
                            </h6>
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
                            <h5>Daily</h5>
                            <h6>Income : ${dailyIncomeTotal}</h6>
                            <h6>Expenses : $-{dailyExpenseTotal}</h6>
                            <h6>
                                Total : ${dailyIncomeTotal - dailyExpenseTotal}
                            </h6>
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
                        <h4>Recent Transactions</h4>
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
                    <h4>Recurring Transactions</h4>
                    {recurring}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
