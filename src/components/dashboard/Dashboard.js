import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { db } from "../../firebase-config";
import moment from "moment";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../../Auth";
import { Bar } from "react-chartjs-2";
import { chart as chartjs } from "chart.js/auto";
import { BarChart } from "../charts/BarChart";
import { LineChart } from "../charts/LineChart";

export const Dashboard = () => {

    const { user } = useAuth();
    const [userDisplayName, setUserDisplayName] = useState(user.displayName);
    const expenseDataRef = collection(db, "expenseData");
    const userDataRef = collection(db, "userData");
    const [expenseData, setExpenseData] = useState([]);
    const userUid = sessionStorage.getItem("uid");
    const [threeRecent, setThreeRecent] = useState([]);
    const [recurringData, setRecurringData] = useState([]);
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
        query(expenseDataRef, orderBy("date", "desc"), limit(3))
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


    useEffect(() => {
        const getExpenseData = async () => {
            const data = await getDocs(
                query(expenseDataRef, orderBy("date", "desc"))
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
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].uid === userUid) {
                    currentUserExpenseData.push(userData[i]);
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
            }
            currentUserExpenseData.reverse();
            monthlyExpense.reverse();
            dailyExpense.reverse();
            setExpenseData(currentUserExpenseData);
            setExpenseTotal(expenseAmount);
            setMonthlyChart(monthlyExpense);
            setMonthlyTotal(monthlyAmount);
            setDailyChart(dailyExpense);
            setDailyTotal(dailyAmount);
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
                <p>{data.date.substring(0, 10)}</p>
            </div>
        </div>
    ));

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


    const thisMonth = theDate.slice(5, 7);
    console.log("this month = " + months[parseInt(thisMonth) - 1]);
    // **********************************************************
    //*********NEED TO:
    // asign current month to chart and  */
    useEffect(() => {
        const getData = async () => {
            if (expenseData !== {} && dailyMonthlyTotal === "total") {
                setChartData({
                    labels: months.map((data) => data),
                    datasets: [
                        {
                            label: "All Expenses",
                            fill: true,
                            data: expenseData.map((data) => data.amount),
                            backgroundColor: "rgba(243, 86, 223, 0.5)",
                            borderRadius: 2,
                        },
                    ],
                });
            } else if (monthlyChart !== {} && dailyMonthlyTotal === "monthly") {
                setChartData({
                    labels: monthlyChart.map((data) => data.title),
                    datasets: [
                        {
                            label: "Monthly Expenses",
                            data: monthlyChart.map((data) => data.amount),
                            fill: true,
                            backgroundColor: "rgba(243, 86, 223, 0.5)",
                            borderRadius: 2,
                        },
                    ],
                });
            } else if (dailyChart !== {} && dailyMonthlyTotal === "daily") {
                setChartData({
                    labels: dailyChart.map((data) => data.title),

                    datasets: [
                        {
                            label: "Daily Expenses",
                            data: dailyChart.map((data) => data.amount),
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
    const hello = () => {
        console.log("hello");
    };
    const changeLineOrBar = () => {
        if (lineOrBar === "Bar") {
            setLineOrBar("Line");
        } else {
            setLineOrBar("Bar");
        }
    };
    getData();
  }, [expenseData, dailyMonthlyTotal]);
  const hello = () => {
    console.log("hello");
  };
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
        <h4>{userDisplayName}</h4>
      </div>
      <div className="left-and-right-container">
        <div className="leftside-container">
          <div className="three-totals">
            <div
              value="total"
              className={
                dailyMonthlyTotal === "total" ? "three-totals-activated" : null
              }
              onClick={() => {
                setDailyMonthlyTotal("total");
              }}
            >
              <h5>Total</h5>
              <h3>${total}</h3>
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
            <div
              className={
                dailyMonthlyTotal === "daily" ? "three-totals-activated" : null
              }
              onClick={() => {
                setDailyMonthlyTotal("daily");
              }}
            >
              <h5>Daily Total</h5> <h3>${daily}</h3>
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
            <h5 onClick={changeLineOrBar}>Change to {lineOrBar} Chart</h5>
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
