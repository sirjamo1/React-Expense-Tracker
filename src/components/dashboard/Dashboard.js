import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { db } from "../../firebase-config";
import moment from "moment";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import Header from "../header/Header";
import { useMediaQuery } from "react-responsive";
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
    const mobile = useMediaQuery({ query: `(max-width: 400px)` });
    const [chartData, setChartData] = useState({
        labels: "No Data",
        datasets: [
            {
                label: "No Data",
                data: "0",
            },
        ],
    });
    const months = !mobile
        ? [
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
          ]
        : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
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
    const theDate = moment().format("YYYY-MM-DD");
    useEffect(() => {
        const getRecurring = () => {
            const recurringList = [];
            expenseData.map((data) => {
                if (data.recurring) {
                    recurringList.push(data);
                }
            });
            setRecurringData(recurringList);
        };
        getRecurring();
    }, [expenseData]);
    const recurring = recurringData.map((data) =>
        data.recurring ? (
            <div key={data.key}
                className={
                    data.incomeOrExpense === "income"
                        ? "recurring-div-income"
                        : "recurring-div-expense"
                }
            >
                <p>{data.title}</p>
                <p>${data.amount}</p>
            </div>
        ) : (
            <div className="recurring-div-income">
                <p>No recurring data found</p>
            </div>
        )
    );

    const threeMostRecent = threeRecent.slice(0, 3).map((data) => (
        <div key={data.key}
            className={
                data.incomeOrExpense === "income"
                    ? "recent-transactions-data income"
                    : "recent-transactions-data expense"
            }
        >
            <div>
                <p>{data.title}</p>
            </div>
            {!mobile ? <div>
                <p>{data.type}</p>
            </div> : <></>}
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
                            backgroundColor: "rgba(6, 236, 6, 0.2)",
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
    const threeTotals = (
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
                <h6>
                    Income : $
                    <span className="positive">{yearlyIncomeTotal}</span>
                </h6>
                <h6>
                    Expenses : $-
                    <span className="negative">{yearlyExpenseTotal}</span>
                </h6>
                <h6>
                    Total : $
                    <span
                        className={
                            yearlyIncomeTotal - yearlyExpenseTotal >= 0
                                ? "positive"
                                : "negative"
                        }
                    >
                        {yearlyIncomeTotal - yearlyExpenseTotal}
                    </span>
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
                <h6>
                    Income : $
                    <span className="positive">{monthlyIncomeTotal}</span>
                </h6>
                <h6>
                    Expenses : $-
                    <span className="negative">{monthlyExpenseTotal}</span>
                </h6>
                <h6>
                    Total : $
                    <span
                        className={
                            monthlyIncomeTotal - monthlyExpenseTotal >= 0
                                ? "positive"
                                : "negative"
                        }
                    >
                        {monthlyIncomeTotal - monthlyExpenseTotal}
                    </span>
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
                <h6>
                    Income : $
                    <span className="positive">{dailyIncomeTotal}</span>
                </h6>
                <h6>
                    Expenses : $-
                    <span className="negative">{dailyExpenseTotal}</span>
                </h6>
                <h6>
                    Total : $
                    <span
                        className={
                            dailyIncomeTotal - dailyExpenseTotal >= 0
                                ? "positive"
                                : "negative"
                        }
                    >
                        {dailyIncomeTotal - dailyExpenseTotal}
                    </span>
                </h6>
            </div>
        </div>
    );
    return (
        <div className="dashboard-container">
            <Header headerTitle={"Dashboard"} />

            <div className="left-and-right-container">
                <div className="leftside-container">
                    {threeTotals}

                    <div className="chart-container">
                        {lineOrBar === "Bar" ? (
                            <LineChart chartData={chartData} />
                        ) : (
                            <BarChart chartData={chartData} />
                        )}
                    </div>
                    <div className="recent-transactions-title">
                        <h4>Recent Transactions</h4>
                        <h5 onClick={changeLineOrBar}>
                            Change to {lineOrBar} Chart
                        </h5>
                        <button>
                            <Link to="/transactions">View All</Link>
                        </button>
                    </div>

                    <div className="recent-transactions-header">
                        <p>NAME/BUSINESS</p>
                        {!mobile ? <p>TYPE</p> : <></>}
                        <p>AMOUNT</p>
                        <p>DATE</p>
                    </div>
                    {threeMostRecent}
                </div>
                <div className="rightside-container">
                    <h4>Recurring Transactions</h4>
                    <div className="recurring-data-container">{recurring}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
