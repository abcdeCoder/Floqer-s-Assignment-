// src/components/LineGraph.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import jobData from '../../data/salaries.json'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);





const LineGraph: React.FC = () => {
    const stats = jobData.reduce((acc, job): any => {
        if (!acc[job.work_year]) {
            acc[job.work_year] = 0;
        }
        acc[job.work_year] += 1;
        return acc;
    }, {} as Record<number, number>);

    const years = [2020, 2021, 2022, 2023, 2024];
    const jobCounts = years.map(year => stats[year] || 0);

    const data = {
        labels: years,
        datasets: [
            {
                label: 'Total Number of Jobs',
                data: jobCounts,
                borderColor: 'rgba(83, 191, 40,1)',
                backgroundColor: 'rgba(1, 209, 216,0.4)',
                fill: true,
                height:100,
                width:100,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: ' total Number of Jobs from 2020 to 2024',
            },
        },
    };

    return <div style={{ width: '900px', height: '700px' }}>
    <Line data={data} options={options} />
         </div>;
};

export default LineGraph;
