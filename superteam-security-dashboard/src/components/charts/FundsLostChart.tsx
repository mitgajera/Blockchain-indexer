import React from 'react';
import { Line } from 'react-chartjs-2';
import { useExploitData } from '../../hooks/useExploitData';

const FundsLostChart = () => {
    const { fundsLostData } = useExploitData();

    const data = {
        labels: fundsLostData.map(entry => entry.date),
        datasets: [
            {
                label: 'Total Funds Lost',
                data: fundsLostData.map(entry => entry.amountLost),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Funds Lost (in USD)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container">
            <h2>Total Funds Lost Due to Exploits</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default FundsLostChart;