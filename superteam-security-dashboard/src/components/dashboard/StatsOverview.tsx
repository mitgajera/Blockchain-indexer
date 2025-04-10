import React from 'react';

const StatsOverview: React.FC = () => {
    return (
        <div className="stats-overview">
            <h2 className="text-xl font-bold mb-4">Statistics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Exploits</h3>
                    <p className="text-2xl">123</p>
                </div>
                <div className="stat-card bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Funds Lost</h3>
                    <p className="text-2xl">$1,234,567</p>
                </div>
                <div className="stat-card bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Average Response Time</h3>
                    <p className="text-2xl">5 mins</p>
                </div>
                <div className="stat-card bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Vulnerabilities Detected</h3>
                    <p className="text-2xl">45</p>
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;