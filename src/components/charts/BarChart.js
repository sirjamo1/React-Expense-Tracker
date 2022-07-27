import React from 'react'
import { Bar } from "react-chartjs-2";
import {
    chart as chartjs,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js/auto";
// import faker from "faker";


export function BarChart({chartData})  {
  return (
    <Bar data={chartData} options={{responsive: true, plugins:{ title:{ display: true,
    text: "bar chart"}}}}/>
  )
}
