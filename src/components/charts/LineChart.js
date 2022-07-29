import React from "react";
import { Line } from "react-chartjs-2";
import { chart as chartjs } from "chart.js/auto";

export function LineChart({ chartData }) {
    return (
        <Line
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
