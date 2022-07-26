import React from "react";
import { Line } from "react-chartjs-2";
import { chart as chartjs } from "chart.js/auto";

export function LineChart({ chartData }) {
    // const expenseDataRef = collection(db, "expenseData");
    // const userUid = sessionStorage.getItem("uid");
    return <Line data={chartData} />;
}
