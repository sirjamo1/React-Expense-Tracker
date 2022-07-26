import React from 'react'
import { Bar } from "react-chartjs-2";
import { chart as chartjs } from "chart.js/auto";


export function BarChart({chartData})  {
 // const expenseDataRef = collection(db, "expenseData");
// const userUid = sessionStorage.getItem("uid");
  return (
    <Bar data={chartData} />
  )
}
