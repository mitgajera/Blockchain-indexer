import React from 'react';
import { Line } from 'react-chartjs-2';
import { useExploitData } from '../../hooks/useExploitData';

const ResponseTimeChart = () => {
    const { responseTimeData } = useExploitData();

    const data = {
        labels: responseTimeData.map(item => item.date),
        datasets: [
            {
                label: 'Response Time (seconds)',
                data: responseTimeData.map(item => item.responseTime),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Response Time (seconds)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <h2>Response Time to Exploits</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default ResponseTimeChart;