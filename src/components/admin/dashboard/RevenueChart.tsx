'use client'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export function RevenueChart({ data }: { data: Array<{ day: string; revenue: number }> }) {
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    }

    const chartData = {
        labels: data.map(item => item.day),
        datasets: [
            {
                label: 'Doanh thu',
                data: data.map(item => item.revenue),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    return <Bar options={options} data={chartData} />
}