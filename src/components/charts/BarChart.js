import React from "react";
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

export function BarChart({ chartData }) {
    return (
        <Bar
            data={chartData}
            options={{
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                console.log(context.raw.label);
                                return `${context.raw.label} $${context.raw.y}`;
                            },
                        },
                    },
                },
            }}
        />
    );
}
